'use server'

import { enregistrerReponse, pseudoDisponible } from '@/dal/profil'
import { exigerUtilisateur } from '@/dal/utilisateur'
import { revalidatePath } from 'next/cache'
import { slugSuivant } from './etapes'
import { genererCandidats } from './pseudo'
import { SCHEMAS_PAR_ETAPE, estSlugConnu } from './schemas'

/**
 * Server Actions de l'onboarding.
 *
 * ⚠️ Toute Server Action exportée est un endpoint POST public, même si aucune
 * UI ne l'appelle. Chacune revérifie donc l'authentification en première
 * ligne, et n'accepte jamais un identifiant de ressource venu du client :
 * la ressource écrite est toujours celle de l'utilisateur du JWT.
 *
 * Aucune erreur brute (base, réseau) ne remonte au client. On renvoie un code
 * typé, l'UI le traduit en français.
 */

export type Resultat =
  | { ok: true; suivant: string | null }
  | { ok: false; code: CodeErreur; champ?: string; message: string }

export type CodeErreur =
  | 'NON_AUTHENTIFIE'
  | 'ETAPE_INCONNUE'
  | 'VALIDATION'
  | 'PSEUDO_PRIS'
  | 'ENREGISTREMENT'

const MESSAGES: Record<CodeErreur, string> = {
  NON_AUTHENTIFIE: 'Votre session a expiré. Reconnectez-vous pour reprendre où vous en étiez.',
  ETAPE_INCONNUE: "Cette étape n'existe pas.",
  VALIDATION: 'Vérifiez votre réponse.',
  PSEUDO_PRIS: 'Ce pseudo est déjà pris. Essayez-en un autre.',
  ENREGISTREMENT: "Votre réponse n'a pas pu être enregistrée. Réessayez dans un instant.",
}

function echec(code: CodeErreur, champ?: string, message?: string): Resultat {
  return { ok: false, code, champ, message: message ?? MESSAGES[code] }
}

/**
 * Enregistre la réponse d'une étape et renvoie le slug de la suivante.
 * Sauvegarde à chaque étape : quitter en cours de route ne perd rien.
 */
export async function repondreEtape(slug: string, donnees: FormData): Promise<Resultat> {
  try {
    await exigerUtilisateur()
  } catch {
    return echec('NON_AUTHENTIFIE')
  }

  if (!estSlugConnu(slug)) return echec('ETAPE_INCONNUE')

  // FormData → objet. Les champs à choix multiples arrivent en plusieurs
  // entrées de même nom : on les regroupe en tableau.
  const brut: Record<string, unknown> = {}
  for (const cle of new Set(donnees.keys())) {
    const valeurs = donnees.getAll(cle).map(String)
    brut[cle] = cle === 'recherche' || cle === 'apport' ? valeurs : valeurs[0]
  }

  const analyse = SCHEMAS_PAR_ETAPE[slug].safeParse(brut)
  if (!analyse.success) {
    const premier = analyse.error.issues[0]
    return echec('VALIDATION', premier?.path[0]?.toString(), premier?.message)
  }

  const champs: Record<string, unknown> = { ...analyse.data }

  if (slug === 'nom') {
    const { pseudo } = analyse.data as { pseudo: string }
    try {
      if (!(await pseudoDisponible(pseudo))) return echec('PSEUDO_PRIS', 'pseudo')
    } catch {
      return echec('ENREGISTREMENT')
    }
  }

  try {
    await enregistrerReponse(champs)
  } catch {
    return echec('ENREGISTREMENT')
  }

  revalidatePath('/onboarding', 'layout')
  return { ok: true, suivant: slugSuivant(slug) }
}

/**
 * Passe une étape sautable sans rien écrire.
 * Seules `bio` et `photo` le sont — les autres portent l'information qui sert
 * aux mises en relation.
 */
export async function sauterEtape(slug: string): Promise<Resultat> {
  try {
    await exigerUtilisateur()
  } catch {
    return echec('NON_AUTHENTIFIE')
  }
  if (!estSlugConnu(slug)) return echec('ETAPE_INCONNUE')
  return { ok: true, suivant: slugSuivant(slug) }
}

/**
 * Propose jusqu'à trois pseudos libres, dérivés d'un prénom.
 *
 * Exige d'être connecté, comme toute Server Action : c'est un endpoint POST
 * public, et interroger la disponibilité des pseudos sans session offrirait un
 * moyen d'énumérer les membres.
 *
 * On s'arrête à douze vérifications même si aucune n'aboutit : sans ce
 * plafond, un prénom très répandu ferait boucler la requête indéfiniment.
 * Renvoyer moins de trois propositions n'est pas un échec — le champ reste
 * libre à la saisie.
 */
export async function suggererPseudos(prenom: string): Promise<string[]> {
  try {
    await exigerUtilisateur()
  } catch {
    return []
  }

  const candidats = genererCandidats(prenom).slice(0, 12)
  const libres: string[] = []

  for (const candidat of candidats) {
    if (libres.length === 3) break
    try {
      if (await pseudoDisponible(candidat)) libres.push(candidat)
    } catch {
      // Base injoignable : on renvoie ce qu'on a plutôt que de faire échouer
      // l'écran pour une aide facultative.
      break
    }
  }

  return libres
}
