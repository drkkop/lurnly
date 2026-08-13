import { cheminSur } from '@/features/auth/redirection'
import { clientServeur } from '@/lib/supabase/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Point d'arrivée du lien de connexion.
 *
 * On vérifie un **token hash** (`verifyOtp`) et non un code d'échange. Raison :
 * beaucoup de clients mail préchargent les liens contenus dans les messages
 * pour en générer un aperçu. Avec un lien qui se consomme au chargement,
 * l'utilisateur cliquerait sur un lien déjà brûlé. Le token hash suppose que
 * le gabarit d'email utilise `{{ .TokenHash }}` — voir
 * `supabase/templates/magic_link.html`.
 */
export async function GET(requete: NextRequest) {
  const parametres = requete.nextUrl.searchParams
  const tokenHash = parametres.get('token_hash')
  const type = parametres.get('type') as EmailOtpType | null
  const suite = cheminSur(parametres.get('suite'))

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL('/connexion?erreur=lien_invalide', requete.url))
  }

  const supabase = await clientServeur()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error) {
    // Lien expiré, déjà utilisé, ou forgé — un seul message pour les trois.
    return NextResponse.redirect(new URL('/connexion?erreur=lien_invalide', requete.url))
  }

  return NextResponse.redirect(new URL(suite, requete.url))
}
