import { MarqueLurnly } from '@/components/ui/LogoLurnly'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Etape } from '../etapes'
import { ProgressionEtapes } from './ProgressionEtapes'
import { TransitionEtape } from './TransitionEtape'

/**
 * Cadre commun aux sept écrans (nœud Figma 138:2 et ses jumeaux).
 *
 * Contrainte de départ : **l'écran tient dans la fenêtre, sans défilement.**
 * Un onboarding qu'on doit faire défiler pour trouver le bouton « Continuer »
 * perd des gens à chaque étape.
 *
 * D'où deux choix de mise en page :
 *
 * 1. Le panneau de droite n'a pas de hauteur fixe. Dans la maquette il occupe
 *    882 px sur un cadre de 900, soit 8 px de marge en haut et en bas — on
 *    reprend ces marges telles quelles et sa largeur découle du ratio 555/882.
 *    Il s'adapte donc à n'importe quelle hauteur de fenêtre.
 * 2. Tout le reste est exprimé en unités de maquette (`--u`), comme le hero,
 *    pour que les proportions tiennent à n'importe quelle largeur.
 *
 * Le panneau disparaît sous `lg` — décision de séance. La gravure est composée
 * pour un cadre vertical 2:3 ; tout autre cadrage l'abîme. Trois traitements
 * mobiles ont été testés (bande, filigrane, vignette) et rejetés.
 */
export function CadreEtape({ etape, children }: { etape: Etape; children: ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[var(--fond)] lg:block">
      <header className="z-10 flex shrink-0 items-center justify-between px-[calc(24*var(--u))] py-[calc(19*var(--u))] lg:absolute lg:left-0 lg:top-0 lg:w-[60.5%]">
        <Link href="/" aria-label="Lurnly — accueil">
          <MarqueLurnly />
        </Link>

        {/* Sortie possible depuis n'importe quelle étape : la réponse en cours
            est déjà enregistrée, revenir ne perd rien. */}
        <Link
          href="/"
          className="text-[var(--t-15)] font-medium text-[var(--texte-3)] transition-colors hover:text-[var(--texte)]"
        >
          Reprendre plus tard
        </Link>
      </header>

      {/* Panneau de la gravure. Sa hauteur suit la fenêtre, sa largeur suit
          le ratio de la maquette. */}
      <aside className="absolute bottom-[calc(8*var(--u))] right-[calc(9*var(--u))] top-[calc(8*var(--u))] hidden aspect-[555/882] lg:block">
        {/* Carte du panneau — spécification Figma du nœud 140:110 :
            555 × 882, rayon 15, fond blanc opaque, aucun contour,
            ombre portée  0 / 0 / 10, noir à 25 %,
            ombre interne 0 / 0 / 50, noir à 25 %.
            Les deux ombres sont séparées : CSS ne permet pas de combiner une
            ombre portée et une ombre interne dans la même déclaration sur un
            élément dont le contenu est rogné. */}
        <div className="relative h-full w-full overflow-hidden rounded-[calc(15*var(--u))] bg-white shadow-[var(--shadow-panneau)]">
          {/* La gravure remplit le panneau entier. Les deux rapports sont
              presque identiques — 555/882 contre 1024/1536 — donc le recadrage
              est négligeable, et aucun bord blanc de l'image ne vient dessiner
              un rectangle par-dessus l'ombre interne.

              `mix-blend-multiply` rend le blanc de la gravure transparent : sur
              un dessin en niveaux de gris, seul le pointillé subsiste, et
              l'ombre interne posée dessous transparaît à travers. C'est ce qui
              donne le vignettage sur toute la carte, y compris là où la main
              la recouvre. */}
          <TransitionEtape key={`grav-${etape.slug}`} variante="gravure">
            <Image
              src={etape.gravure}
              alt={etape.gravureAlt}
              fill
              priority={etape.rang === 1}
              sizes="40vw"
              className="select-none object-cover object-center mix-blend-multiply"
            />
          </TransitionEtape>

          {/* Ombre interne, posée PAR-DESSUS la gravure.
              Elle était sous l'image, et je comptais sur `mix-blend-multiply`
              pour la laisser transparaître. Ça ne pouvait pas marcher :
              l'enveloppe d'animation applique une `transform`, donc crée un
              contexte d'empilement, et un mélange ne voit jamais au-delà du
              sien. Au-dessus, le vignettage ne dépend plus d'aucun mélange. */}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0px_0px_50px_0px_rgb(0_0_0_/_0.25)]" />
        </div>
      </aside>

      {/* Colonne du formulaire. Centrée verticalement dans la fenêtre, calée
          sur la gouttière de la maquette (208 px sur 1440, soit 14,4 %). */}
      <main
        id="contenu"
        className="flex min-h-0 flex-1 items-center overflow-y-auto px-6 lg:absolute lg:inset-y-0 lg:left-[14.4%] lg:w-[39%] lg:overflow-visible lg:px-0"
      >
        <TransitionEtape key={`col-${etape.slug}`}>
          <div className="mx-auto w-full max-w-[calc(560*var(--u))] py-6 lg:mx-0 lg:py-0">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--t-34)] font-semibold leading-[1.14] tracking-[-0.0588em] text-[var(--texte)]">
              {etape.titre}
            </h1>

            <p className="mt-[calc(10*var(--u))] text-[var(--t-145)] leading-[1.55] text-[var(--texte-3)]">
              {etape.aide}
            </p>

            {/* Le formulaire reste à 460 : c'est la largeur du bouton
              « Continuer » et de la grille d'options dans la maquette. */}
            <div className="mt-[calc(36*var(--u))] max-w-[calc(460*var(--u))]">{children}</div>
          </div>
        </TransitionEtape>
      </main>

      <div className="shrink-0 pb-[calc(24*var(--u))] lg:absolute lg:bottom-[calc(16*var(--u))] lg:left-[14.4%] lg:w-[39%] lg:pb-0">
        {/* Même bloc de 460 que la grille d'options et le bouton, calé à
            gauche sur la colonne : les tirets partagent ainsi exactement l'axe
            central du bouton « Continuer ». Centrer sur la colonne de 560 les
            décalerait de 50 vers la droite. */}
        <div className="mx-auto w-full max-w-[calc(460*var(--u))] lg:mx-0">
          <ProgressionEtapes rang={etape.rang} />
        </div>
      </div>
    </div>
  )
}
