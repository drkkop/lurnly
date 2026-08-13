/**
 * API publique du domaine onboarding.
 * Les autres features importent d'ici, jamais d'un chemin interne :
 * ça garde les frontières nettes et rend les refactorisations locales.
 */
export { ETAPES, NOMBRE_ETAPES, etapeParSlug, slugPrecedent, slugSuivant } from './etapes'
export type { Etape, Option, TypeDeChamp } from './etapes'
export {
  calculerCompletion,
  POIDS_ETAPES,
  POIDS_TOTAL,
  premiereEtapeManquante,
  profilComplet,
} from './completion'
export type { ChampDeCompletion, EtatProfil } from './completion'
export { repondreEtape, sauterEtape } from './actions'
export type { CodeErreur, Resultat } from './actions'
export { CadreEtape } from './components/CadreEtape'
export { FormulaireEtape } from './components/FormulaireEtape'
export { ProgressionEtapes } from './components/ProgressionEtapes'
