import 'server-only'

import { type EtatProfil, calculerCompletion } from '@/features/onboarding/completion'
import { clientServeur } from '@/lib/supabase/server'
import { exigerUtilisateur } from './utilisateur'

/**
 * Data Access Layer — profils.
 *
 * Règles appliquées ici, sans exception :
 *  - chaque fonction revérifie l'authentification, même si la page appelante
 *    l'a déjà fait ;
 *  - on n'écrit et on ne lit que la ligne dont l'utilisateur courant est
 *    propriétaire — le `id` vient du JWT, jamais d'un paramètre client
 *    (c'est la parade à l'IDOR) ;
 *  - on renvoie un DTO, jamais l'enregistrement brut : passer une ligne
 *    complète en prop d'un composant `'use client'` sérialise tout vers le
 *    navigateur, champs internes compris.
 */

export type ProfilDTO = {
  readonly id: string
  readonly prenom: string | null
  readonly pseudo: string | null
  readonly domaine: string | null
  readonly arrivee: string | null
  readonly recherche: readonly string[]
  readonly apport: readonly string[]
  readonly bio: string | null
  readonly photo_url: string | null
  readonly completion: number
  readonly ca_verifie: boolean
}

const COLONNES =
  'id, prenom, pseudo, domaine, arrivee, recherche, apport, bio, photo_url, ca_verifie'

type LigneProfil = {
  id: string
  prenom: string | null
  pseudo: string | null
  domaine: string | null
  arrivee: string | null
  recherche: string[] | null
  apport: string[] | null
  bio: string | null
  photo_url: string | null
  ca_verifie: boolean | null
}

function versDTO(ligne: LigneProfil): ProfilDTO {
  const etat: EtatProfil = {
    domaine: ligne.domaine,
    arrivee: ligne.arrivee,
    prenom: ligne.prenom,
    pseudo: ligne.pseudo,
    recherche: ligne.recherche ?? [],
    apport: ligne.apport ?? [],
    bio: ligne.bio,
    photo_url: ligne.photo_url,
  }
  return {
    id: ligne.id,
    prenom: ligne.prenom,
    pseudo: ligne.pseudo,
    domaine: ligne.domaine,
    arrivee: ligne.arrivee,
    recherche: ligne.recherche ?? [],
    apport: ligne.apport ?? [],
    bio: ligne.bio,
    photo_url: ligne.photo_url,
    completion: calculerCompletion(etat),
    ca_verifie: ligne.ca_verifie ?? false,
  }
}

/** Profil de l'utilisateur courant. `null` si la ligne n'existe pas encore. */
export async function monProfil(): Promise<ProfilDTO | null> {
  const utilisateur = await exigerUtilisateur()
  const supabase = await clientServeur()

  const { data, error } = await supabase
    .from('profils')
    .select(COLONNES)
    .eq('id', utilisateur.id)
    .maybeSingle<LigneProfil>()

  if (error) throw new Error('LECTURE_PROFIL_IMPOSSIBLE')
  return data ? versDTO(data) : null
}

/**
 * Écrit une réponse d'onboarding.
 *
 * `champs` est déjà validé par Zod côté action — la DAL ne fait pas confiance
 * à l'appelant pour l'identité, mais elle lui fait confiance pour la forme.
 *
 * Note d'implémentation : `upsert()` de Supabase n'accepte pas de `.eq()`
 * derrière. L'identité passe donc par la valeur de `id` dans l'objet inséré,
 * et la policy `WITH CHECK` de la RLS refuse toute autre valeur.
 */
export async function enregistrerReponse(champs: Record<string, unknown>): Promise<void> {
  const utilisateur = await exigerUtilisateur()
  const supabase = await clientServeur()

  const { error } = await supabase.from('profils').upsert(
    {
      id: utilisateur.id,
      ...champs,
      modifie_le: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) throw new Error('ECRITURE_PROFIL_IMPOSSIBLE')
}

/**
 * Vérifie qu'un pseudo est libre.
 * Lecture publique volontaire (la policy autorise la lecture du pseudo par
 * tout membre authentifié) : sans ça, l'utilisateur découvrirait le conflit
 * seulement au moment de l'écriture.
 */
export async function pseudoDisponible(pseudo: string): Promise<boolean> {
  const utilisateur = await exigerUtilisateur()
  const supabase = await clientServeur()

  const { data, error } = await supabase
    .from('profils')
    .select('id')
    .eq('pseudo', pseudo.toLowerCase())
    .maybeSingle<{ id: string }>()

  if (error) throw new Error('LECTURE_PROFIL_IMPOSSIBLE')
  // Son propre pseudo reste disponible pour lui-même.
  return data === null || data.id === utilisateur.id
}
