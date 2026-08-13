import { describe, expect, it } from 'vitest'
import { DESTINATION_PAR_DEFAUT, cheminSur } from '../redirection'
import { schemaDemandeLien } from '../schemas'

describe('cheminSur — protection contre la redirection ouverte', () => {
  it('accepte un chemin interne', () => {
    expect(cheminSur('/onboarding/nom')).toBe('/onboarding/nom')
  })

  it('accepte un chemin interne avec paramètres', () => {
    expect(cheminSur('/onboarding/nom?reprise=1')).toBe('/onboarding/nom?reprise=1')
  })

  it('retombe sur la valeur par défaut si absent', () => {
    expect(cheminSur(null)).toBe(DESTINATION_PAR_DEFAUT)
    expect(cheminSur(undefined)).toBe(DESTINATION_PAR_DEFAUT)
    expect(cheminSur('')).toBe(DESTINATION_PAR_DEFAUT)
  })

  it('refuse une URL absolue', () => {
    expect(cheminSur('https://site-pirate.fr')).toBe(DESTINATION_PAR_DEFAUT)
    expect(cheminSur('http://site-pirate.fr')).toBe(DESTINATION_PAR_DEFAUT)
  })

  it('refuse une URL protocole-relative — le piège classique', () => {
    expect(cheminSur('//site-pirate.fr')).toBe(DESTINATION_PAR_DEFAUT)
  })

  it('refuse la variante à barre inversée que certains navigateurs normalisent', () => {
    expect(cheminSur('/\\site-pirate.fr')).toBe(DESTINATION_PAR_DEFAUT)
  })

  it('refuse un schéma javascript glissé dans le chemin', () => {
    expect(cheminSur('/javascript:alert(1)')).toBe(DESTINATION_PAR_DEFAUT)
  })

  it("refuse les retours à la ligne (injection d'en-têtes)", () => {
    expect(cheminSur('/ok\r\nSet-Cookie: a=b')).toBe(DESTINATION_PAR_DEFAUT)
  })
})

describe('schemaDemandeLien', () => {
  it('normalise la casse et les espaces', () => {
    const r = schemaDemandeLien.parse({ email: '  Robin@Exemple.FR ' })
    expect(r.email).toBe('robin@exemple.fr')
  })

  it('refuse une adresse malformée', () => {
    expect(schemaDemandeLien.safeParse({ email: 'robin@' }).success).toBe(false)
    expect(schemaDemandeLien.safeParse({ email: 'robin' }).success).toBe(false)
  })

  it('refuse le vide', () => {
    expect(schemaDemandeLien.safeParse({ email: '' }).success).toBe(false)
  })
})
