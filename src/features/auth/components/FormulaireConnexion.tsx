'use client'

import { Bouton } from '@/components/ui/Bouton'
import { Champ } from '@/components/ui/Champ'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { envoyerLienMagique } from '../actions'

/**
 * Formulaire de demande de lien de connexion.
 *
 * Un champ, un bouton. Pas de mot de passe, donc pas de « mot de passe
 * oublié », pas de confirmation, pas de bascule connexion/inscription : la
 * même adresse fait les deux.
 */
export function FormulaireConnexion({ suite }: { suite: string }) {
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
    <form action={envoyer} className="flex flex-col gap-6">
      <input type="hidden" name="suite" value={suite} />

      <Champ
        id="email"
        name="email"
        type="email"
        label="Votre adresse email"
        autoComplete="email"
        inputMode="email"
        placeholder="vous@exemple.fr"
        aide="Pas de mot de passe. On vous envoie un lien, vous cliquez, c'est fait."
        erreur={erreur ?? undefined}
        required
      />

      <Bouton type="submit" disabled={enCours} pleineLargeur>
        {enCours ? 'Envoi…' : 'Recevoir mon lien'}
      </Bouton>
    </form>
  )
}
