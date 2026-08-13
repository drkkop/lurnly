import { rafraichirSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

/**
 * Le middleware rafraîchit la session. Il ne protège rien.
 * Voir le commentaire de `src/lib/supabase/middleware.ts` : toute barrière
 * posée ici serait contournable (CVE-2025-29927).
 */
export async function middleware(requete: NextRequest) {
  return rafraichirSession(requete)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|gravures|.*\\.(?:svg|png|jpg|webp)$).*)',
  ],
}
