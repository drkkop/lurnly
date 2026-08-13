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
      const email = String(donnees.get('email') ?? '')
      router.push(`/connexion/verifiez?email=${encodeURIComponent(email)}`)
    })
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form
        action={envoyer}
        className="flex w-full max-w-[402px] items-center gap-2 rounded-[var(--radius-carte)] border border-[var(--filet)] bg-[var(--surface)] py-[5px] pl-[18px] pr-[5px] shadow-[var(--shadow-carte)]"
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
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--texte)] outline-none placeholder:text-[var(--texte-3)]"
        />
        <button
          type="submit"
          disabled={enCours}
          className="shrink-0 rounded-[var(--radius-bouton)] bg-[var(--color-encre)] px-[18px] py-[11px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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
