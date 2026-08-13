import { NOMBRE_ETAPES } from '../etapes'

/**
 * Progression de l'onboarding (nœuds Figma 140:116 à 150:4).
 *
 * Sept tirets de 30 × 6 px, rayon 15. Le rang atteint est en encre, le reste
 * en filet. Ils sont centrés sous la colonne du formulaire, pas sous la page.
 *
 * Accessibilité : les tirets sont décoratifs et masqués aux lecteurs d'écran.
 * L'information passe par du texte réel — un `role="progressbar"` sur un
 * élément non focusable annonce une barre sans être atteignable au clavier.
 */
export function ProgressionEtapes({ rang }: { rang: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-[6px]" aria-hidden="true">
        {Array.from({ length: NOMBRE_ETAPES }, (_, i) => (
          <span
            key={`tiret-${i + 1}`}
            className={[
              'h-[6px] w-[30px] rounded-[var(--radius-panneau)] transition-colors duration-300',
              i < rang ? 'bg-[var(--color-encre)]' : 'bg-[var(--filet)]',
            ].join(' ')}
          />
        ))}
      </div>
      <p className="sr-only">
        Étape {rang} sur {NOMBRE_ETAPES}
      </p>
    </div>
  )
}
