'use client'

import { Bouton } from '@/components/ui/Bouton'
import { Champ, ChampLong } from '@/components/ui/Champ'
import { FlecheGauche, Valide } from '@/components/ui/Icones'
import { Option } from '@/components/ui/Option'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { repondreEtape, sauterEtape, suggererPseudos } from '../actions'
import { type Etape, slugPrecedent } from '../etapes'
import { memoriserSens } from './TransitionEtape'

/**
 * Formulaire d'une étape. Un seul composant pour les sept écrans : la forme
 * est lue dans `etape.type`.
 *
 * Le composant reçoit une `Etape` (données statiques du fichier de
 * définitions), jamais un DTO de profil complet — on ne sérialise vers le
 * navigateur que ce qui est nécessaire à l'affichage.
 */
export function FormulaireEtape({
  etape,
  valeursInitiales,
}: {
  etape: Etape
  valeursInitiales: Record<string, string | readonly string[] | null>
}) {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<{ champ?: string; message: string } | null>(null)
  // Le bouton traverse trois états : repos, envoi, validé. Le dernier est
  // maintenu 480 ms avant de changer d'écran — sans cette pause, la coche
  // s'afficherait puis disparaîtrait dans le même souffle, et la personne
  // n'aurait aucune confirmation que sa réponse est partie.
  const [valide, setValide] = useState(false)

  // Compteur de la bio (étape 6). Déclaré ici pour rester au même niveau que
  // les autres états du formulaire.
  const [bio, setBio] = useState(String(valeursInitiales.bio ?? ''))
  const restants = (etape.maxCaracteres ?? 0) - bio.length

  // --- Suggestions de pseudo (étape « nom » uniquement) ---
  const [prenom, setPrenom] = useState(String(valeursInitiales.prenom ?? ''))
  const [pseudo, setPseudo] = useState(String(valeursInitiales.pseudo ?? ''))
  const [suggestions, setSuggestions] = useState<string[]>([])
  // Une fois le pseudo touché à la main, on cesse de proposer : rien de plus
  // agaçant qu'un champ qui se remplit tout seul pendant qu'on écrit dedans.
  const pseudoTouche = useRef(String(valeursInitiales.pseudo ?? '').length > 0)

  useEffect(() => {
    if (etape.type !== 'texte' || pseudoTouche.current) return
    if (prenom.trim().length < 2) {
      setSuggestions([])
      return
    }
    // Attente avant l'appel : sans elle, on interroge la base à chaque touche.
    const minuteur = setTimeout(() => {
      suggererPseudos(prenom)
        .then(setSuggestions)
        .catch(() => setSuggestions([]))
    }, 450)
    return () => clearTimeout(minuteur)
  }, [prenom, etape.type])

  // Sélection courante, pour les deux formes de choix. Elle est tenue ici et
  // non par le navigateur, pour deux raisons : un bouton radio natif ne sait
  // pas revenir à l'état vide une fois choisi, et le formulaire a besoin de
  // savoir s'il peut activer « Continuer ».
  const [selection, setSelection] = useState<string[]>(() => {
    const initiale = valeursInitiales[etape.champ]
    if (Array.isArray(initiale)) return [...initiale]
    return typeof initiale === 'string' && initiale.length > 0 ? [initiale] : []
  })

  function basculerChoix(valeur: string) {
    setSelection((actuelle) => {
      if (etape.type === 'choix-multiple') {
        return actuelle.includes(valeur)
          ? actuelle.filter((v) => v !== valeur)
          : [...actuelle, valeur]
      }
      // Choix unique : recliquer sur l'option cochée la libère.
      return actuelle[0] === valeur ? [] : [valeur]
    })
  }

  /**
   * Le bouton n'est actif que si l'étape a de quoi être enregistrée.
   *
   * Laisser « Continuer » toujours cliquable rendait le premier clic
   * décevant : il ne produisait qu'un message d'erreur. Un bouton grisé dit
   * la même chose sans faire perdre un aller-retour.
   *
   * Les étapes sautables (bio, photo) restent toujours actives : ne rien
   * remplir y est une réponse valable.
   */
  const peutContinuer = (() => {
    if (etape.sautable) return true
    if (etape.type === 'choix-unique' || etape.type === 'choix-multiple') {
      return selection.length > 0
    }
    if (etape.type === 'texte') {
      return prenom.trim().length >= 2 && pseudo.trim().length >= 3
    }
    return true
  })()

  function envoyer(donnees: FormData) {
    setErreur(null)
    demarrer(async () => {
      const resultat = await repondreEtape(etape.slug, donnees)
      if (!resultat.ok) {
        setErreur({ champ: resultat.champ, message: resultat.message })
        return
      }
      setValide(true)
      memoriserSens('avant')
      // La coche reste affichée le temps d'être vue. Sans cette pause, elle
      // apparaîtrait et disparaîtrait dans le même souffle, et la personne
      // n'aurait aucune confirmation que sa réponse est partie.
      await new Promise((r) => setTimeout(r, 480))
      router.push(resultat.suivant ? `/onboarding/${resultat.suivant}` : '/onboarding/termine')
    })
  }

  const precedent = slugPrecedent(etape.slug)

  function revenir() {
    if (!precedent) return
    memoriserSens('arriere')
    router.push(`/onboarding/${precedent}`)
  }

  function passer() {
    demarrer(async () => {
      const resultat = await sauterEtape(etape.slug)
      if (!resultat.ok) {
        setErreur({ message: resultat.message })
        return
      }
      router.push(resultat.suivant ? `/onboarding/${resultat.suivant}` : '/onboarding/termine')
    })
  }

  const erreurDe = (champ: string) => (erreur?.champ === champ ? erreur.message : undefined)

  return (
    <form action={envoyer} className="flex flex-col gap-8">
      {(etape.type === 'choix-unique' || etape.type === 'choix-multiple') && etape.options ? (
        <fieldset className="border-0 p-0">
          <legend className="sr-only">{etape.titre}</legend>
          <div
            className={
              // 12 px entre les colonnes, 10 px entre les rangs — relevé sur
              // les nœuds Figma 142:5 à 142:20.
              etape.colonnes === 2
                ? 'grid grid-cols-1 gap-x-[12px] gap-y-[10px] sm:grid-cols-2'
                : 'grid grid-cols-1 gap-y-[10px]'
            }
          >
            {etape.options.map((option) => {
              const multiple = etape.type === 'choix-multiple'
              const coche = selection.includes(option.valeur)
              return (
                <Option
                  key={option.valeur}
                  nom={etape.champ}
                  valeur={option.valeur}
                  libelle={option.libelle}
                  multiple={multiple}
                  coche={coche}
                  surClic={basculerChoix}
                />
              )
            })}
          </div>
        </fieldset>
      ) : null}

      {etape.type === 'texte' ? (
        <div className="flex flex-col gap-[calc(20*var(--u))]">
          <Champ
            id="prenom"
            name="prenom"
            label="Prénom"
            placeholder="Camille"
            autoComplete="given-name"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            erreur={erreurDe('prenom')}
            required
          />
          <Champ
            id="pseudo"
            name="pseudo"
            label="Pseudo"
            // Pas de texte d'exemple ici : le préfixe dit déjà le format, et
            // un exemple placé juste après le curseur le fait passer pour un
            // séparateur entre deux textes gris. Les pseudos proposés sous le
            // champ jouent le rôle d'exemple, en mieux — ils sont cliquables.
            prefixe="lurnly.io/@"
            autoComplete="off"
            spellCheck={false}
            value={pseudo}
            onChange={(e) => {
              pseudoTouche.current = true
              setPseudo(e.target.value)
            }}
            erreur={erreurDe('pseudo')}
            required
          />

          {suggestions.length > 0 && !pseudoTouche.current ? (
            <div className="flex flex-wrap items-center gap-[calc(8*var(--u))]">
              <span className="text-[var(--t-13)] text-[var(--texte-3)]">Libres :</span>
              {suggestions.map((propose) => (
                <button
                  key={propose}
                  type="button"
                  onClick={() => {
                    setPseudo(propose)
                    pseudoTouche.current = true
                    setSuggestions([])
                  }}
                  className="rounded-[var(--radius-pastille)] border border-[var(--filet)] bg-[var(--surface)] px-[calc(10*var(--u))] py-[calc(5*var(--u))] text-[var(--t-13)] font-medium text-[var(--texte-2)] transition-colors hover:border-[var(--filet-appuye)] hover:text-[var(--texte)]"
                >
                  {propose}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {etape.type === 'texte-long' ? (
        <ChampLong
          id="bio"
          name="bio"
          label="Votre présentation"
          maxLength={etape.maxCaracteres}
          value={bio}
          aide={`${restants} caractères restants`}
          erreur={erreurDe('bio')}
          onChange={(e) => setBio(e.target.value)}
        />
      ) : null}

      {etape.type === 'photo' ? (
        <div className="flex flex-col gap-3">
          {/* L'upload réel passe par Supabase Storage côté client authentifié ;
              la Server Action ne reçoit qu'un chemin. */}
          <input type="hidden" name="photo_url" value={String(valeursInitiales.photo_url ?? '')} />
          <div className="flex h-[220px] items-center justify-center rounded-[var(--radius-carte)] border border-dashed border-[var(--filet-appuye)] text-[var(--t-14)] text-[var(--texte-3)]">
            Déposez une image, ou cliquez pour parcourir
          </div>
        </div>
      ) : null}

      {erreur && !erreur.champ ? (
        <p role="alert" className="text-[14px] font-medium">
          {erreur.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-[calc(14*var(--u))]">
        {/* Pendant l'envoi, l'icône remplace le libellé plutôt que de le
            changer en « Un instant… ». Le bouton ne propose plus rien : il
            travaille. Un texte qui change de longueur ferait en plus sauter
            la largeur du bouton à chaque clic. */}
        <Bouton type="submit" disabled={enCours || !peutContinuer} occupe={enCours} pleineLargeur>
          {valide ? <Valide taille="1.45em" /> : 'Continuer'}
        </Bouton>

        {/* Retour à l'étape précédente.
            Sans ce lien, une erreur commise à l'étape 1 ne se rattrape qu'en
            recommençant tout le parcours : on la découvre trois écrans plus
            loin et il n'y a plus rien à faire. Les réponses sont enregistrées
            à chaque étape, donc revenir ne perd rien. */}
        {/* Rangée secondaire, centrée sous le bouton principal : elle partage
            son axe, celui du libellé « Continuer », plutôt que de traîner dans
            un coin. Quand l'étape est sautable, « Retour » et « Plus tard »
            se placent de part et d'autre de cet axe. */}
        <div className="flex items-center justify-center gap-[calc(20*var(--u))]">
          {/* Retour à l'étape précédente.
              Trois choix pour qu'il se lise comme un contrôle sans rivaliser
              avec « Continuer » :
              — la couleur du corps de texte (`--texte-2`), pas celle de l'aide,
                qui était trop pâle pour un élément cliquable ;
              — une zone de survol matérialisée, plutôt qu'un simple
                changement de couleur : on voit qu'il y a quelque chose à
                cliquer avant de cliquer ;
              — un centrage sous le bouton, décidé par Robin : le lien partage
                l'axe du libellé « Continuer » au lieu de traîner dans un coin.
              La flèche est dessinée en SVG plutôt qu'empruntée à une police :
              elle suit la graisse du texte et recule au survol. */}
          {precedent ? (
            <button
              type="button"
              onClick={revenir}
              disabled={enCours}
              className="group flex items-center gap-[calc(9*var(--u))] rounded-[var(--radius-bouton)] px-[calc(12*var(--u))] py-[calc(9*var(--u))] text-[var(--t-145)] font-medium text-[var(--texte-2)] transition-colors duration-150 hover:bg-[rgb(16_12_8_/_0.05)] hover:text-[var(--texte)] disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <FlecheGauche
                taille="1.1em"
                className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-[2px]"
              />
              Retour
            </button>
          ) : null}

          {etape.sautable ? (
            <Bouton variante="discret" onClick={passer} disabled={enCours}>
              Plus tard
            </Bouton>
          ) : null}
        </div>
      </div>
    </form>
  )
}
