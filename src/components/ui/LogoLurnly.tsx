/**
 * Logo Lurnly — spécification Figma du nœud 114:2.
 *
 * Tuile de 35 × 35, rayon 8,75, contenu rogné. Le fond est **blanc
 * translucide** (deux couches, 16 % puis 8 %) posé sur un effet verre : le
 * logo prend donc la couleur de ce qu'il y a derrière. Ce n'est pas une tuile
 * encre — c'est ce que j'avais supposé à tort au premier jet.
 *
 * Les quatre blocs forment le « L » : trois empilés pour la barre verticale,
 * un quatrième en bas à droite pour la barre horizontale. Leurs rayons sont
 * tous différents — c'est ce qui donne la distorsion voulue par Robin.
 * **Ne jamais les uniformiser.**
 *
 * Toutes les valeurs sont exprimées en fraction de 35 px pour que le dessin
 * reste exact à n'importe quelle taille.
 */

const BASE = 35

/** x, y, largeur, hauteur, puis rayons dans l'ordre CSS : TL, TR, BR, BL. */
const BLOCS = [
  { x: 8.93, y: 4.46, l: 7.963, h: 8.4, r: [5.25, 10.5, 0.875, 0.875] },
  { x: 9.01, y: 13.3, l: 7.963, h: 8.4, r: [0.875, 0.875, 0.4375, 2.1875] },
  { x: 9.01, y: 22.14, l: 7.963, h: 8.4, r: [2.1875, 0.4375, 0, 4.375] },
  { x: 17.59, y: 22.14, l: 8.4, h: 8.4, r: [0.547, 0.4375, 4.375, 0] },
] as const

export function LogoLurnly({ taille = BASE }: { taille?: number }) {
  const k = taille / BASE
  const px = (v: number) => `${v * k}px`

  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 overflow-hidden"
      style={{
        width: taille,
        height: taille,
        borderRadius: px(8.75),
        // Deux couches de blanc empilées, comme dans Figma.
        backgroundImage:
          'linear-gradient(rgb(255 255 255 / 0.16), rgb(255 255 255 / 0.16)), linear-gradient(rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.08))',
        // Effet verre : flou 25. La lumière (angle 256°, intensité 0,09) est
        // trop faible pour justifier un liseré — on ne l'invente pas.
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        boxShadow: `0px ${0.175 * k}px ${1.75 * k}px 0px rgb(0 0 0 / 0.1)`,
      }}
    >
      {BLOCS.map((b) => (
        <span
          key={`${b.x}-${b.y}`}
          className="absolute bg-[#efefef]"
          style={{
            left: px(b.x),
            top: px(b.y),
            width: px(b.l),
            height: px(b.h),
            borderRadius: b.r.map((v) => px(v)).join(' '),
          }}
        />
      ))}
    </div>
  )
}

/** Logo + mot-symbole, tel qu'il apparaît dans la nav et dans l'onboarding. */
export function MarqueLurnly({ taille = BASE }: { taille?: number }) {
  return (
    <div className="flex items-center gap-[10px]">
      <LogoLurnly taille={taille} />
      <span className="font-[family-name:var(--font-display)] text-[20px] font-bold tracking-[-0.4px] text-[var(--texte)]">
        Lurnly
      </span>
    </div>
  )
}
