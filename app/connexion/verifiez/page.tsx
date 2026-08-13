import Link from 'next/link'

export const metadata = { title: 'Vérifiez vos emails — Lurnly' }

/**
 * Écran d'attente après l'envoi du lien.
 *
 * On répète l'adresse saisie : c'est le moment où l'on découvre sa faute de
 * frappe, pas trois minutes plus tard devant une boîte vide.
 */
export default async function Verifiez({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <main className="mx-auto flex min-h-dvh max-w-[440px] flex-col justify-center gap-6 px-6">
      <h1 className="font-[var(--font-display)] text-[36px] leading-[1.1] tracking-[-0.9px]">
        Regardez vos emails
      </h1>

      <p className="text-[16px] opacity-72">
        {email ? (
          <>
            Un lien vient de partir vers{' '}
            <span className="font-[var(--font-donnees)] text-[15px]">{email}</span>. Cliquez dessus
            et vous y êtes.
          </>
        ) : (
          <>Un lien vient de partir. Cliquez dessus et vous y êtes.</>
        )}
      </p>

      <p className="text-[14px] opacity-56">
        Rien dans les cinq minutes ? Regardez vos indésirables, puis redemandez un lien.
      </p>

      <p className="text-[13px] opacity-40">
        <Link href="/connexion" className="underline underline-offset-4">
          Utiliser une autre adresse
        </Link>
      </p>
    </main>
  )
}
