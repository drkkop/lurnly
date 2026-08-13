import { Hero } from '@/features/landing/components/Hero'
import { SectionSalon } from '@/features/landing/components/SectionSalon'

/**
 * Landing.
 *
 * Deux sections codées à partir de Figma (fichier hdo9Pn9hVuNpeaKVpeUVz8) :
 * le hero et « Voilà à quoi Lurnly ressemble ». Les sections Communautés,
 * Vérification, Questions et le pied de page ne sont pas encore dessinées —
 * on ne les invente pas ici.
 */
export default function Accueil() {
  return (
    <>
      <Hero />
      <SectionSalon />
    </>
  )
}
