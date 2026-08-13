'use client'

/**
 * Une option de choix (nœuds Figma 142:5 à 142:20).
 *
 * 46 px de haut, rayon 9, texte 14,5 px. Non sélectionnée : fond blanc, filet
 * de 1 px, libellé ardoise. Sélectionnée : fond encre, libellé blanc, plus de
 * filet. Il n'y a pas de coche — l'inversion EST l'état.
 *
 * Construite sur un vrai `input` masqué visuellement mais pas pour le lecteur
 * d'écran : la navigation au clavier, les groupes de boutons radio et
 * l'annonce « sélectionné » sont ceux du navigateur, pas une réimplémentation.
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
        'group relative flex h-[46px] cursor-pointer items-center rounded-[var(--radius-bouton)]',
        'border border-[var(--filet)] bg-[var(--surface)] px-[16px]',
        'text-[14.5px] font-medium text-[var(--texte-2)]',
        'transition-colors duration-150 hover:border-[var(--filet-appuye)]',
        'has-[:checked]:border-[var(--color-encre)] has-[:checked]:bg-[var(--color-encre)]',
        'has-[:checked]:text-white',
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
