import { utilisateurCourant } from '@/dal/utilisateur'
import { FormulaireConnexion, cheminSur } from '@/features/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Connexion — Lurnly' }

const ERREURS: Record<string, string> = {
  lien_invalide:
    "Ce lien n'est plus valable — il a peut-être expiré ou déjà servi. Demandez-en un nouveau.",
}

export default async function Connexion({
  searchParams,
}: {
  searchParams: Promise<{ suite?: string; erreur?: string }>
}) {
  const { suite, erreur } = await searchParams
  const destination = cheminSur(suite)

  // Déjà connecté : inutile de repasser par le lien.
  const utilisateur = await utilisateurCourant()
  if (utilisateur) redirect(destination)

  const messageErreur = erreur ? ERREURS[erreur] : undefined

  return (
    <main
      id="contenu"
      className="mx-auto flex min-h-dvh max-w-[440px] flex-col justify-center gap-10 px-6"
    >
      <header className="flex flex-col gap-3">
        <h1 className="font-[var(--font-display)] text-[36px] leading-[1.1] tracking-[-0.03em]">
          Entrez dans le réseau
        </h1>
        <p className="text-[15px] opacity-56">
          Une adresse suffit. Vous complétez votre profil juste après.
        </p>
      </header>

      {messageErreur ? (
        <p role="alert" className="filet rounded-[var(--radius-panneau)] p-4 text-[14px]">
          {messageErreur}
        </p>
      ) : null}

      <FormulaireConnexion suite={destination} />

      <p className="text-[13px] opacity-40">
        <Link href="/" className="underline underline-offset-4">
          Retour à l'accueil
        </Link>
      </p>
    </main>
  )
}
