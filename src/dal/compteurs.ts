import 'server-only'

import { clientPublic } from '@/lib/supabase/public'

/**
 * Seuil public de la liste d'attente. Décision produit : l'ouverture est
 * annoncée à 1 000 préinscriptions.
 */
export const SEUIL_PLACES = 1000

/**
 * Nombre d'inscrits, lu dans la table d'agrégats `compteurs`.
 *
 * Volontairement **sans contrôle d'authentification** — contrairement au reste
 * de la DAL. C'est une donnée publique, affichée sur la landing avant toute
 * connexion. La seule table qu'elle touche ne contient qu'un entier.
 *
 * Renvoie `null` si la base n'est pas joignable ou pas encore configurée :
 * l'appelant affiche alors le seuil seul, plutôt qu'un chiffre inventé.
 */
export async function nombreInscrits(): Promise<number | null> {
  const supabase = clientPublic()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('compteurs')
    .select('valeur')
    .eq('cle', 'inscrits')
    .maybeSingle<{ valeur: number }>()

  if (error || !data) return null
  return Number(data.valeur)
}
