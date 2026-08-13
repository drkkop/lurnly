import 'server-only'

import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase anonyme, sans cookies.
 *
 * Réservé aux lectures **publiques** : la landing doit pouvoir afficher le
 * compteur d'inscrits sans session. Comme il ne lit aucun cookie, la page qui
 * l'utilise reste rendue statiquement — un client à cookies forcerait un rendu
 * dynamique à chaque visite.
 *
 * Il n'a que la clé anonyme : la RLS reste la seule barrière, et c'est voulu.
 * Ne jamais lui faire lire une table qui contient des données de membres.
 */
export function clientPublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !cle) return null
  return createClient(url, cle, { auth: { persistSession: false } })
}
