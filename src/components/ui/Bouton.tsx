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
  plein:
    'bg-[var(--texte)] text-[var(--fond)] hover:opacity-90 disabled:opacity-40',
  filet:
    'border border-[var(--filet-appuye)] text-[var(--texte)] hover:bg-[var(--color-encre-08)] disabled:opacity-40',
  discret:
    'text-[var(--texte)] opacity-56 hover:opacity-100 underline underline-offset-4 disabled:opacity-30',
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
        'rounded-[var(--radius-bouton)] px-5 py-3 text-[15px] font-medium',
        'transition-opacity duration-150 disabled:cursor-not-allowed',
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
