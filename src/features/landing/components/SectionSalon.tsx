import { LogoLurnly } from '@/components/ui/LogoLurnly'
import Image from 'next/image'

/**
 * Section 2 — « Voilà à quoi Lurnly ressemble » (nœuds Figma 211:211 à 211:245).
 *
 * Elle montre une discussion de salon plutôt que de la décrire. C'est le seul
 * endroit de la landing où le produit est visible avant l'inscription, donc
 * le contenu de la carte est du contenu éditorial, pas du remplissage : il
 * démontre les trois arguments listés à droite.
 */

const ANNOTATIONS = [
  {
    titre: 'On sait à qui on parle',
    corps:
      'Le domaine, le stade, les chiffres quand ils sont vérifiés. Sur Discord, vous répondez à un pseudo.',
  },
  {
    titre: 'Des réponses de gens qui l’ont fait',
    corps:
      'Pas un forum d’inconnus : des entrepreneurs du même secteur, au même stade ou plus loin.',
  },
  {
    titre: 'La relation démarre ici',
    corps:
      'On écrit à quelqu’un après avoir lu ce qu’il pense. Le reste — projets communs, coups de main, associations — vient de là.',
  },
] as const

function Avatar({ src, nom, taille }: { src: string; nom: string; taille: number }) {
  return (
    <Image
      src={src}
      alt={`Photo de profil de ${nom}`}
      width={taille}
      height={taille}
      className="shrink-0 rounded-full object-cover"
      style={{ width: taille, height: taille }}
    />
  )
}

/** Badge « CA vérifié ». Seul endroit du système où le vert apparaît. */
function BadgeVerifie({ montant }: { montant: string }) {
  return (
    <span className="rounded-[var(--radius-badge)] bg-[var(--color-valide-fond)] px-[8px] py-[1px] text-[11.5px] font-medium text-[var(--color-valide)]">
      CA vérifié · {montant}
    </span>
  )
}

export function SectionSalon() {
  return (
    <section
      id="salons"
      className="mx-auto max-w-[var(--largeur-contenu)] px-6 pb-[120px] pt-[140px]"
    >
      <h2 className="flex flex-wrap items-center gap-x-[10px] font-[family-name:var(--font-display)] text-[28px] font-semibold tracking-[-0.9px] text-[var(--texte)] lg:text-[34px]">
        Voilà à quoi <LogoLurnly taille={32} /> ressemble
      </h2>

      <p className="mt-[22px] max-w-[520px] text-[15px] leading-[1.6] text-[var(--texte-2)]">
        Une discussion dans un salon. On pose une vraie question, des gens qui l’ont déjà vécu
        répondent, et la relation démarre là.
      </p>

      <div className="mt-[75px] grid grid-cols-1 gap-[80px] lg:grid-cols-[660px_1fr]">
        {/* ------------------------------------------------------------------
            La carte du salon. Bordure de 1 px + ombre douce : c'est la seule
            surface surélevée de la page, parce que c'est une capture de
            produit posée sur la landing, pas un élément de la landing.
            ------------------------------------------------------------------ */}
        <article className="rounded-[var(--radius-carte)] border border-[var(--filet)] bg-[var(--surface)] p-[31px] shadow-[var(--shadow-carte)]">
          <p className="text-[11.5px] font-medium leading-[1.4] tracking-[0.6px] text-[var(--texte-3)]">
            Salon · Ecom France
          </p>

          <hr className="my-[26px] h-px border-0 bg-[var(--filet)]" />

          <h3 className="max-w-[520px] font-[family-name:var(--font-display)] text-[22px] font-semibold leading-[1.2] tracking-[-0.7px] text-[var(--texte)] lg:text-[25px]">
            Comment vous avez géré votre premier recrutement ?
          </h3>

          <p className="mt-[18px] text-[15px] leading-[1.6] text-[var(--texte-2)]">
            Je suis seule depuis deux ans, je sature. Je ne sais pas si je prends un alternant ou un
            freelance à mi-temps.
          </p>

          <div className="mt-[20px] flex items-center gap-[12px]">
            <Avatar src="/demo/camille.png" nom="Camille" taille={30} />
            <span className="text-[14px] font-medium text-[var(--texte)]">Camille</span>
            <span className="text-[13.5px] text-[var(--texte-3)]">ecom · 2 ans</span>
          </div>

          <hr className="my-[22px] h-px border-0 bg-[var(--filet)]" />

          <p className="text-[13px] font-medium text-[var(--texte-3)]">2 réponses</p>

          <div className="mt-[16px] flex gap-[12px]">
            <Avatar src="/demo/yanis.png" nom="Yanis" taille={32} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-[10px]">
                <span className="text-[14.5px] font-medium text-[var(--texte)]">Yanis</span>
                <BadgeVerifie montant="380 k€" />
              </div>
              <p className="mt-[6px] text-[15px] leading-[1.62] text-[var(--texte-2)]">
                Alternant, sans hésiter. J’ai fait l’inverse et j’ai perdu six mois : le freelance
                part avec le contexte, l’alternant le garde. Prévois surtout du temps de formation,
                c’est là que ça coince.
              </p>
            </div>
          </div>

          <div className="mt-[26px] flex gap-[12px]">
            <Avatar src="/demo/sofia.png" nom="Sofia" taille={32} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-[10px]">
                <span className="text-[14.5px] font-medium text-[var(--texte)]">Sofia</span>
                <span className="text-[13px] text-[var(--texte-3)]">freelance · Lyon</span>
              </div>
              <p className="mt-[6px] text-[15px] leading-[1.62] text-[var(--texte-2)]">
                Je peux te raconter en visio si tu veux, j’ai fait les deux.
              </p>
            </div>
          </div>
        </article>

        {/* Annotations : un filet de 1 px, un titre, deux lignes. Pas de carte,
            pas de puce — elles commentent la capture, elles ne rivalisent pas
            avec elle. */}
        <div className="flex flex-col gap-[60px] lg:max-w-[375px]">
          {ANNOTATIONS.map((note) => (
            <div key={note.titre}>
              <hr className="h-px border-0 bg-[var(--filet)]" />
              <h3 className="mt-[24px] font-[family-name:var(--font-display)] text-[17px] font-semibold text-[var(--texte)]">
                {note.titre}
              </h3>
              <p className="mt-[12px] max-w-[350px] text-[14.5px] leading-[1.6] text-[var(--texte-2)]">
                {note.corps}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
