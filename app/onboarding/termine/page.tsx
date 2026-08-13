import { monProfil } from '@/dal/profil'
import Link from 'next/link'

/**
 * Écran de fin — provisoire.
 *
 * L'écran définitif dépend de la carte de profil partageable, qui n'est pas
 * dessinée. Trois variantes avaient été construites autour d'une carte
 * inventée puis supprimées : construire la fin du funnel avant la page profil
 * était à l'envers. On ne recommence pas.
 */
export default async function Termine() {
  const profil = await monProfil()

  return (
    <main
      id="contenu"
      className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center gap-6 px-6"
    >
      <h1 className="font-[var(--font-display)] text-[40px] leading-[1.1] tracking-[-0.03em]">
        Votre place est réservée.
      </h1>
      <p className="text-[16px] opacity-72">On vous écrit dès que la première vague ouvre.</p>
      <p className="font-[var(--font-donnees)] text-[13px] opacity-40">
        Profil complété à {profil?.completion ?? 0} %
      </p>
      <div>
        <Link href="/" className="text-[15px] underline underline-offset-4 opacity-72">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
