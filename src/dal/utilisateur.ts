import 'server-only'

import { clientServeur } from '@/lib/supabase/server'

/**
 * Data Access Layer — utilisateur authentifié.
 *
 * Un seul endroit lit l'identité. Toute fonction de la DAL et toute Server
 * Action passent par ici : c'est ce qui rend l'audit possible (ouvrir un
 * dossier et voir tous les contrôles).
 */

/** DTO minimal. On ne renvoie jamais l'objet utilisateur brut de Supabase. */
export type UtilisateurCourant = {
  readonly id: string
  readonly email: string
}

/**
 * Identité vérifiée, ou `null`.
 *
 * `getClaims()` vérifie la signature du JWT. `getSession()` est proscrit :
 * il fait confiance au cookie sans le revalider.
 */
export async function utilisateurCourant(): Promise<UtilisateurCourant | null> {
  const supabase = await clientServeur()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) return null

  const claims = data.claims as { sub?: unknown; email?: unknown }
  const id = typeof claims.sub === 'string' ? claims.sub : null
  const email = typeof claims.email === 'string' ? claims.email : null
  if (!id || !email) return null

  return { id, email }
}

/**
 * Même chose, mais lève si personne n'est connecté.
 * À utiliser dans les Server Actions, où l'absence d'identité est une erreur
 * de programmation ou une tentative d'appel direct de l'endpoint.
 */
export async function exigerUtilisateur(): Promise<UtilisateurCourant> {
  const utilisateur = await utilisateurCourant()
  if (!utilisateur) throw new Error('NON_AUTHENTIFIE')
  return utilisateur
}
