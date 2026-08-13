'use client'

/**
 * Une option de choix (unique ou multiple).
 *
 * Construite sur un vrai `input` masqué visuellement mais pas pour le lecteur
 * d'écran : la navigation au clavier, les groupes de boutons radio et
 * l'annonce « sélectionné » sont ceux du navigateur, pas une réimplémentation.
 *
 * Sélection en monochrome : inversion encre/papier. Pas de coche colorée.
 */
type Props = {
  nom: string
  valeur: string
  libelle: string
  multiple?: boolean
  defautCoche?: boolean
}

export function Option({ nom, valeur, libelle, multiple = false, defautCoche = false }: Props) {
  const id = `${nom}-${valeur}`
  return (
    <label
      htmlFor={id}
      className={[
        'group relative flex cursor-pointer items-center rounded-[var(--radius-pastille)]',
        'border border-[var(--filet)] px-4 py-3 text-[15px]',
        'transition-colors duration-150 hover:border-[var(--filet-appuye)]',
        'has-[:checked]:bg-[var(--texte)] has-[:checked]:text-[var(--fond)]',
        'has-[:checked]:border-[var(--texte)]',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
        'has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--texte)]',
      ].join(' ')}
    >
      <input
        id={id}
        type={multiple ? 'checkbox' : 'radio'}
        name={nom}
        value={valeur}
        defaultChecked={defautCoche}
        className="absolute h-px w-px opacity-0"
      />
      {libelle}
    </label>
  )
}
