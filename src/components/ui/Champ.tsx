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

/** Cadre du champ : c'est **lui** qui porte le filet, pas la saisie.
 *
 *  C'était l'erreur : avec la bordure sur l'`input`, un champ à préfixe voyait
 *  son préfixe rejeté hors du cadre, et la boîte se retrouvait décalée par
 *  rapport aux champs sans préfixe. Le cadre englobe désormais préfixe et
 *  saisie, donc tous les champs s'alignent quel qu'en soit le contenu. */
function classesCadre(erreur?: string) {
  return [
    // `cadre-champ` neutralise le contour de focus des saisies (voir
    // globals.css). Plus d'`overflow-hidden` : c'est lui qui transformait le
    // contour rogné en barre verticale.
    'cadre-champ flex h-[calc(46*var(--u))] w-full items-center',
    'rounded-[var(--radius-bouton)] bg-[var(--surface)]',
    'border transition-colors',
    erreur ? 'border-[var(--texte)]' : 'border-[var(--filet)]',
    // Le focus est signalé par le filet du cadre, qui s'assombrit.
    'focus-within:border-[var(--filet-appuye)]',
  ].join(' ')
}

/** La saisie elle-même : aucune bordure, aucun contour — le cadre s'en charge. */
const CLASSES_SAISIE =
  'h-full min-w-0 flex-1 bg-transparent px-[calc(16*var(--u))] text-[length:var(--t-15)] text-[var(--texte)] outline-none placeholder:text-[var(--texte-3)]'

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
    <div className="flex flex-col gap-[calc(8*var(--u))]">
      <label htmlFor={id} className="text-[length:var(--t-14)] text-[var(--texte-2)]">
        {label}
      </label>

      <div className={classesCadre(erreur)}>
        {prefixe ? (
          // Le préfixe est décoratif : il n'est pas saisi et ne part pas au
          // serveur. Le lecteur d'écran l'ignore, le libellé et l'aide suffisent.
          <span
            aria-hidden="true"
            className="shrink-0 pl-[calc(16*var(--u))] text-[length:var(--t-15)] text-[var(--texte-3)]"
          >
            {prefixe}
          </span>
        ) : null}
        <input
          id={id}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(' ') || undefined}
          aria-invalid={erreur ? true : undefined}
          // Deux pixels de retrait derrière un préfixe : sans eux, le curseur
          // de saisie vient se coller au « @ » et se lit comme un trait noir
          // parasite plutôt que comme un curseur.
          className={prefixe ? `${CLASSES_SAISIE} !pl-[calc(2*var(--u))]` : CLASSES_SAISIE}
          {...reste}
        />
      </div>

      {aide ? (
        <p id={idAide} className="text-[length:var(--t-13)] text-[var(--texte-3)]">
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={idErreur} role="alert" className="text-[length:var(--t-13)] font-medium">
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
    <div className="flex flex-col gap-[calc(8*var(--u))]">
      <label htmlFor={id} className="text-[length:var(--t-14)] text-[var(--texte-2)]">
        {label}
      </label>

      <div className={`${classesCadre(erreur)} !h-auto`}>
        <textarea
          id={id}
          rows={4}
          maxLength={maxLength}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(' ') || undefined}
          aria-invalid={erreur ? true : undefined}
          className={`${CLASSES_SAISIE} resize-none py-[calc(12*var(--u))] leading-[1.55]`}
          {...reste}
        />
      </div>

      {aide ? (
        <p id={idAide} className="text-[length:var(--t-13)] text-[var(--texte-3)]">
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={idErreur} role="alert" className="text-[length:var(--t-13)] font-medium">
          {erreur}
        </p>
      ) : null}
    </div>
  )
}
