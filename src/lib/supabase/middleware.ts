import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Rafraîchissement de la session dans le middleware.
 *
 * ⚠️ Ce fichier ne contient AUCUN contrôle d'accès, et ne doit jamais en
 * contenir. Leçon de CVE-2025-29927 : un simple en-tête HTTP permettait de
 * sauter entièrement le middleware Next.js. Toute autorisation posée ici
 * serait contournable.
 *
 * L'autorisation vit dans la DAL et dans les Server Actions, revérifiée à
 * chaque appel, avec la RLS Postgres en dernier filet.
 */
export async function rafraichirSession(requete: NextRequest) {
  let reponse = NextResponse.next({ request: requete })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !cle) return reponse

  const supabase = createServerClient(url, cle, {
    cookies: {
      getAll() {
        return requete.cookies.getAll()
      },
      setAll(cookiesAEcrire: { name: string; value: string; options: CookieOptions }[]) {
        for (const { name, value } of cookiesAEcrire) {
          requete.cookies.set(name, value)
        }
        reponse = NextResponse.next({ request: requete })
        for (const { name, value, options } of cookiesAEcrire) {
          reponse.cookies.set(name, value, options)
        }
      },
    },
  })

  // Cet appel est le seul but du middleware : il revalide le JWT et réécrit
  // les cookies rafraîchis. Ne rien déduire de son résultat ici.
  await supabase.auth.getClaims()

  return reponse
}
