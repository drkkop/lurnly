import { z } from 'zod'

/**
 * Schéma de la demande de lien de connexion.
 *
 * Un seul champ : l'email. Pas de mot de passe — décision produit. L'inscription
 * est immédiate et la vérification de l'email est différée : c'est le clic sur
 * le lien qui valide la place dans la liste d'attente.
 */
export const schemaDemandeLien = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Entrez votre adresse email.')
    .email('Cette adresse ne semble pas valide.')
    .max(254, 'Cette adresse est trop longue.'),
  suite: z.string().optional(),
})

export type DemandeLien = z.infer<typeof schemaDemandeLien>
