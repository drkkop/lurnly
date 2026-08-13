import Link from 'next/link'

/**
 * Accueil provisoire. La landing (hero + section 2 + neutralité) est dessinée
 * dans Figma et sera codée à l'étape 4 de l'ordre de travail.
 */
export default function Accueil() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[var(--largeur-contenu)] flex-col justify-center gap-8 px-6">
      <h1 className="font-[var(--font-display)] text-[48px] leading-[1.05] tracking-[-0.9px]">
        Lurnly
      </h1>
      <p className="max-w-[46ch] text-[17px] opacity-72">
        Le réseau des entrepreneurs francophones. On y discute, on demande conseil, on trouve des
        prestataires, on monte des projets.
      </p>
      <div>
        <Link
          href="/onboarding/domaine"
          className="inline-block rounded-[var(--radius-bouton)] bg-[var(--texte)] px-5 py-3 text-[15px] font-medium text-[var(--fond)]"
        >
          Commencer
        </Link>
      </div>
    </main>
  )
}
