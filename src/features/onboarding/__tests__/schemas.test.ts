import { describe, expect, it } from 'vitest'
import { ETAPES, NOMBRE_ETAPES, slugPrecedent, slugSuivant } from '../etapes'
import { SCHEMAS_PAR_ETAPE, estSlugConnu, schemaBio, schemaNom, schemaRecherche } from '../schemas'

describe('cohérence étapes ↔ schémas', () => {
  it('déclare sept étapes', () => {
    expect(NOMBRE_ETAPES).toBe(7)
  })

  it('associe un schéma à chaque étape — sinon la Server Action lève à chaud', () => {
    for (const etape of ETAPES) {
      expect(estSlugConnu(etape.slug), `slug manquant : ${etape.slug}`).toBe(true)
    }
    expect(Object.keys(SCHEMAS_PAR_ETAPE)).toHaveLength(NOMBRE_ETAPES)
  })

  it('donne des rangs de 1 à 7 sans trou', () => {
    expect(ETAPES.map((e) => e.rang)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('ne rend sautables que la bio et la photo', () => {
    const sautables = ETAPES.filter((e) => e.sautable).map((e) => e.slug)
    expect(sautables).toEqual(['bio', 'photo'])
  })
})

describe('navigation', () => {
  it('enchaîne les slugs dans l’ordre', () => {
    expect(slugSuivant('domaine')).toBe('arrivee')
    expect(slugPrecedent('arrivee')).toBe('domaine')
  })

  it('renvoie null aux extrémités', () => {
    expect(slugPrecedent('domaine')).toBeNull()
    expect(slugSuivant('photo')).toBeNull()
  })

  it('renvoie null sur un slug inconnu plutôt que de lever', () => {
    expect(slugSuivant('inexistant')).toBeNull()
  })
})

describe('schemaNom', () => {
  it('accepte un prénom et un pseudo valides', () => {
    const r = schemaNom.safeParse({ prenom: 'Robin', pseudo: 'robin_39' })
    expect(r.success).toBe(true)
  })

  it('met le pseudo en minuscules', () => {
    const r = schemaNom.parse({ prenom: 'Robin', pseudo: 'RoBiN' })
    expect(r.pseudo).toBe('robin')
  })

  it('refuse les accents et les espaces dans le pseudo', () => {
    expect(schemaNom.safeParse({ prenom: 'Robin', pseudo: 'rébin' }).success).toBe(false)
    expect(schemaNom.safeParse({ prenom: 'Robin', pseudo: 'ro bin' }).success).toBe(false)
  })

  it('refuse un pseudo bordé de tirets bas', () => {
    expect(schemaNom.safeParse({ prenom: 'Robin', pseudo: '_robin' }).success).toBe(false)
    expect(schemaNom.safeParse({ prenom: 'Robin', pseudo: 'robin_' }).success).toBe(false)
  })

  it('refuse un prénom trop court', () => {
    expect(schemaNom.safeParse({ prenom: 'R', pseudo: 'robin' }).success).toBe(false)
  })
})

describe('schemaRecherche', () => {
  it('exige au moins un choix', () => {
    expect(schemaRecherche.safeParse({ recherche: [] }).success).toBe(false)
  })

  it('refuse une valeur hors liste', () => {
    expect(schemaRecherche.safeParse({ recherche: ['licorne'] }).success).toBe(false)
  })

  it('accepte plusieurs valeurs de la liste', () => {
    expect(schemaRecherche.safeParse({ recherche: ['associe', 'conseil'] }).success).toBe(true)
  })
})

describe('schemaBio', () => {
  it('accepte le vide — la bio est sautable', () => {
    expect(schemaBio.safeParse({}).success).toBe(true)
  })

  it('refuse au-delà de 280 caractères', () => {
    expect(schemaBio.safeParse({ bio: 'a'.repeat(281) }).success).toBe(false)
  })

  it('accepte exactement 280 caractères', () => {
    expect(schemaBio.safeParse({ bio: 'a'.repeat(280) }).success).toBe(true)
  })
})
