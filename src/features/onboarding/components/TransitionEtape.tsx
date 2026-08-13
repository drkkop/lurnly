'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

/**
 * Applique l'animation d'entrée d'une étape, orientée selon le sens de
 * navigation.
 *
 * Le sens est déposé dans `sessionStorage` par le formulaire juste avant la
 * navigation, puis relu ici au montage. C'est volontairement rustique : passer
 * par l'URL polluerait les liens partagés et l'historique, et un état React
 * ne survit pas au changement de route.
 *
 * Pourquoi pas l'API View Transitions, que `regles-ia/04` recommande : elle
 * exige de connaître le moment exact où le nouveau rendu est validé, ce que
 * l'App Router de Next n'expose pas de façon fiable. Une animation d'entrée en
 * CSS pur donne le même résultat perçu, sans dépendre de ce timing. À
 * reconsidérer quand Next stabilisera son intégration.
 */

export type SensNavigation = 'avant' | 'arriere'

const CLE = 'lurnly:sens-onboarding'

/** Mémorise le sens juste avant de changer d'étape. */
export function memoriserSens(sens: SensNavigation) {
  try {
    sessionStorage.setItem(CLE, sens)
  } catch {
    // Navigation privée ou stockage refusé : on perd l'orientation, pas la
    // navigation. L'animation retombera simplement sur « avant ».
  }
}

export function TransitionEtape({
  children,
  variante = 'colonne',
}: {
  children: ReactNode
  variante?: 'colonne' | 'gravure'
}) {
  const [sens, setSens] = useState<SensNavigation | null>(null)

  useEffect(() => {
    try {
      setSens(sessionStorage.getItem(CLE) === 'arriere' ? 'arriere' : 'avant')
    } catch {
      setSens('avant')
    }
  }, [])

  // Tant que le sens n'est pas connu (premier rendu serveur), aucune classe
  // d'animation : le contenu s'affiche normalement, sans état intermédiaire
  // invisible — c'est un interdit explicite de `regles-ia/04`.
  const animation =
    sens === null
      ? ''
      : variante === 'gravure'
        ? 'transition-gravure'
        : sens === 'arriere'
          ? 'transition-arriere'
          : 'transition-avant'

  // ⚠️ Une propriété `transform` fait de l'élément un bloc conteneur pour ses
  // descendants absolus. L'enveloppe de la gravure doit donc occuper tout le
  // panneau (`absolute inset-0`), sinon l'image se recale sur une boîte de
  // hauteur nulle pendant les 460 ms de l'animation et saute à la fin.
  const disposition = variante === 'gravure' ? 'absolute inset-0' : 'w-full'

  return <div className={`${disposition} ${animation}`.trim()}>{children}</div>
}
