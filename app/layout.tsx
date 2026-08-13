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
  // Base des URL absolues (Open Graph, canoniques). Sans elle, Next émet un
  // avertissement à chaque build et les partages sociaux pointent nulle part.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Lurnly — le réseau des entrepreneurs francophones',
  description:
    "Communautés par domaine, profil entrepreneur, chiffre d'affaires vérifié, mise en relation. Aucune formation vendue.",
  openGraph: {
    title: 'Lurnly — le réseau des entrepreneurs francophones',
    description:
      "Communautés par domaine, profil entrepreneur, chiffre d'affaires vérifié, mise en relation.",
    locale: 'fr_FR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  // Une seule couleur : le mode sombre est désactivé (voir globals.css).
  // L'entrée sombre peignait la barre du navigateur en encre au-dessus d'une
  // page restée claire sur les téléphones réglés en sombre.
  themeColor: '#F8F7FA',
}

export default function RacineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${donnees.variable}`}>
      <body>
        {/* React 19 hisse ce <link> dans le <head>. General Sans est déclarée
            en @font-face dans le CSS : sans préchargement, le navigateur ne la
            découvre qu'après avoir analysé la feuille de style, et tout le
            corps de texte s'affiche d'abord dans la police de secours. */}
        <link
          rel="preload"
          href="/fonts/GeneralSans-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Premier élément focusable de chaque page : la navigation au
            clavier saute directement au contenu. */}
        <a href="#contenu" className="lien-evitement">
          Aller au contenu
        </a>

        {children}
      </body>
    </html>
  )
}
