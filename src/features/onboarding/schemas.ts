import { z } from 'zod'
import { ETAPES } from './etapes'

/**
 * Un schéma Zod par étape.
 *
 * TypeScript ne vérifie rien à l'exécution : tout ce qui vient du navigateur
 * passe ici avant d'atteindre la base (fondations-dev/01-architecture.md).
 * Les mêmes schémas servent côté client pour l'UX de formulaire — une seule
 * source de vérité pour les règles de validation.
 */

/** Construit un enum Zod à partir des options déclarées pour une étape. */
function valeursDe(slug: string): [string, ...string[]] {
  const etape = ETAPES.find((e) => e.slug === slug)
  const options = etape && 'options' in etape ? etape.options : undefined
  if (!options || options.length === 0) {
    throw new Error(`L'étape « ${slug} » n'a pas d'options déclarées.`)
  }
  const valeurs = options.map((o) => o.valeur)
  // `valeursDe` n'est appelé que sur des étapes à options : la première existe.
  return [valeurs[0] as string, ...valeurs.slice(1)]
}

const messageChoixRequis = 'Choisissez une réponse pour continuer.'

export const schemaDomaine = z.object({
  domaine: z.enum(valeursDe('domaine'), { message: messageChoixRequis }),
})

export const schemaArrivee = z.object({
  arrivee: z.enum(valeursDe('arrivee'), { message: messageChoixRequis }),
})

export const schemaNom = z.object({
  prenom: z
    .string()
    .trim()
    .min(2, 'Votre prénom fait au moins deux caractères.')
    .max(50, 'Votre prénom fait au plus cinquante caractères.'),
  pseudo: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Le pseudo fait au moins trois caractères.')
    .max(30, 'Le pseudo fait au plus trente caractères.')
    .regex(
      /^[a-z0-9_]+$/,
      'Le pseudo n’accepte que des lettres sans accent, des chiffres et des tirets bas.',
    )
    .refine((v) => !v.startsWith('_') && !v.endsWith('_'), {
      message: 'Le pseudo ne commence ni ne finit par un tiret bas.',
    }),
})

export const schemaRecherche = z.object({
  recherche: z
    .array(z.enum(valeursDe('recherche')))
    .min(1, 'Choisissez au moins une réponse.')
    .max(8),
})

export const schemaApport = z.object({
  apport: z.array(z.enum(valeursDe('apport'))).min(1, 'Choisissez au moins une réponse.').max(8),
})

export const schemaBio = z.object({
  bio: z
    .string()
    .trim()
    .max(280, 'Deux lignes suffisent : 280 caractères maximum.')
    .optional()
    .default(''),
})

export const schemaPhoto = z.object({
  // La DAL ne reçoit qu'un chemin de stockage, jamais le fichier brut :
  // l'upload passe par Supabase Storage côté client authentifié.
  photo_url: z.string().trim().max(500).optional().default(''),
})

/** Table de correspondance slug → schéma, utilisée par la Server Action. */
export const SCHEMAS_PAR_ETAPE = {
  domaine: schemaDomaine,
  arrivee: schemaArrivee,
  nom: schemaNom,
  recherche: schemaRecherche,
  apport: schemaApport,
  bio: schemaBio,
  photo: schemaPhoto,
} as const

export type SlugEtape = keyof typeof SCHEMAS_PAR_ETAPE

export function estSlugConnu(slug: string): slug is SlugEtape {
  return slug in SCHEMAS_PAR_ETAPE
}
