/**
 * Les sept étapes de l'onboarding, en données.
 *
 * Volontairement un seul fichier de définitions plutôt que sept composants
 * dupliqués : la route `app/onboarding/[etape]` lit ce tableau et se rend
 * toute seule. Ajouter une étape = ajouter une entrée ici (et son schéma Zod
 * dans `schemas.ts`, et son poids dans `completion.ts`).
 *
 * Textes validés en séance — ne pas reformuler sans arbitrage. En particulier :
 * aucun titre ne doit classer les membres par palier de chiffre d'affaires.
 * « Où en êtes-vous ? » a été refusé pour cette raison.
 */

export type TypeDeChamp = 'choix-unique' | 'choix-multiple' | 'texte' | 'texte-long' | 'photo'

export type Option = {
  readonly valeur: string
  readonly libelle: string
}

export type Etape = {
  /** Segment d'URL. Stable : il apparaît dans les liens de reprise. */
  readonly slug: string
  /** Position affichée à l'utilisateur, de 1 à 7. */
  readonly rang: number
  readonly titre: string
  readonly aide: string
  readonly type: TypeDeChamp
  /** Colonne de `profils` alimentée par cette étape. */
  readonly champ: string
  readonly options?: readonly Option[]
  /** Nombre de colonnes de la grille de choix. */
  readonly colonnes?: 1 | 2
  readonly maxCaracteres?: number
  /** Gravure au pointillé du panneau de droite. Masquée sous `lg`. */
  readonly gravure: string
  /** Texte alternatif de la gravure. */
  readonly gravureAlt: string
  /** Une étape sautable n'empêche pas d'atteindre la fin du parcours. */
  readonly sautable: boolean
}

export const ETAPES = [
  {
    slug: 'domaine',
    rang: 1,
    titre: 'Dans quel domaine travaillez-vous ?',
    aide: "Vous pourrez en suivre d'autres à l'ouverture.",
    type: 'choix-unique',
    champ: 'domaine',
    colonnes: 2,
    options: [
      { valeur: 'ecommerce', libelle: 'E-commerce' },
      { valeur: 'saas', libelle: 'SaaS / logiciel' },
      { valeur: 'freelance', libelle: 'Freelance / prestation' },
      { valeur: 'agence', libelle: 'Agence' },
      { valeur: 'contenu', libelle: 'Création de contenu' },
      { valeur: 'ia', libelle: 'IA / data' },
      { valeur: 'physique', libelle: 'Commerce physique' },
      { valeur: 'autre', libelle: 'Autre' },
    ],
    gravure: '/gravures/01-main-descendante.webp',
    gravureAlt: 'Gravure au pointillé : une main ouverte descendant du haut.',
    sautable: false,
  },
  {
    slug: 'arrivee',
    rang: 2,
    titre: 'Avec quoi arrivez-vous ?',
    aide: 'Ça nous aide à savoir qui vous présenter en premier.',
    type: 'choix-unique',
    champ: 'arrivee',
    colonnes: 1,
    options: [
      { valeur: 'idee', libelle: 'Une idée' },
      { valeur: 'projet', libelle: 'Un projet en cours' },
      { valeur: 'activite', libelle: 'Une activité qui tourne' },
      { valeur: 'curiosite', libelle: 'Juste de la curiosité' },
    ],
    gravure: '/gravures/02-main-pousse.webp',
    gravureAlt: 'Gravure au pointillé : une main tenant une jeune pousse.',
    sautable: false,
  },
  {
    slug: 'nom',
    rang: 3,
    titre: 'Comment on vous appelle ?',
    aide: "Votre prénom apparaît sur votre profil. Le pseudo sert d'adresse.",
    type: 'texte',
    champ: 'nom',
    gravure: '/gravures/03-main-stylo.webp',
    gravureAlt: 'Gravure au pointillé : une main tenant un stylo-plume.',
    sautable: false,
  },
  {
    slug: 'recherche',
    rang: 4,
    titre: "Qu'est-ce que vous cherchez ?",
    aide: "Plusieurs réponses possibles. C'est ce qui apparaît sur votre profil.",
    type: 'choix-multiple',
    champ: 'recherche',
    colonnes: 2,
    options: [
      { valeur: 'associe', libelle: 'Un associé' },
      { valeur: 'prestataire', libelle: 'Un prestataire' },
      { valeur: 'clients', libelle: 'Des clients' },
      { valeur: 'conseil', libelle: 'Du conseil' },
      { valeur: 'retours', libelle: 'Des retours sur mon projet' },
      { valeur: 'investisseur', libelle: 'Un investisseur' },
      { valeur: 'echanges', libelle: 'Juste échanger' },
      { valeur: 'apprendre', libelle: 'Apprendre le métier' },
    ],
    gravure: '/gravures/04-deux-mains.webp',
    gravureAlt: 'Gravure au pointillé : deux mains qui se tendent sans se toucher.',
    sautable: false,
  },
  {
    slug: 'apport',
    rang: 5,
    titre: 'Et vous, vous apportez quoi ?',
    aide: 'Ce que vous savez faire, ce sur quoi on peut vous solliciter.',
    type: 'choix-multiple',
    champ: 'apport',
    colonnes: 2,
    options: [
      { valeur: 'dev', libelle: 'Du développement' },
      { valeur: 'design', libelle: 'Du design' },
      { valeur: 'acquisition', libelle: "De l'acquisition" },
      { valeur: 'contenu', libelle: 'Du contenu' },
      { valeur: 'vente', libelle: 'De la vente' },
      { valeur: 'ops', libelle: 'De la logistique / des ops' },
      { valeur: 'reseau', libelle: 'Du réseau' },
      { valeur: 'rien', libelle: "Rien pour l'instant" },
    ],
    gravure: '/gravures/05-paume-ouverte.webp',
    gravureAlt: 'Gravure au pointillé : une paume ouverte tournée vers le formulaire.',
    sautable: false,
  },
  {
    slug: 'bio',
    rang: 6,
    titre: 'Présentez-vous en deux lignes',
    aide: 'Ce que vous faites, concrètement.',
    type: 'texte-long',
    champ: 'bio',
    maxCaracteres: 280,
    gravure: '/gravures/06-carnet.webp',
    gravureAlt: 'Gravure au pointillé : un carnet ouvert, écriture illisible.',
    sautable: true,
  },
  {
    slug: 'photo',
    rang: 7,
    titre: "Une photo, et c'est fini",
    aide: "Un visage vaut mieux qu'un pseudo. Vous pouvez la mettre plus tard.",
    type: 'photo',
    champ: 'photo_url',
    gravure: '/gravures/07-main-photographie.webp',
    gravureAlt: 'Gravure au pointillé : une main tenant une photographie vierge.',
    sautable: true,
  },
] as const satisfies readonly Etape[]

export const NOMBRE_ETAPES = ETAPES.length

/** Retourne l'étape correspondant au slug, ou `undefined` si le slug est inconnu. */
export function etapeParSlug(slug: string): Etape | undefined {
  return ETAPES.find((e) => e.slug === slug)
}

/** Slug de l'étape suivante, ou `null` si c'est la dernière. */
export function slugSuivant(slug: string): string | null {
  const index = ETAPES.findIndex((e) => e.slug === slug)
  if (index === -1) return null
  return ETAPES[index + 1]?.slug ?? null
}

/** Slug de l'étape précédente, ou `null` si c'est la première. */
export function slugPrecedent(slug: string): string | null {
  const index = ETAPES.findIndex((e) => e.slug === slug)
  if (index <= 0) return null
  return ETAPES[index - 1]?.slug ?? null
}
