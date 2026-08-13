/**
 * Icônes du système, reprises de **coolicons** (fichier Community Figma).
 *
 * Elles sont recopiées depuis la géométrie exportée plutôt qu'importées comme
 * composants : la bibliothèque n'est pas publiée, donc non importable. Les
 * chemins sont ceux d'origine, tracés sur une grille de 24, trait de 2,
 * extrémités et jonctions arrondies.
 *
 * `regles-ia/04` interdit les icônes « en trait fin interchangeable, sans
 * intention » et demande un système cohérent : une seule graisse, un seul
 * style, une seule grille. C'est la raison d'être de ce fichier — toutes les
 * icônes du produit viennent d'ici, aucune n'est redessinée au cas par cas.
 *
 * La couleur suit `currentColor`, la taille suit la police du parent.
 */

type ProprietesIcone = {
  /** Taille du carré. Par défaut, elle suit la taille de texte du parent. */
  taille?: string
  className?: string
}

const COMMUN = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** coolicons — Arrow / Arrow_Left_MD */
export function FlecheGauche({ taille = '1em', className }: ProprietesIcone) {
  return (
    <svg
      {...COMMUN}
      aria-hidden="true"
      focusable="false"
      style={{ width: taille, height: taille }}
      className={className}
    >
      <title>Flèche vers la gauche</title>
      <path d="M19 12H5M11 6L5 12L11 18" />
    </svg>
  )
}

/**
 * coolicons — Interface / Check_Big
 *
 * Confirmation que la réponse est enregistrée. La version large plutôt que la
 * standard : seule dans un bouton de 460 de large, la petite coche paraît
 * perdue.
 */
export function Valide({ taille = '1em', className }: ProprietesIcone) {
  // Le dessin est décoratif ; l'annonce aux lecteurs d'écran passe par un
  // texte réel masqué visuellement. Un `role="status"` posé sur le <svg>
  // lui-même n'est pas fiable — même approche que la barre de progression.
  return (
    <>
      <svg
        {...COMMUN}
        aria-hidden="true"
        focusable="false"
        style={{ width: taille, height: taille }}
        className={className}
      >
        <title>Coche de validation</title>
        <path className="trace-coche" d="M4 12L8.94975 16.9497L19.5572 6.34326" />
      </svg>
      {/* <output> porte nativement le rôle « status » : l'élément sémantique
          plutôt qu'un rôle ARIA posé sur un span neutre. */}
      <output className="sr-only">Réponse enregistrée</output>
    </>
  )
}
