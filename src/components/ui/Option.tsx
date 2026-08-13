'use client'

/**
 * Une option de choix (nœuds Figma 142:5 à 142:20).
 *
 * 46 px de haut, rayon 9, texte 14,5 px. Au repos : fond blanc, filet de 1 px,
 * libellé ardoise. Sélectionnée : fond encre, libellé blanc, plus de filet.
 * Il n'y a pas de coche — l'inversion EST l'état.
 *
 * Construite sur un vrai `input` masqué visuellement mais pas pour le lecteur
 * d'écran : la navigation au clavier, les groupes de boutons radio et
 * l'annonce « sélectionné » sont ceux du navigateur, pas une réimplémentation.
 *
 * Le composant est **contrôlé**, y compris pour le choix unique. C'est ce qui
 * permet de décocher en recliquant : un bouton radio natif refuse de revenir à
 * l'état vide une fois choisi, alors qu'ici se déprendre est une action
 * légitime. C'est aussi ce qui permet au formulaire de savoir s'il peut
 * activer « Continuer ».
 */
type Props = {
  nom: string
  valeur: string
  libelle: string
  multiple?: boolean
  coche: boolean
  surClic: (valeur: string) => void
}

const CLASSES = [
  'group relative flex h-[calc(46*var(--u))] cursor-pointer items-center',
  'rounded-[var(--radius-bouton)] border border-[var(--filet)] bg-[var(--surface)]',
  'px-[calc(16*var(--u))] text-[length:var(--t-145)] font-medium text-[var(--texte-2)]',
  'transition-colors duration-150 hover:border-[var(--filet-appuye)]',
  'has-[:checked]:border-[var(--color-encre)] has-[:checked]:bg-[var(--color-encre)]',
  'has-[:checked]:text-white',
  'has-[:focus-visible]:outline has-[:focus-visible]:outline-2',
  'has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--texte)]',
].join(' ')

export function Option({ nom, valeur, libelle, multiple = false, coche, surClic }: Props) {
  const id = `${nom}-${valeur}`

  return (
    <label htmlFor={id} className={CLASSES}>
      <input
        id={id}
        type={multiple ? 'checkbox' : 'radio'}
        name={nom}
        value={valeur}
        checked={coche}
        // `onChange` vide mais présent : React l'exige sur un champ contrôlé.
        // C'est `onClick` qui porte la bascule, parce qu'il se déclenche aussi
        // quand on reclique sur une option déjà cochée — cas où `onChange`
        // reste muet pour un bouton radio.
        onChange={() => {}}
        onClick={() => surClic(valeur)}
        className="absolute h-px w-px opacity-0"
      />
      {libelle}
    </label>
  )
}
