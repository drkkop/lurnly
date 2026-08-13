import { MarqueLurnly } from '@/components/ui/LogoLurnly'
import { SEUIL_PLACES, nombreInscrits } from '@/dal/compteurs'
import { SocleTrapeze } from '@/features/landing/components/SocleTrapeze'
import Link from 'next/link'

/**
 * Funnel — écran 2 · place réservée (nœud Figma 130:2).
 *
 * Il ne dit pas « regardez vos emails » : conformément à la décision produit
 * « inscription immédiate, vérification de l'email différée », la place est
 * annoncée comme acquise et on enchaîne sur le profil. Le lien reçu par email
 * sert à confirmer, pas à débloquer l'écran suivant.
 *
 * Géométrie relevée sur la maquette (cadre de 1440) :
 *   titre        y = 150  46 px, interligne 1,06, crénage −1,3
 *   « Vous êtes le » y = 228  16 px
 *   rang         y = 247  88 px, crénage −3
 *   barre        y = 372  500 × 4, rayon 2
 *   légende      y = 388  13,5 px
 *   CTA          y = 477  hauteur 50, rayon 9
 */

export const revalidate = 60

export const metadata = { title: 'Votre place est réservée — Lurnly' }

function millier(n: number): string {
  return n.toLocaleString('fr-FR').replace(/ | | /g, ' ')
}

/** « 1er », puis « 2e », « 349e ». Le français ne met « er » qu'au premier. */
function rangOrdinal(n: number): { nombre: string; suffixe: string } {
  return { nombre: millier(n), suffixe: n === 1 ? 'er' : 'e' }
}

export default async function PlaceReservee({
  searchParams,
}: {
  searchParams: Promise<{ apercu?: string }>
}) {
  const inscrits = await nombreInscrits()

  // Aperçu de la maquette sans base de données : `?apercu=349`.
  // Strictement réservé au développement — en production, un rang inventé sur
  // une liste d'attente serait un mensonge affiché à chaque visiteur.
  const { apercu } = await searchParams
  const rangForce =
    process.env.NODE_ENV === 'development' && apercu ? Number.parseInt(apercu, 10) : Number.NaN

  // Le rang affiché est la position que la personne vient de prendre : le
  // nombre d'inscrits avant elle, plus elle-même. `null` si la base est
  // injoignable — on masque alors le rang plutôt que d'en inventer un.
  const rang = Number.isFinite(rangForce) ? rangForce : inscrits === null ? null : inscrits + 1
  const pourcentage = rang === null ? 0 : Math.min((rang / SEUIL_PLACES) * 100, 100)

  return (
    <div className="min-h-dvh bg-[var(--fond)]">
      <header className="flex justify-center px-6">
        <div
          className="flex h-[60px] w-full max-w-[var(--largeur-contenu)] items-center justify-between rounded-b-[var(--radius-nav)] bg-[rgb(137_137_137_/_0.2)] px-[28px]"
          style={{
            backdropFilter: 'blur(25px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(25px) saturate(1.15)',
            boxShadow: [
              '0px 4px 20px 0px rgb(0 0 0 / 0.25)',
              'inset 1px 1px 0px 0px rgb(255 255 255 / 0.5)',
              'inset -1px -1px 0px 0px rgb(255 255 255 / 0.12)',
            ].join(', '),
          }}
        >
          <Link href="/" aria-label="Lurnly — accueil">
            <MarqueLurnly />
          </Link>
          <p className="font-[family-name:var(--font-donnees)] text-[11.5px] font-medium tracking-[0.805px] text-[var(--texte-2)]">
            {rang === null ? (
              <>{millier(SEUIL_PLACES)} PLACES</>
            ) : (
              <>
                {millier(rang)} / {millier(SEUIL_PLACES)} PLACES
              </>
            )}
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-[640px] flex-col items-center px-6 pt-[90px] text-center">
        <h1 className="font-[family-name:var(--font-display)] text-[34px] font-semibold leading-[1.06] tracking-[-0.028em] text-[var(--texte)] lg:text-[46px]">
          Votre place est réservée
        </h1>

        {rang === null ? (
          <p className="mt-[22px] text-[16px] leading-[1.5] tracking-[-0.03em] text-[var(--texte-2)]">
            On vous écrit dès que la première vague ouvre.
          </p>
        ) : (
          <>
            <p className="mt-[22px] text-[16px] leading-[1.5] tracking-[-0.03em] text-[var(--texte-2)]">
              Vous êtes le
            </p>

            {/* Le rang en chiffres, donc en JetBrains… non : ici c'est le
                display qui porte le chiffre, parce qu'il fait 88 px et sert de
                titre. Le monospace est réservé aux données de service, pas aux
                nombres mis en scène. */}
            <p className="mt-[4px] font-[family-name:var(--font-display)] text-[64px] font-semibold leading-none tracking-[-0.034em] text-[var(--texte)] lg:text-[88px]">
              {rangOrdinal(rang).nombre}
              <sup className="align-super text-[0.45em]">{rangOrdinal(rang).suffixe}</sup>
            </p>

            {/* La barre est décorative et masquée aux lecteurs d'écran.
                Un `role="progressbar"` sur un `div` non focusable annonce une
                barre de progression sans être atteignable au clavier — Biome
                le refuse à juste titre. L'information passe par la ligne de
                texte juste en dessous, qui est du texte réel. */}
            <div
              aria-hidden="true"
              className="mt-[38px] h-[4px] w-full max-w-[500px] overflow-hidden rounded-[2px] bg-[var(--color-rail)]"
            >
              <div
                className="h-full rounded-[2px] bg-[var(--color-encre)]"
                style={{ width: `${pourcentage}%` }}
              />
            </div>

            <p className="mt-[12px] text-[13.5px] font-medium leading-[1.5] text-[var(--texte-3)]">
              {millier(rang)} sur {millier(SEUIL_PLACES)} avant l’ouverture
            </p>
          </>
        )}

        <Link
          href="/onboarding/domaine"
          className="mt-[62px] inline-flex h-[50px] items-center rounded-[var(--radius-bouton)] bg-[var(--color-encre)] px-[28px] text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Préparer mon profil
        </Link>
      </main>

      {/* Le socle commence 68 px sous le CTA dans la maquette (y 527 → 595)
          et déborde volontairement en bas de page : il n'a pas de fin, il
          s'enfonce. */}
      <div className="mx-auto mt-[68px] w-full max-w-[1238px] px-6 lg:px-0">
        <SocleTrapeze />
      </div>
    </div>
  )
}
