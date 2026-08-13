import { describe, expect, it } from 'vitest'
import {
  POIDS_ETAPES,
  POIDS_TOTAL,
  calculerCompletion,
  etapesRemplies,
  premiereEtapeManquante,
  profilComplet,
} from '../completion'

const PROFIL_COMPLET = {
  domaine: 'saas',
  arrivee: 'projet',
  prenom: 'Robin',
  pseudo: 'robin',
  recherche: ['associe'],
  apport: ['dev'],
  bio: 'Je construis Lurnly.',
  photo_url: '/p/robin.webp',
}

describe('poids', () => {
  it('somme à 100 — sinon le pourcentage affiché est faux', () => {
    expect(POIDS_TOTAL).toBe(100)
  })

  it('déclare exactement sept étapes', () => {
    expect(Object.keys(POIDS_ETAPES)).toHaveLength(7)
  })
})

describe('calculerCompletion', () => {
  it('vaut 0 sur un profil vide', () => {
    expect(calculerCompletion({})).toBe(0)
  })

  it('vaut 100 sur un profil entièrement rempli', () => {
    expect(calculerCompletion(PROFIL_COMPLET)).toBe(100)
  })

  it('ignore les chaînes vides et les espaces seuls', () => {
    expect(calculerCompletion({ bio: '   ', prenom: '' })).toBe(0)
  })

  it('ignore les tableaux vides', () => {
    expect(calculerCompletion({ recherche: [], apport: [] })).toBe(0)
  })

  it('additionne les poids des seules étapes remplies', () => {
    expect(calculerCompletion({ domaine: 'saas', recherche: ['associe'] })).toBe(35)
  })
})

describe('étape « nom »', () => {
  it("n'est pas acquise avec le pseudo seul", () => {
    expect(etapesRemplies({ pseudo: 'robin' }).nom).toBe(false)
  })

  it("n'est pas acquise avec le prénom seul", () => {
    expect(etapesRemplies({ prenom: 'Robin' }).nom).toBe(false)
  })

  it('est acquise avec les deux', () => {
    expect(etapesRemplies({ prenom: 'Robin', pseudo: 'robin' }).nom).toBe(true)
  })
})

describe('profilComplet', () => {
  it("est faux tant qu'il manque la photo", () => {
    expect(profilComplet({ ...PROFIL_COMPLET, photo_url: null })).toBe(false)
  })

  it('est vrai quand tout est rempli', () => {
    expect(profilComplet(PROFIL_COMPLET)).toBe(true)
  })
})

describe('premiereEtapeManquante', () => {
  it("renvoie la première étape non remplie dans l'ordre du parcours", () => {
    expect(premiereEtapeManquante({ domaine: 'saas' })).toBe('arrivee')
  })

  it('renvoie null sur un profil complet', () => {
    expect(premiereEtapeManquante(PROFIL_COMPLET)).toBeNull()
  })
})
