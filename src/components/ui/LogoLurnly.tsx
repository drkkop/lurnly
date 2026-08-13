/**
 * Logo Lurnly — spécification Figma du nœud 114:2.
 *
 * Tuile de 35 × 35, rayon 8,75, contenu rogné, **fond encre opaque**.
 *
 * Figma spécifiait deux couches de blanc translucide (16 % puis 8 %) sur un
 * effet verre. Rendu tel quel sur le papier clair, ça donnait une tuile
 * presque invisible dans laquelle les blocs #EFEFEF — plus clairs encore que
 * leur fond — ne se lisaient pas. Décision de Robin : tuile pleine.
 *
 * Les quatre blocs forment le « L » : trois empilés pour la barre verticale,
 * un quatrième en bas à droite pour la barre horizontale. Leurs rayons sont
 * tous différents — c'est ce qui donne la distorsion voulue par Robin.
 * **Ne jamais les uniformiser.**
 *
 * Toutes les valeurs sont exprimées en fraction de 35 px pour que le dessin
 * reste exact à n'importe quelle taille.
 */

/** Toutes les mesures du logo sont relevées sur une tuile de 35 px, puis
 *  exprimées en `em` — la tuile porte `font-size: <taille>`, donc 1em = la
 *  tuile. Le dessin reste exact à n'importe quelle taille, y compris quand
 *  celle-ci est un `calc()` dépendant de la fenêtre. */
const BASE = 35

/** Convertit une mesure relevée en em relatifs à la tuile. */
function em(v: number): string {
  return `${v / BASE}em`
}

/** x, y, largeur, hauteur, puis rayons dans l'ordre CSS : TL, TR, BR, BL. */
const BLOCS = [
  { x: 8.93, y: 4.46, l: 7.963, h: 8.4, r: [5.25, 10.5, 0.875, 0.875] },
  { x: 9.01, y: 13.3, l: 7.963, h: 8.4, r: [0.875, 0.875, 0.4375, 2.1875] },
  { x: 9.01, y: 22.14, l: 7.963, h: 8.4, r: [2.1875, 0.4375, 0, 4.375] },
  { x: 17.59, y: 22.14, l: 8.4, h: 8.4, r: [0.547, 0.4375, 4.375, 0] },
] as const

export function LogoLurnly({ taille = '35px' }: { taille?: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 overflow-hidden"
      style={{
        fontSize: taille,
        width: '1em',
        height: '1em',
        borderRadius: em(8.75),
        // Tuile opaque en encre. On abandonne les deux couches translucides
        // de Figma : sur le papier clair elles donnaient un gris pâle où les
        // blocs #EFEFEF, plus clairs encore, ne se lisaient pas. Le logo est
        // désormais un objet plein, pas un filigrane.
        backgroundColor: 'var(--color-encre)',
        boxShadow: `0px ${em(0.175)} ${em(1.75)} 0px rgb(0 0 0 / 0.1)`,
      }}
    >
      {BLOCS.map((b) => (
        <span
          key={`${b.x}-${b.y}`}
          className="absolute bg-[#efefef]"
          style={{
            left: em(b.x),
            top: em(b.y),
            width: em(b.l),
            height: em(b.h),
            borderRadius: b.r.map((v) => em(v)).join(' '),
          }}
        />
      ))}
    </div>
  )
}

/** Logo + mot-symbole, tel qu'il apparaît dans la nav et dans l'onboarding. */
export function MarqueLurnly({
  taille = 'calc(35 * var(--u))',
  tailleMot = 'calc(20 * var(--u))',
}: {
  taille?: string
  tailleMot?: string
}) {
  return (
    <div className="flex items-center gap-[calc(10*var(--u))]">
      <LogoLurnly taille={taille} />
      <span
        style={{ fontSize: tailleMot }}
        className="font-[family-name:var(--font-display)] font-bold tracking-[-0.02em] text-[var(--texte)]"
      >
        Lurnly
      </span>
    </div>
  )
}
