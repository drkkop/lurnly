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
}

const VARIANTES = {
  // Bouton principal du funnel : 50 px de haut, rayon 9, texte 15 px medium
  // (nœud Figma 142:21). Le survol passe par l'opacité — en monochrome il n'y
  // a pas de teinte à assombrir.
  plein: 'h-[50px] bg-[var(--color-encre)] text-white hover:opacity-90 disabled:opacity-40',
  filet:
    'h-[50px] border border-[var(--filet)] bg-[var(--surface)] text-[var(--texte-2)] hover:border-[var(--filet-appuye)] disabled:opacity-40',
  discret:
    'text-[var(--texte-3)] hover:text-[var(--texte)] underline underline-offset-4 disabled:opacity-30',
} as const

export function Bouton({
  variante = 'plein',
  pleineLargeur = false,
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
        pleineLargeur ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...reste}
    />
  )
}
