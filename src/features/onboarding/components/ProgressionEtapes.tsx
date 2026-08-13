import { NOMBRE_ETAPES } from '../etapes'

/**
 * Progression de l'onboarding.
 *
 * Sept traits de 1 px, pas une barre pleine : c'est la même primitive que
 * partout ailleurs dans le système. Le rang courant est en encre pleine,
 * les suivants en filet.
 *
 * Accessibilité : les traits sont purement décoratifs et masqués aux lecteurs
 * d'écran. L'information de progression est portée par du texte réel — un
 * `role="progressbar"` posé sur un `div` non focusable n'est pas atteignable
 * au clavier, donc il donne l'illusion d'être accessible sans l'être.
 */
export function ProgressionEtapes({ rang }: { rang: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: NOMBRE_ETAPES }, (_, i) => (
          <span
            key={`trait-${i + 1}`}
            className={[
              'h-px flex-1 transition-opacity duration-300',
              i < rang ? 'bg-[var(--texte)]' : 'bg-[var(--filet)]',
            ].join(' ')}
          />
        ))}
      </div>
      <p className="font-[var(--font-donnees)] text-[12px] tracking-wide opacity-40">
        <span className="sr-only">
          Étape {rang} sur {NOMBRE_ETAPES}
        </span>
        <span aria-hidden="true">
          {String(rang).padStart(2, '0')} / {String(NOMBRE_ETAPES).padStart(2, '0')}
        </span>
      </p>
    </div>
  )
}
