import { NOMBRE_ETAPES } from '../etapes'

/**
 * Progression de l'onboarding (nœuds Figma 140:116 et suivants).
 *
 * Trois largeurs, pas une seule : l'étape franchie se réduit à un point,
 * l'étape courante s'allonge, celles à venir gardent une largeur moyenne.
 * C'est ce que montre la maquette de l'étape 2 — la maquette de l'étape 1
 * ne pouvait pas le révéler, puisqu'il n'y avait encore rien de franchi.
 *
 * L'intérêt n'est pas décoratif : d'un coup d'œil on voit à la fois où on en
 * est et combien il reste, alors que sept tirets identiques ne disent que la
 * position.
 *
 * Accessibilité : les tirets sont décoratifs et masqués. L'information passe
 * par du texte réel — un `role="progressbar"` sur un élément non focusable
 * annonce une barre sans être atteignable au clavier.
 */

/** Largeurs en unités de maquette.
 *
 *  Seules les étapes **franchies** changent de forme : elles se réduisent à un
 *  point de 6 × 6, rond une fois le rayon appliqué. L'étape courante et celles
 *  à venir gardent exactement la même largeur — c'est la couleur qui les
 *  distingue, pas la taille.
 *
 *  À l'étape 1 il n'y a donc rien de franchi : les sept barres sont
 *  identiques, seule la première est en encre. C'est ce que montre la
 *  maquette. */
const LARGEUR = { franchie: 6, courante: 30, a_venir: 30 } as const

export function ProgressionEtapes({ rang }: { rang: number }) {
  return (
    // Centré sur l'axe du bouton « Continuer », comme dans la maquette :
    // le bloc parent fait 460, la série de tirets se centre dedans.
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-[calc(6*var(--u))]" aria-hidden="true">
        {Array.from({ length: NOMBRE_ETAPES }, (_, i) => {
          const position = i + 1
          const etat = position < rang ? 'franchie' : position === rang ? 'courante' : 'a_venir'
          return (
            <span
              key={`tiret-${position}`}
              style={{ width: `calc(${LARGEUR[etat]} * var(--u))` }}
              className={[
                'h-[calc(6*var(--u))] rounded-[var(--radius-panneau)]',
                'transition-[width,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                etat === 'a_venir' ? 'bg-[var(--filet)]' : 'bg-[var(--color-encre)]',
              ].join(' ')}
            />
          )
        })}
      </div>
      <p className="sr-only">
        Étape {rang} sur {NOMBRE_ETAPES}
      </p>
    </div>
  )
}
