import { createBrowserClient } from '@supabase/ssr'

/**
 * Client Supabase pour le navigateur.
 *
 * N'utilise que des variables `NEXT_PUBLIC_` — donc rien de sensible : la clé
 * anonyme est publique par construction, c'est la RLS qui protège les données,
 * pas le secret de la clé.
 *
 * Usage réel au MVP : l'envoi du magic link et l'upload de la photo de profil.
 * Toute lecture de données passe par la DAL côté serveur.
 */
export function clientNavigateur() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !cle) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis. Voir .env.example.',
    )
  }
  return createBrowserClient(url, cle)
}
