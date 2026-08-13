import Image from 'next/image'
import { BarreNav } from './BarreNav'
import { ChampReservation } from './ChampReservation'

/**
 * Hero de la landing (section Figma 193:135, partie haute).
 *
 * Géométrie relevée sur la maquette, mesurée depuis le haut du cadre :
 *   nav        y = 0    h = 60
 *   H1         y = 165  h = 136   (72 px, interligne 0,94, deux lignes)
 *   sous-titre y = 317  h = 58
 *   gravure    y = 415  h = 361   (1441 de large — toute la largeur du cadre)
 *   champ      y = 440  h = 51    (donc 25 px sous le haut de la gravure)
 *
 * Le champ est un enfant absolu du conteneur de la gravure, pas un frère :
 * ainsi sa position est calculée sur la hauteur réelle de l'image, quelle que
 * soit la largeur de la fenêtre.
 *
 * Les deux mains ne se touchent pas. C'est le sujet du produit, pas une
 * décoration : la mise en relation est ce qui manque, pas ce qui est acquis.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BarreNav />

      <div className="mx-auto flex max-w-[calc(1246*var(--u))] flex-col items-center px-6 pt-[calc(105*var(--u))]">
        <h1 className="text-center font-[family-name:var(--font-display)] text-[calc(72*var(--u))] font-semibold leading-[0.94] tracking-[-0.03em] text-[var(--texte)]">
          C’est ici que votre réseau
          <br />
          <span className="text-[var(--color-attenue)]">s’agrandit</span>
        </h1>

        <p className="mt-[calc(16*var(--u))] max-w-[calc(551*var(--u))] text-center text-[calc(19*var(--u))] leading-[1.55] tracking-[-0.03em] text-[var(--texte-2)]">
          Des communautés par domaine, des profils au chiffre d’affaires vérifié, et des mises en
          relation qui aboutissent.
        </p>
      </div>

      {/* Le conteneur impose lui-même le ratio 1441/361 de la bande Figma.
          C'est la seule façon fiable : laisser `height: auto` déduire la
          hauteur depuis l'image donnait un bloc de 335 px là où il en fallait
          149, ce qui creusait un vide et repoussait les mains vers le bas.
          Avec `fill` + `object-contain`, la géométrie ne dépend plus de ce que
          l'optimiseur d'images décide de servir. */}
      <div className="relative mt-[calc(40*var(--u))] aspect-[1441/361] w-full">
        <Image
          src="/hero/mains.png"
          alt="Gravure au pointillé : deux mains qui se tendent l’une vers l’autre sans se toucher."
          fill
          priority
          sizes="100vw"
          className="select-none object-contain object-top"
        />

        {/* 25 px sous le haut de la gravure, soit 6,9 % de ses 361 px. */}
        <div className="absolute left-1/2 top-[6.9%] w-full max-w-[calc(402*var(--u))] -translate-x-1/2 px-6 lg:px-0">
          <ChampReservation />
        </div>
      </div>
    </section>
  )
}
