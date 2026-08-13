/**
 * Calcul du taux de complétion du profil.
 *
 * Module volontairement **pur** : aucune dépendance à Supabase, à Next, ni à
 * quoi que ce soit marqué `'server-only'`. C'est ce qui le rend testable dans
 * Vitest sans monter d'environnement (piège relevé en séance : importer un
 * module `'server-only'` dans la chaîne d'un test le fait échouer au build).
 *
 * Les poids somment à 100 et sont volontairement inégaux : les étapes qui
 * déterminent les mises en relation (ce que je cherche, ce que j'apporte)
 * pèsent plus que la photo.
 */

export const POIDS_ETAPES = {
  domaine: 15,
  arrivee: 15,
  nom: 10,
  recherche: 20,
  apport: 15,
  bio: 15,
  photo: 10,
} as const

export type ChampDeCompletion = keyof typeof POIDS_ETAPES

/** Somme des poids. Doit valoir 100 — vérifié par un test. */
export const POIDS_TOTAL = Object.values(POIDS_ETAPES).reduce((a, b) => a + b, 0)

/**
 * Vue minimale du profil nécessaire au calcul. On ne prend pas le DTO complet :
 * ça garde le module indépendant du schéma de la base.
 */
export type EtatProfil = {
  domaine?: string | null
  arrivee?: string | null
  prenom?: string | null
  pseudo?: string | null
  recherche?: readonly string[] | null
  apport?: readonly string[] | null
  bio?: string | null
  photo_url?: string | null
}

function rempli(valeur: unknown): boolean {
  if (valeur === null || valeur === undefined) return false
  if (typeof valeur === 'string') return valeur.trim().length > 0
  if (Array.isArray(valeur)) return valeur.length > 0
  return false
}

/** Renvoie, pour chaque étape, si elle est considérée comme remplie. */
export function etapesRemplies(profil: EtatProfil): Record<ChampDeCompletion, boolean> {
  return {
    domaine: rempli(profil.domaine),
    arrivee: rempli(profil.arrivee),
    // L'étape « nom » n'est acquise que si les deux champs sont là :
    // le pseudo seul ne suffit pas, c'est le prénom qui s'affiche sur le profil.
    nom: rempli(profil.prenom) && rempli(profil.pseudo),
    recherche: rempli(profil.recherche),
    apport: rempli(profil.apport),
    bio: rempli(profil.bio),
    photo: rempli(profil.photo_url),
  }
}

/** Taux de complétion en pourcentage entier, de 0 à 100. */
export function calculerCompletion(profil: EtatProfil): number {
  const remplies = etapesRemplies(profil)
  let total = 0
  for (const [champ, poids] of Object.entries(POIDS_ETAPES) as [ChampDeCompletion, number][]) {
    if (remplies[champ]) total += poids
  }
  return total
}

/**
 * Un profil est « complet » au sens de la première vague quand tout est rempli.
 * Levier distinct du parrainage : le parrainage fait remonter dans la file,
 * le profil complet donne l'accès à la première vague. Ne jamais mélanger
 * les deux (claude/09-mecanique-liste-attente.md).
 */
export function profilComplet(profil: EtatProfil): boolean {
  return calculerCompletion(profil) === POIDS_TOTAL
}

/** Premier champ non rempli, pour proposer une reprise au bon endroit. */
export function premiereEtapeManquante(profil: EtatProfil): ChampDeCompletion | null {
  const remplies = etapesRemplies(profil)
  for (const champ of Object.keys(POIDS_ETAPES) as ChampDeCompletion[]) {
    if (!remplies[champ]) return champ
  }
  return null
}
