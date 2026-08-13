import { NOMBRE_ETAPES } from '../etapes'

/**
 * Progression de l'onboarding.
 *
 * Sept traits de 1 px, pas une barre pleine : c'est la même primitive que
 * partout ailleurs dans le système. Le rang courant est en encre pleine,
 * les suivants en filet.
 */
export function ProgressionEtapes({ rang }: { rang: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={rang}
        aria-valuemin={1}
        aria-valuemax={NOMBRE_ETAPES}
        aria-label={`Étape ${rang} sur ${NOMBRE_ETAPES}`}
      >
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
        {String(rang).padStart(2, '0')} / {String(NOMBRE_ETAPES).padStart(2, '0')}
      </p>
    </div>
  )
}
