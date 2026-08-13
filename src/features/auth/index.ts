/** API publique du domaine authentification. */
export { envoyerLienMagique, seDeconnecter } from './actions'
export type { CodeAuth, ResultatAuth } from './actions'
export { cheminSur, DESTINATION_PAR_DEFAUT } from './redirection'
export { schemaDemandeLien } from './schemas'
export type { DemandeLien } from './schemas'
export { FormulaireConnexion } from './components/FormulaireConnexion'
