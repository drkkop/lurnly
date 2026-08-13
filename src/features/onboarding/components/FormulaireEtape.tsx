'use client'

import { Bouton } from '@/components/ui/Bouton'
import { Champ, ChampLong } from '@/components/ui/Champ'
import { Option } from '@/components/ui/Option'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { repondreEtape, sauterEtape } from '../actions'
import type { Etape } from '../etapes'

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
  const [restants, setRestants] = useState(
    etape.maxCaracteres ? etape.maxCaracteres - String(valeursInitiales.bio ?? '').length : 0,
  )

  function envoyer(donnees: FormData) {
    setErreur(null)
    demarrer(async () => {
      const resultat = await repondreEtape(etape.slug, donnees)
      if (!resultat.ok) {
        setErreur({ champ: resultat.champ, message: resultat.message })
        return
      }
      router.push(resultat.suivant ? `/onboarding/${resultat.suivant}` : '/onboarding/termine')
    })
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
              const initiale = valeursInitiales[etape.champ]
              const coche = Array.isArray(initiale)
                ? initiale.includes(option.valeur)
                : initiale === option.valeur
              return (
                <Option
                  key={option.valeur}
                  nom={etape.champ}
                  valeur={option.valeur}
                  libelle={option.libelle}
                  multiple={etape.type === 'choix-multiple'}
                  defautCoche={coche}
                />
              )
            })}
          </div>
        </fieldset>
      ) : null}

      {etape.type === 'texte' ? (
        <div className="flex flex-col gap-5">
          <Champ
            id="prenom"
            name="prenom"
            label="Prénom"
            autoComplete="given-name"
            defaultValue={String(valeursInitiales.prenom ?? '')}
            erreur={erreurDe('prenom')}
            required
          />
          <Champ
            id="pseudo"
            name="pseudo"
            label="Pseudo"
            prefixe="lurnly.io/@"
            autoComplete="off"
            spellCheck={false}
            defaultValue={String(valeursInitiales.pseudo ?? '')}
            erreur={erreurDe('pseudo')}
            required
          />
        </div>
      ) : null}

      {etape.type === 'texte-long' ? (
        <ChampLong
          id="bio"
          name="bio"
          label="Votre présentation"
          maxLength={etape.maxCaracteres}
          defaultValue={String(valeursInitiales.bio ?? '')}
          aide={`${restants} caractères restants`}
          erreur={erreurDe('bio')}
          onChange={(e) => setRestants((etape.maxCaracteres ?? 0) - e.target.value.length)}
        />
      ) : null}

      {etape.type === 'photo' ? (
        <div className="flex flex-col gap-3">
          {/* L'upload réel passe par Supabase Storage côté client authentifié ;
              la Server Action ne reçoit qu'un chemin. */}
          <input type="hidden" name="photo_url" value={String(valeursInitiales.photo_url ?? '')} />
          <div className="flex h-[220px] items-center justify-center rounded-[var(--radius-carte)] border border-dashed border-[var(--filet-appuye)] text-[14px] opacity-56">
            Déposez une image, ou cliquez pour parcourir
          </div>
        </div>
      ) : null}

      {erreur && !erreur.champ ? (
        <p role="alert" className="text-[14px] font-medium">
          {erreur.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        <Bouton type="submit" disabled={enCours} pleineLargeur>
          {enCours ? 'Un instant…' : 'Continuer'}
        </Bouton>

        {etape.sautable ? (
          <Bouton variante="discret" onClick={passer} disabled={enCours}>
            Plus tard
          </Bouton>
        ) : null}
      </div>
    </form>
  )
}
