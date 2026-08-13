/**
 * Fabrication de pseudos à partir d'un prénom.
 *
 * Module **pur** : aucune dépendance à Supabase ni à Next, donc testable
 * directement — même raison que `completion.ts` et `redirection.ts`.
 *
 * Les candidats sont produits dans un ordre stable et déterministe. C'est
 * volontaire : deux personnes prénommées Camille doivent voir la même
 * première proposition, et la disponibilité seule doit les départager.
 */

/** Longueurs imposées par le schéma Zod et par la contrainte SQL. */
const MIN = 3
const MAX = 30

/**
 * Réduit un prénom à un pseudo valide : minuscules, sans accents, sans
 * espaces ni ponctuation. « Renée-Claire » devient « reneeclaire ».
 */
export function normaliserPseudo(prenom: string): string {
  return (
    prenom
      .normalize('NFD')
      // Retire les marques combinantes décomposées (accents, cédilles,
      // trémas). La propriété Unicode \p{M} désigne la catégorie entière —
      // plus juste qu'une plage d'intervalles, qui en oublie toujours.
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .replace(/^_+|_+$/g, '')
      .slice(0, MAX)
  )
}

/**
 * Liste ordonnée de candidats à tester, du plus désirable au moins.
 *
 * D'abord le prénom nu, puis des variantes numérotées, puis deux suffixes
 * lisibles. On ne tire rien au hasard : un pseudo proposé doit pouvoir être
 * reproduit à l'identique si la personne recharge la page.
 */
export function genererCandidats(prenom: string): string[] {
  const base = normaliserPseudo(prenom)
  if (base.length === 0) return []

  const candidats: string[] = []
  const ajouter = (valeur: string) => {
    if (valeur.length >= MIN && valeur.length <= MAX && !candidats.includes(valeur)) {
      candidats.push(valeur)
    }
  }

  ajouter(base)
  for (const n of [2, 3, 4, 5, 6, 7, 8, 9]) ajouter(`${base}${n}`)
  ajouter(`${base}_fr`)
  ajouter(`${base}_pro`)
  // Filet pour les prénoms très courts, où `base` seul est sous la limite.
  ajouter(`${base}_${base}`)

  return candidats
}
