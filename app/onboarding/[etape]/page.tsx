import { monProfil } from '@/dal/profil'
import { utilisateurCourant } from '@/dal/utilisateur'
import { CadreEtape, ETAPES, FormulaireEtape, etapeParSlug } from '@/features/onboarding'
import { notFound, redirect } from 'next/navigation'

/**
 * Route unique pour les sept écrans.
 *
 * Le contrôle d'accès est fait ici, dans le Server Component, et refait dans
 * la DAL et dans chaque Server Action — pas dans le middleware.
 */

export function generateStaticParams() {
  return ETAPES.map((e) => ({ etape: e.slug }))
}

export default async function PageEtape({ params }: { params: Promise<{ etape: string }> }) {
  const { etape: slug } = await params

  const etape = etapeParSlug(slug)
  if (!etape) notFound()

  const utilisateur = await utilisateurCourant()
  if (!utilisateur) redirect(`/connexion?suite=/onboarding/${slug}`)

  const profil = await monProfil()

  // On ne passe au client que les valeurs des champs affichés sur cet écran,
  // pas le DTO complet.
  const valeursInitiales: Record<string, string | readonly string[] | null> =
    etape.slug === 'nom'
      ? { prenom: profil?.prenom ?? null, pseudo: profil?.pseudo ?? null }
      : { [etape.champ]: (profil?.[etape.champ as keyof typeof profil] as never) ?? null }

  return (
    <CadreEtape etape={etape}>
      <FormulaireEtape etape={etape} valeursInitiales={valeursInitiales} />
    </CadreEtape>
  )
}
