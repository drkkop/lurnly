import type { ButtonHTMLAttributes } from 'react'

/**
 * Bouton du système. Rayon 9 px (jamais une valeur unique dans tout le
 * système — cf. regles-ia/02).
 *
 * En monochrome, les variantes se distinguent par le remplissage et le filet,
 * pas par la teinte. Les états (survol, désactivé) passent par l'opacité :
 * il n'y a pas de couleur d'accent à assombrir.
 */
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'plein' | 'filet' | 'discret'
  pleineLargeur?: boolean
  /**
   * Bouton occupé : non cliquable, mais toujours actif à l'œil.
   *
   * `disabled` recouvre deux situations que rien ne distingue en HTML :
   * « il n'y a rien à faire » et « c'est en train de se faire ». Les traiter
   * pareil grisait le bouton pendant l'envoi, au moment précis où il confirme
   * que ça marche. `occupe` sépare les deux.
   */
  occupe?: boolean
}

const VARIANTES = {
  // Bouton principal du funnel : 50 px de haut, rayon 9, texte 15 px medium
  // (nœud Figma 142:21). Le survol passe par l'opacité — en monochrome il n'y
  // a pas de teinte à assombrir.
  // Désactivé : le fond passe de l'encre au filet et le libellé au gris de
  // brume (états relevés sur la maquette Figma « état A »). En monochrome il
  // n'y a pas de teinte à ternir — c'est la matière qui change, et le bouton
  // rejoint visuellement la famille des bordures plutôt que celle des actions.
  plein: 'h-[calc(50*var(--u))] bg-[var(--color-encre)] text-white hover:opacity-90',
  filet:
    'h-[50px] border border-[var(--filet)] bg-[var(--surface)] text-[var(--texte-2)] hover:border-[var(--filet-appuye)] disabled:opacity-40',
  discret:
    'text-[var(--texte-3)] hover:text-[var(--texte)] underline underline-offset-4 disabled:opacity-30',
} as const

/**
 * Apparence désactivée, relevée sur la maquette Figma « état A » : le fond
 * passe de l'encre au filet et le libellé au gris de brume. En monochrome il
 * n'y a pas de teinte à ternir — c'est la matière qui change, et le bouton
 * rejoint visuellement la famille des bordures plutôt que celle des actions.
 */
const DESACTIVE =
  'disabled:bg-[var(--color-filet)] disabled:text-[var(--texte-3)] disabled:opacity-100 disabled:hover:opacity-100'

/** Occupé : plus cliquable, mais l'apparence ne bouge pas. */
const OCCUPE = 'disabled:opacity-100 disabled:hover:opacity-100 cursor-wait'

export function Bouton({
  variante = 'plein',
  pleineLargeur = false,
  occupe = false,
  className = '',
  type = 'button',
  ...reste
}: Props) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-[var(--radius-bouton)] px-[18px]',
        'text-[15px] font-medium transition-all duration-150 disabled:cursor-not-allowed',
        VARIANTES[variante],
        occupe ? OCCUPE : DESACTIVE,
        pleineLargeur ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={occupe || undefined}
      {...reste}
    />
  )
}
