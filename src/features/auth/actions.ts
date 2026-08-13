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

export type CodeAuth = 'VALIDATION' | 'TROP_DE_DEMANDES' | 'ENVOI' | 'INDISPONIBLE'

const MESSAGES: Record<CodeAuth, string> = {
  VALIDATION: 'Vérifiez votre adresse.',
  TROP_DE_DEMANDES: 'Trop de demandes coup sur coup. Patientez une minute avant de réessayer.',
  ENVOI: "Le lien n'a pas pu être envoyé. Réessayez dans un instant.",
  INDISPONIBLE: 'Les inscriptions ne sont pas encore ouvertes. Revenez très vite.',
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

  try {
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
      // On ne distingue jamais « adresse inconnue » de « adresse connue » dans
      // la réponse : ce serait un oracle permettant d'énumérer les membres.
      if (error.status === 429) {
        return { ok: false, code: 'TROP_DE_DEMANDES', message: MESSAGES.TROP_DE_DEMANDES }
      }
      return { ok: false, code: 'ENVOI', message: MESSAGES.ENVOI }
    }
  } catch (cause) {
    // Filet obligatoire : `clientServeur()` lève si Supabase n'est pas
    // configuré, et n'importe quelle panne réseau lève aussi. Sans ce catch,
    // Next renvoie la pile d'appel au navigateur — ce que la règle du projet
    // interdit formellement (fondations-dev/01, « gestion d'erreurs »).
    // La cause réelle part dans les logs serveur, jamais vers le visiteur.
    console.error('[auth] envoi du lien impossible', cause)
    const configManquante = !process.env.NEXT_PUBLIC_SUPABASE_URL
    return configManquante
      ? { ok: false, code: 'INDISPONIBLE', message: MESSAGES.INDISPONIBLE }
      : { ok: false, code: 'ENVOI', message: MESSAGES.ENVOI }
  }

  return { ok: true }
}

/** Déconnexion. Invalide la session côté Supabase et vide les cookies. */
export async function seDeconnecter(): Promise<void> {
  try {
    const supabase = await clientServeur()
    await supabase.auth.signOut()
  } catch (cause) {
    // Une déconnexion qui échoue ne doit jamais bloquer l'utilisateur sur une
    // page d'erreur : au pire les cookies expireront d'eux-mêmes.
    console.error('[auth] déconnexion impossible', cause)
  }
}
