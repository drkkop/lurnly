import { describe, expect, it } from 'vitest'
import { genererCandidats, normaliserPseudo } from '../pseudo'

describe('normaliserPseudo', () => {
  it('met en minuscules', () => {
    expect(normaliserPseudo('Camille')).toBe('camille')
  })

  it('retire les accents sans casser la lettre', () => {
    expect(normaliserPseudo('Renée')).toBe('renee')
    expect(normaliserPseudo('Joël')).toBe('joel')
    expect(normaliserPseudo('François')).toBe('francois')
  })

  it('retire espaces, traits d’union et ponctuation', () => {
    expect(normaliserPseudo('Jean-Baptiste')).toBe('jeanbaptiste')
    expect(normaliserPseudo('Marie Claire')).toBe('marieclaire')
    expect(normaliserPseudo("O'Brien")).toBe('obrien')
  })

  it('ne laisse pas de tiret bas en bordure', () => {
    expect(normaliserPseudo('_camille_')).toBe('camille')
  })

  it('renvoie une chaîne vide si rien ne subsiste', () => {
    expect(normaliserPseudo('***')).toBe('')
  })
})

describe('genererCandidats', () => {
  it('propose le prénom nu en premier', () => {
    expect(genererCandidats('Camille')[0]).toBe('camille')
  })

  it('enchaîne sur des variantes numérotées', () => {
    const c = genererCandidats('Camille')
    expect(c[1]).toBe('camille2')
    expect(c).toContain('camille_pro')
  })

  it('écarte les candidats trop courts', () => {
    // « Jo » fait deux caractères : le pseudo nu est invalide, les variantes
    // numérotées atteignent la longueur minimale.
    const c = genererCandidats('Jo')
    expect(c).not.toContain('jo')
    expect(c).toContain('jo2')
  })

  it('ne produit aucun doublon', () => {
    const c = genererCandidats('Camille')
    expect(new Set(c).size).toBe(c.length)
  })

  it('renvoie une liste vide sur un prénom sans lettre exploitable', () => {
    expect(genererCandidats('***')).toEqual([])
  })

  it('ne dépasse jamais trente caractères', () => {
    for (const c of genererCandidats('a'.repeat(40))) {
      expect(c.length).toBeLessThanOrEqual(30)
    }
  })
})
