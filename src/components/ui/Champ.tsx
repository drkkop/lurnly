import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

/**
 * Champ de saisie. Rayon 9 px, filet de 1 px — pas d'ombre, pas de fond gris.
 * L'erreur ne peut pas être signalée par du rouge (monochrome) : elle passe
 * par un filet appuyé et un message sous le champ, lié par `aria-describedby`.
 */
type CommunProps = {
  label: string
  aide?: string
  erreur?: string
  prefixe?: string
}

function classesSaisie(erreur?: string) {
  return [
    'w-full rounded-[var(--radius-champ)] bg-transparent px-4 py-3',
    'text-[16px] text-[var(--texte)] placeholder:opacity-40',
    'border',
    erreur ? 'border-[var(--texte)] border-2' : 'border-[var(--filet)]',
    'focus:border-[var(--filet-appuye)]',
  ].join(' ')
}

export function Champ({
  label,
  aide,
  erreur,
  prefixe,
  id,
  ...reste
}: CommunProps & InputHTMLAttributes<HTMLInputElement>) {
  const idAide = aide ? `${id}-aide` : undefined
  const idErreur = erreur ? `${id}-erreur` : undefined
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] opacity-72">
        {label}
      </label>
      <div className="flex items-center gap-0">
        {prefixe ? (
          <span className="shrink-0 pr-1 font-[var(--font-donnees)] text-[15px] opacity-40">
            {prefixe}
          </span>
        ) : null}
        <input
          id={id}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(' ') || undefined}
          aria-invalid={erreur ? true : undefined}
          className={classesSaisie(erreur)}
          {...reste}
        />
      </div>
      {aide ? (
        <p id={idAide} className="text-[13px] opacity-56">
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={idErreur} role="alert" className="text-[13px] font-medium">
          {erreur}
        </p>
      ) : null}
    </div>
  )
}

export function ChampLong({
  label,
  aide,
  erreur,
  id,
  maxLength,
  ...reste
}: CommunProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const idAide = aide ? `${id}-aide` : undefined
  const idErreur = erreur ? `${id}-erreur` : undefined
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] opacity-72">
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        maxLength={maxLength}
        aria-describedby={[idAide, idErreur].filter(Boolean).join(' ') || undefined}
        aria-invalid={erreur ? true : undefined}
        className={`${classesSaisie(erreur)} resize-none`}
        {...reste}
      />
      {aide ? (
        <p id={idAide} className="text-[13px] opacity-56">
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={idErreur} role="alert" className="text-[13px] font-medium">
          {erreur}
        </p>
      ) : null}
    </div>
  )
}
