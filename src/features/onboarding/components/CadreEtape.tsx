import type { ReactNode } from 'react'
import type { Etape } from '../etapes'
import { ProgressionEtapes } from './ProgressionEtapes'

/**
 * Cadre commun aux sept écrans : formulaire à gauche, gravure à droite.
 *
 * La gravure disparaît sous `lg` — décision de séance. Elle est composée pour
 * un panneau vertical 2:3 ; tout autre cadrage l'abîme. Trois traitements
 * mobiles ont été testés (bande, filigrane, vignette) et rejetés. On ne les
 * réintroduit pas.
 */
export function CadreEtape({ etape, children }: { etape: Etape; children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-[var(--largeur-contenu)] grid-cols-1 gap-12 px-6 py-10 lg:grid-cols-[1fr_555px] lg:items-center lg:px-8">
      <div className="flex w-full max-w-[520px] flex-col gap-10">
        <ProgressionEtapes rang={etape.rang} />

        <header className="flex flex-col gap-3">
          <h1 className="font-[var(--font-display)] text-[34px] leading-[1.1] tracking-[-0.9px] lg:text-[40px]">
            {etape.titre}
          </h1>
          <p className="text-[15px] opacity-56">{etape.aide}</p>
        </header>

        {children}
      </div>

      <aside className="hidden lg:block">
        {/* Un RECTANGLE n'a pas de clipsContent : le rayon est appliqué à
            l'image elle-même, sinon les angles dépassent du panneau. */}
        <img
          src={etape.gravure}
          alt={etape.gravureAlt}
          width={555}
          height={882}
          className="h-[882px] w-[555px] rounded-[var(--radius-panneau)] object-cover"
        />
      </aside>
    </main>
  )
}
