import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import './globals.css'

/**
 * Bricolage Grotesque (display) et JetBrains Mono (données chiffrées) sont
 * servies par next/font.
 *
 * General Sans est auto-hébergée : les fichiers variables sont dans
 * public/fonts et déclarées en @font-face dans globals.css. On ne dépend plus
 * du CDN Fontshare — une requête tierce de moins, et la typo ne peut pas
 * disparaître si le CDN tombe.
 */
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--police-display',
  display: 'swap',
})

const donnees = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--police-donnees',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Lurnly — le réseau des entrepreneurs francophones',
  description:
    "Communautés par domaine, profil entrepreneur, chiffre d'affaires vérifié, mise en relation. Aucune formation vendue.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F7FA' },
    { media: '(prefers-color-scheme: dark)', color: '#100C08' },
  ],
}

export default function RacineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${donnees.variable}`}>
      <body>{children}</body>
    </html>
  )
}
