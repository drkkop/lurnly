import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Client Supabase pour le contexte serveur (Server Components, Server Actions,
 * route handlers).
 *
 * Marqué `'server-only'` : le build casse si un composant client l'importe.
 *
 * Rappel de sécurité (fondations-dev/02-securite.md §2) — côté serveur, on
 * n'appelle **jamais** `getSession()` : il lit le cookie sans revalider la
 * signature, donc il est falsifiable. On utilise `getClaims()`.
 */
export async function clientServeur() {
  const magasin = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !cle) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis. Voir .env.example.',
    )
  }

  return createServerClient(url, cle, {
    cookies: {
      getAll() {
        return magasin.getAll()
      },
      setAll(cookiesAEcrire) {
        try {
          for (const { name, value, options } of cookiesAEcrire) {
            magasin.set(name, value, options)
          }
        } catch {
          // Appelé depuis un Server Component : l'écriture de cookies y est
          // interdite. Sans conséquence — c'est le middleware qui rafraîchit
          // la session.
        }
      },
    },
  })
}
