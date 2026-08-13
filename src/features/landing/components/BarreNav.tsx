import { MarqueLurnly } from '@/components/ui/LogoLurnly'
import { SEUIL_PLACES, nombreInscrits } from '@/dal/compteurs'
import Link from 'next/link'

/**
 * Barre de navigation du hero (nœud Figma 97:4 + 97:13 + 97:18).
 *
 * Ce n'est pas une barre pleine largeur : c'est une pilule de 1246 px posée
 * sous le bord haut, aux coins bas arrondis à 30 px. Elle définit la gouttière
 * de toute la page — tout le reste s'aligne dessus.
 */

/**
 * Seule la section « Salons » existe sur la page. Les trois autres entrées
 * restent affichées — elles annoncent la structure du produit — mais ne sont
 * PAS des liens tant que leurs sections ne sont pas construites : une ancre
 * qui ne mène nulle part est pire qu'un libellé inerte, elle enseigne au
 * visiteur que les liens du site ne fonctionnent pas.
 * À re-transformer en liens au fur et à mesure que les sections arrivent.
 */
const LIENS = [
  { libelle: 'Communautés', href: null },
  { libelle: 'Vérification', href: null },
  { libelle: 'Salons', href: '#salons' },
  { libelle: 'Questions', href: null },
] as const

/** Espace fine insécable — la convention typographique française pour les
 *  milliers. Un espace normal laisserait « 1 000 » se couper en fin de ligne. */
function millier(n: number): string {
  return n.toLocaleString('fr-FR').replace(/\u00a0|\u202f| /g, '\u202f')
}

export async function BarreNav() {
  // Compteur réel. `null` si la base n'est pas joignable : on affiche alors le
  // seuil seul plutôt qu'un nombre inventé — annoncer de faux inscrits sur une
  // liste d'attente est exactement ce qu'on reproche aux autres.
  const inscrits = await nombreInscrits()
  return (
    <div className="flex justify-center px-6">
      {/* Spécification Figma du nœud 97:4 « Rectangle 1 » :
          1246 × 60 · coins bas 30 px, coins hauts 0
          fill #898989 à 20 %
          ombre portée 0 / 4 / 20, noir à 25 %
          effet verre : flou 25, lumière à −45° (donc haut-gauche),
          intensité 0,8 — rendue par les deux liserés internes ci-dessous,
          le CSS n'ayant pas d'équivalent direct de la réfraction Figma. */}
      <div
        className="flex h-[calc(60*var(--u))] w-full max-w-[calc(1246*var(--u))] items-center justify-between rounded-b-[calc(30*var(--u))] bg-[rgb(137_137_137_/_0.2)] px-[calc(28*var(--u))]"
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

        <nav aria-label="Sections" className="hidden items-center gap-[calc(34*var(--u))] md:flex">
          {LIENS.map((lien) =>
            lien.href ? (
              <Link
                key={lien.libelle}
                href={lien.href}
                className="text-[var(--t-145)] text-[var(--texte-2)] transition-colors hover:text-[var(--texte)]"
              >
                {lien.libelle}
              </Link>
            ) : (
              <span key={lien.libelle} className="text-[var(--t-145)] text-[var(--texte-2)]">
                {lien.libelle}
              </span>
            ),
          )}
        </nav>

        {/* Compteur de places. JetBrains Mono — la règle veut que le
            monospace soit réservé aux données chiffrées, et c'en est une. */}
        <p className="font-[family-name:var(--font-donnees)] text-[var(--t-11)] font-medium tracking-[0.07em] text-[var(--texte-2)]">
          {inscrits === null ? (
            <>{millier(SEUIL_PLACES)} PLACES</>
          ) : (
            <>
              {millier(inscrits)} / {millier(SEUIL_PLACES)} PLACES
            </>
          )}
        </p>
      </div>
    </div>
  )
}
