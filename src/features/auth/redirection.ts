/**
 * Validation des destinations de redirection.
 *
 * Module PUR — aucune dépendance à Next ni à Supabase, donc testable
 * directement (même raison que `completion.ts`).
 *
 * Pourquoi ça existe : le paramètre `suite` de `/connexion?suite=…` traverse
 * l'email de l'utilisateur avant de revenir dans l'application. Si on le
 * suivait tel quel, n'importe qui pourrait forger un lien
 * `/connexion?suite=https://site-pirate.fr` et faire atterrir la victime
 * ailleurs, juste après une connexion réussie — c'est la faille dite
 * « open redirect ». On n'accepte donc que des chemins internes.
 */

/** Destination utilisée quand `suite` est absent ou refusé. */
export const DESTINATION_PAR_DEFAUT = '/onboarding/domaine'

/**
 * Renvoie `suite` s'il s'agit d'un chemin interne sûr, sinon la destination
 * par défaut. Ne lève jamais : une valeur douteuse est remplacée, pas signalée
 * à l'attaquant.
 */
export function cheminSur(suite: string | null | undefined): string {
  if (!suite) return DESTINATION_PAR_DEFAUT

  // Doit commencer par une seule barre oblique. `//exemple.fr` et
  // `/\exemple.fr` sont interprétés par les navigateurs comme des URL
  // absolues protocole-relatives : ce sont des sorties du site.
  if (!suite.startsWith('/')) return DESTINATION_PAR_DEFAUT
  if (suite.startsWith('//') || suite.startsWith('/\\')) return DESTINATION_PAR_DEFAUT

  // Un schéma glissé après la barre (`/javascript:alert(1)`) n'a rien à faire
  // dans un chemin.
  if (suite.includes(':')) return DESTINATION_PAR_DEFAUT

  // Les retours à la ligne permettent l'injection d'en-têtes.
  if (/[\r\n\t]/.test(suite)) return DESTINATION_PAR_DEFAUT

  return suite
}
