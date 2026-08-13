import { MarqueLurnly } from '@/components/ui/LogoLurnly'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Etape } from '../etapes'
import { ProgressionEtapes } from './ProgressionEtapes'

/**
 * Cadre commun aux sept écrans (nœud Figma 138:2 et ses jumeaux).
 *
 * Colonne de formulaire à gauche (460 px), panneau blanc de 555 × 882 à droite
 * avec la gravure. Les tirets de progression sont centrés sous le formulaire.
 *
 * Le panneau disparaît sous `lg` — décision de séance. La gravure est composée
 * pour un cadre vertical 2:3 ; tout autre cadrage l'abîme. Trois traitements
 * mobiles ont été testés (bande, filigrane, vignette) et rejetés. On ne les
 * réintroduit pas.
 */
export function CadreEtape({ etape, children }: { etape: Etape; children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-[var(--fond)]">
      <header className="flex items-center justify-between px-[24px] py-[19px]">
        <Link href="/" aria-label="Lurnly — accueil">
          <MarqueLurnly taille={35} />
        </Link>

        {/* Sortie possible depuis n'importe quelle étape : la réponse en cours
            est déjà enregistrée, revenir ne perd rien. */}
        <Link
          href="/"
          className="text-[15px] font-medium text-[var(--texte-3)] transition-colors hover:text-[var(--texte)]"
        >
          Reprendre plus tard
        </Link>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-[80px] pt-[40px] lg:grid-cols-[1fr_555px] lg:gap-[60px] lg:px-[60px] lg:pt-0">
        <div className="mx-auto flex w-full max-w-[460px] flex-col lg:mx-0 lg:ml-auto lg:mr-[80px]">
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold leading-[1.14] tracking-[-1.2px] text-[var(--texte)] lg:text-[34px] lg:tracking-[-2px]">
            {etape.titre}
          </h1>

          <p className="mt-[10px] max-w-[460px] text-[14.5px] leading-[1.55] text-[var(--texte-3)]">
            {etape.aide}
          </p>

          <div className="mt-[36px]">{children}</div>
        </div>

        {/* Panneau de la gravure. Un RECTANGLE n'a pas de clipsContent :
            le rayon est porté par le conteneur, qui découpe l'image. */}
        <aside className="hidden lg:block">
          <div className="relative h-[882px] w-[555px] overflow-hidden rounded-[var(--radius-panneau)] bg-white shadow-[var(--shadow-panneau)]">
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_50px_0px_rgba(0,0,0,0.25)]" />
            {/* Le recadrage vient de Figma, pas de nous.
                L'image source est bien plus grande que le cadre : le nœud
                146:128 la place à 156,5 % de large, 133,17 % de haut, décalée
                de −27,12 % vers la gauche, dans une fenêtre de 354 × 624 qui
                la rogne. Reproduire ces valeurs est la seule façon de cadrer
                la main comme dans la maquette — un `object-cover` recentre
                l'image et fait glisser la main hors du panneau. */}
            <div className="pointer-events-none absolute left-[66px] top-0 h-[624px] w-[354px] overflow-hidden">
              <Image
                src={etape.gravure}
                alt={etape.gravureAlt}
                width={554}
                height={831}
                priority={etape.rang === 1}
                className="absolute left-[-27.12%] top-0 h-[133.17%] w-[156.5%] max-w-none select-none"
              />
            </div>
          </div>
        </aside>
      </div>

      <div className="pb-[40px] lg:absolute lg:bottom-[16px] lg:left-0 lg:w-[calc(100%-555px-60px)] lg:pb-0">
        <div className="mx-auto w-full max-w-[460px] lg:mr-[80px] lg:ml-auto">
          <ProgressionEtapes rang={etape.rang} />
        </div>
      </div>
    </div>
  )
}
