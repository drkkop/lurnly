import { MarqueLurnly } from '@/components/ui/LogoLurnly'
import Link from 'next/link'

/**
 * Barre de navigation du hero (nœud Figma 97:4 + 97:13 + 97:18).
 *
 * Ce n'est pas une barre pleine largeur : c'est une pilule de 1246 px posée
 * sous le bord haut, aux coins bas arrondis à 30 px. Elle définit la gouttière
 * de toute la page — tout le reste s'aligne dessus.
 */

const LIENS = [
  { libelle: 'Communautés', href: '#communautes' },
  { libelle: 'Vérification', href: '#verification' },
  { libelle: 'Salons', href: '#salons' },
  { libelle: 'Questions', href: '#questions' },
] as const

export function BarreNav({ places = 348, total = 1000 }: { places?: number; total?: number }) {
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
          <MarqueLurnly taille={35} />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-[34px] md:flex">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-[14.5px] text-[var(--texte-2)] transition-colors hover:text-[var(--texte)]"
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        {/* Compteur de places. JetBrains Mono — la règle est que le monospace
            est réservé aux données chiffrées, et c'en est une. */}
        <p className="font-[family-name:var(--font-donnees)] text-[11.5px] font-medium tracking-[0.805px] text-[var(--texte-2)]">
          {places} / {total.toLocaleString('fr-FR').replace(/ | /g, ' ')} PLACES
        </p>
      </div>
    </div>
  )
}
