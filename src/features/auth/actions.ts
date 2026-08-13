'use server'

import { clientServeur } from '@/lib/supabase/server'
import { cheminSur } from './redirection'
import { schemaDemandeLien } from './schemas'

/**
 * Server Actions d'authentification.
 *
 * Rappel : toute Server Action exportée est un endpoint POST public. Celles-ci
 * n'exigent pas d'être connecté (c'est leur objet), mais elles valident tout
 * ce qui entre et ne renvoient jamais d'erreur brute.
 */

export type ResultatAuth = { ok: true } | { ok: false; code: CodeAuth; message: string }

export type CodeAuth = 'VALIDATION' | 'TROP_DE_DEMANDES' | 'ENVOI'

const MESSAGES: Record<CodeAuth, string> = {
  VALIDATION: 'Vérifiez votre adresse.',
  TROP_DE_DEMANDES: 'Trop de demandes coup sur coup. Patientez une minute avant de réessayer.',
  ENVOI: "Le lien n'a pas pu être envoyé. Réessayez dans un instant.",
}

/**
 * Envoie un lien de connexion à usage unique.
 *
 * Deux points de sécurité :
 *
 * 1. `emailRedirectTo` pointe vers `/auth/confirmer`, qui vérifie un
 *    **token hash** plutôt que de consommer un code dans l'URL. Les clients
 *    mail préchargent les liens qu'ils reçoivent : un lien qui se consomme au
 *    simple chargement serait déjà brûlé quand l'utilisateur clique.
 * 2. La destination finale passe par `cheminSur()` — voir `redirection.ts`.
 */
export async function envoyerLienMagique(donnees: FormData): Promise<ResultatAuth> {
  const analyse = schemaDemandeLien.safeParse({
    email: donnees.get('email'),
    suite: donnees.get('suite') ?? undefined,
  })

  if (!analyse.success) {
    const premier = analyse.error.issues[0]
    return { ok: false, code: 'VALIDATION', message: premier?.message ?? MESSAGES.VALIDATION }
  }

  const { email, suite } = analyse.data
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const destination = `${base}/auth/confirmer?suite=${encodeURIComponent(cheminSur(suite))}`

  const supabase = await clientServeur()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Inscription immédiate : pas de formulaire séparé, pas de mot de passe.
      shouldCreateUser: true,
      emailRedirectTo: destination,
    },
  })

  if (error) {
    // On ne distingue jamais « adresse inconnue » de « adresse connue » dans la
    // réponse : ce serait un oracle permettant d'énumérer les membres.
    if (error.status === 429) {
      return { ok: false, code: 'TROP_DE_DEMANDES', message: MESSAGES.TROP_DE_DEMANDES }
    }
    return { ok: false, code: 'ENVOI', message: MESSAGES.ENVOI }
  }

  return { ok: true }
}

/** Déconnexion. Invalide la session côté Supabase et vide les cookies. */
export async function seDeconnecter(): Promise<void> {
  const supabase = await clientServeur()
  await supabase.auth.signOut()
}
