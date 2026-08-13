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

      <div className="mx-auto flex max-w-[var(--largeur-contenu)] flex-col items-center px-6 pt-[60px] lg:pt-[105px]">
        <h1 className="text-center font-[family-name:var(--font-display)] text-[40px] font-semibold leading-[0.94] tracking-[-0.03em] text-[var(--texte)] sm:text-[56px] lg:text-[72px]">
          C’est ici que votre réseau
          <br />
          <span className="text-[var(--color-attenue)]">s’agrandit</span>
        </h1>

        <p className="mt-[16px] max-w-[551px] text-center text-[16px] leading-[1.55] tracking-[-0.03em] text-[var(--texte-2)] lg:text-[19px]">
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
      <div className="relative mt-[40px] aspect-[1441/361] w-full">
        <Image
          src="/hero/mains.png"
          alt="Gravure au pointillé : deux mains qui se tendent l’une vers l’autre sans se toucher."
          fill
          priority
          sizes="100vw"
          className="select-none object-contain object-top"
        />

        {/* 25 px sous le haut de la gravure, soit 6,9 % de ses 361 px. */}
        <div className="absolute left-1/2 top-[6.9%] w-full max-w-[402px] -translate-x-1/2 px-6 lg:px-0">
          <ChampReservation />
        </div>
      </div>

      <p className="mt-[28px] px-6 text-center text-[13.5px] text-[var(--texte-3)]">
        Je construis Lurnly en public. Vous verrez tout, y compris ce qui rate.
      </p>
    </section>
  )
}
