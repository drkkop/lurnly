'use client'

import { envoyerLienMagique } from '@/features/auth/actions'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

/**
 * Champ email + CTA du hero (nœud Figma 97:9).
 *
 * C'est le seul point d'entrée de la liste d'attente. Il partage la Server
 * Action du magic link : réserver sa place et se connecter sont le même geste,
 * puisqu'il n'y a pas de mot de passe.
 */
export function ChampReservation() {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)

  function envoyer(donnees: FormData) {
    setErreur(null)
    demarrer(async () => {
      const resultat = await envoyerLienMagique(donnees)
      if (!resultat.ok) {
        setErreur(resultat.message)
        return
      }
      // Écran 2 du funnel : la place est annoncée comme acquise, pas comme
      // « en attente de confirmation ». C'est la décision produit.
      router.push('/place-reservee')
    })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form
        action={envoyer}
        /* Aucun indicateur de focus, ni anneau ni changement de filet :
           décision de design assumée. Conséquence connue — au clavier, rien ne
           signale que le curseur est dans le champ. À rétablir si le parcours
           clavier devient un sujet. */
        className="sans-anneau flex w-full max-w-[calc(402*var(--u))] items-center gap-[calc(8*var(--u))] rounded-[calc(13*var(--u))] border border-[var(--filet)] bg-[var(--surface)] py-[calc(5*var(--u))] pl-[calc(18*var(--u))] pr-[calc(5*var(--u))]"
      >
        <input type="hidden" name="suite" value="/onboarding/domaine" />
        <label htmlFor="email-hero" className="sr-only">
          Votre adresse email
        </label>
        <input
          id="email-hero"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="votre@email.fr"
          className="min-w-0 flex-1 bg-transparent text-[var(--t-15)] text-[var(--texte)] placeholder:text-[var(--texte-3)]"
        />
        <button
          type="submit"
          disabled={enCours}
          className="shrink-0 rounded-[calc(9*var(--u))] bg-[var(--color-encre)] px-[calc(18*var(--u))] py-[calc(11*var(--u))] text-[var(--t-14)] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {enCours ? 'Un instant…' : 'Réserver ma place'}
        </button>
      </form>

      {erreur ? (
        <p role="alert" className="text-[13px] font-medium text-[var(--texte)]">
          {erreur}
        </p>
      ) : null}
    </div>
  )
}
