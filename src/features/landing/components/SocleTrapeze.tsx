/**
 * Socle trapézoïdal du bas de l'écran « place réservée » (nœud Figma 131:67).
 *
 * Quatre sommets, plus large en bas qu'en haut, coins arrondis à 10.
 * Son remplissage est **exactement la couleur du fond** (`#F8F7FA`) : la forme
 * n'est donc visible que par son ombre, portée vers le haut et très diffuse
 * (décalage −3, flou 60). C'est un effet de profondeur, pas un bloc — d'où le
 * choix de ne rien y poser tant que les écrans produit n'existent pas.
 *
 * Géométrie relevée sur la maquette, dans un repère de 1238 × 320 :
 *   bas-gauche  (0, 320)      haut-gauche (109, 0)
 *   haut-droit  (1115.5, 0)   bas-droit   (1238, 320)
 */

type Point = readonly [number, number]

const SOMMETS: readonly Point[] = [
  [0, 320],
  [109, 0],
  [1115.5, 0],
  [1238, 320],
]

const RAYON = 10

/**
 * Construit un chemin SVG fermé dont chaque sommet est adouci.
 *
 * On recule de `rayon` le long des deux arêtes qui se rejoignent, puis on
 * relie les deux points par une courbe quadratique passant par le sommet.
 * Écrire le chemin à la main aurait marché aussi, mais aurait été impossible
 * à relire — et faux dès qu'un sommet bouge dans Figma.
 */
function cheminArrondi(points: readonly Point[], rayon: number): string {
  const n = points.length
  const morceaux: string[] = []

  for (let i = 0; i < n; i++) {
    const precedent = points[(i - 1 + n) % n] as Point
    const sommet = points[i] as Point
    const suivant = points[(i + 1) % n] as Point

    const versPrecedent = raccourci(sommet, precedent, rayon)
    const versSuivant = raccourci(sommet, suivant, rayon)

    morceaux.push(
      i === 0
        ? `M ${versPrecedent[0]} ${versPrecedent[1]}`
        : `L ${versPrecedent[0]} ${versPrecedent[1]}`,
    )
    morceaux.push(`Q ${sommet[0]} ${sommet[1]} ${versSuivant[0]} ${versSuivant[1]}`)
  }

  morceaux.push('Z')
  return morceaux.join(' ')
}

/** Point situé à `distance` du sommet, en direction de `cible`. Le rayon est
 *  borné à la moitié de l'arête pour qu'un côté court ne se replie pas. */
function raccourci(sommet: Point, cible: Point, distance: number): Point {
  const dx = cible[0] - sommet[0]
  const dy = cible[1] - sommet[1]
  const longueur = Math.hypot(dx, dy)
  if (longueur === 0) return sommet
  const d = Math.min(distance, longueur / 2)
  return [sommet[0] + (dx / longueur) * d, sommet[1] + (dy / longueur) * d]
}

export function SocleTrapeze() {
  return (
    <svg
      viewBox="0 0 1238 320"
      aria-hidden="true"
      focusable="false"
      className="block h-auto w-full"
      style={{ filter: 'drop-shadow(0 -3px 60px rgb(0 0 0 / 0.25))' }}
    >
      <title>Socle</title>
      <path d={cheminArrondi(SOMMETS, RAYON)} fill="var(--fond)" />
    </svg>
  )
}
