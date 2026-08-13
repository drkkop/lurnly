import { NextResponse } from 'next/server'
import { clientServeur } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Cible du ping d'uptime (UptimeRobot / BetterStack).
 * Teste réellement la connexion à la base : un `/` qui répond alors que la
 * base est tombée ne prévient de rien.
 */
export async function GET() {
  try {
    const supabase = await clientServeur()
    const { error } = await supabase.from('profils').select('id', { head: true, count: 'exact' })
    if (error) throw error
    return NextResponse.json({ etat: 'ok', base: 'ok' })
  } catch {
    // Aucun détail d'erreur vers l'extérieur : la page de santé est publique.
    return NextResponse.json({ etat: 'degrade', base: 'ko' }, { status: 503 })
  }
}
