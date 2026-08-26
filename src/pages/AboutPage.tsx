import { Link } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { CHARACTERS } from '../data/characters';
import { POIDS } from '../lib/constants';
import { TEMPERATURE_BANDS, TEMPERATURE_RANGE_LABELS } from '../lib/temperature';

const STEPS = [
  {
    n: '1',
    titre: 'Propose un personnage',
    texte: "N'importe lequel. La recherche te propose les personnages de la base avec leur anime d'origine.",
  },
  {
    n: '2',
    titre: 'Lis ta température',
    texte: 'Chaque essai reçoit un score de 0 à 100 %. Plus la proposition ressemble au personnage du jour, plus tu chauffes.',
  },
  {
    n: '3',
    titre: 'Recoupe et resserre',
    texte: "Le tableau se retrie du plus chaud au plus froid. Un jeton d'analyse se débloque tous les trois essais : dépense-le sur l'essai de ton choix pour voir le détail du calcul.",
  },
];

// Bandes triées Glacial → Trouvé ! (ordre croissant), pour l'affichage en
// bandeau gauche→droite façon thermomètre — TEMPERATURE_BANDS est trié
// décroissant (utilisé ailleurs pour trouver la bande d'un score par ordre).
const STRIP_BANDS = [...TEMPERATURE_BANDS].reverse();

export default function AboutPage() {
  const animeCount = new Set(CHARACTERS.map((c) => c.animeSource)).size;
  const openModal = useGameStore((s) => s.openModal);

  return (
    <main className="w-full">
      {/* HERO — reprend le design "Page A propos" (Claude Design) : tag rotatif,
          titre géant mi-plein mi-contour, mascotte, CTA unique. Le lien Contact
          n'est pas dupliqué ici : il reste accessible depuis le Menu (le site
          n'a pas de footer pour cette même raison). */}
      <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-20 h-[260px] w-[260px] -rotate-[9deg] bg-[#54218E] sm:-left-16 sm:-top-24 sm:h-[460px] sm:w-[460px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-[240px] h-[200px] w-[200px] rotate-[14deg] bg-[#9966CC] opacity-90 sm:-right-24 sm:top-auto sm:bottom-[-120px] sm:h-[340px] sm:w-[340px]"
        />

        <div className="relative mx-auto flex max-w-[960px] flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left">
          <div className="min-w-0 sm:flex-1">
            <span className="inline-block -rotate-2 bg-brand px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[.18em] text-ink shadow-[6px_6px_0_#0B0B16] sm:text-[14px] sm:shadow-[8px_8px_0_#0B0B16]">
              Le jeu quotidien INKU
            </span>
            <h1 className="mt-5 font-display text-[44px] font-bold uppercase leading-[.86] tracking-[-.03em] text-brand sm:mt-6 sm:text-[84px]">
              <span className="block">Devine</span>
              <span className="block text-transparent [-webkit-text-stroke:2px_#FF5FB3] sm:[-webkit-text-stroke:3px_#FF5FB3]">
                le perso
              </span>
              <span className="block text-white">du jour</span>
            </h1>
            <p className="mt-4 font-display text-[13px] font-bold tracking-[.08em] text-brand sm:mt-5 sm:text-[17px]">
              {CHARACTERS.length} persos <span className="text-[#9966CC]">/</span> {animeCount} œuvres{' '}
              <span className="text-[#9966CC]">/</span> 1 par jour
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-touch items-center justify-center bg-brand px-8 font-display text-[18px] font-bold text-ink shadow-[7px_7px_0_#0B0B16] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#0B0B16] active:translate-x-[7px] active:translate-y-[7px] active:shadow-none sm:mt-7 sm:text-[22px] sm:shadow-[10px_10px_0_#0B0B16] sm:hover:shadow-[12px_12px_0_#0B0B16]"
            >
              Jouer maintenant
            </Link>
            <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-[1.5] text-muted sm:mx-0 sm:mt-5 sm:text-[15px]">
              Un perso par jour, le même pour toute la communauté. Essais illimités, zéro inscription.
            </p>
          </div>
          <img
            src="/assets/mascot-inku.png"
            alt=""
            className="relative hidden w-[300px] flex-none drop-shadow-[13px_13px_0_#0B0B16] sm:block"
          />
        </div>
      </section>

      <div className="relative mx-4 h-[6px] -rotate-1 bg-brand shadow-[6px_6px_0_#0B0B16] sm:mx-8" />

      {/* COMMENT ÇA MARCHE — cartes empilées sur mobile, "cascade" en grille
          qui se chevauche sur desktop (même motif que les mockups). */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-16 h-[240px] w-[240px] -rotate-[9deg] bg-[#54218E] sm:h-[420px] sm:w-[420px]"
        />

        <div className="relative mx-auto max-w-[960px]">
          <span className="inline-block -rotate-2 bg-brand px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[.18em] text-ink shadow-[6px_6px_0_#0B0B16] sm:text-[14px] sm:shadow-[8px_8px_0_#0B0B16]">
            3 étapes · 1 perso par jour
          </span>
          <h2 className="mt-5 font-display text-[36px] font-bold uppercase leading-[.88] tracking-[-.03em] text-white sm:mt-6 sm:text-[68px]">
            Comment
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_#B88AE8] sm:[-webkit-text-stroke:3px_#B88AE8]">
              ça marche
            </span>
          </h2>
          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.4] text-muted sm:mt-5 sm:text-[19px]">
            Trois minutes pour comprendre, des semaines pour décrocher.
          </p>

          <div className="relative mt-9 flex flex-col gap-7 sm:mt-16 sm:gap-9">
            <div className="relative -rotate-1 border-4 border-brand bg-ink px-5 pb-6 pt-[58px] shadow-[9px_9px_0_#0B0B16] sm:-rotate-[.8deg] sm:border-[5px] sm:px-10 sm:pb-8 sm:pt-[86px] sm:shadow-[12px_12px_0_#0B0B16]">
              <span className="absolute left-4 top-3 font-display text-[42px] font-bold leading-none text-brand sm:left-6 sm:top-4 sm:text-[68px]">
                {STEPS[0].n}
              </span>
              <div className="flex items-center justify-between gap-4 sm:gap-8">
                <div className="min-w-0 sm:pr-[150px]">
                  <h3 className="font-display text-[20px] font-bold leading-tight text-brand sm:text-[28px]">
                    {STEPS[0].titre}
                  </h3>
                  <p className="mt-2.5 max-w-[560px] text-[14px] leading-[1.45] text-muted sm:mt-3 sm:text-[17px]">
                    {STEPS[0].texte}
                  </p>
                </div>
                <img
                  src="/assets/mascotte/MASCOTTE_INKU-03.png"
                  alt=""
                  className="h-20 w-auto flex-none sm:absolute sm:right-10 sm:top-1/2 sm:h-32 sm:-translate-y-1/2"
                />
              </div>
            </div>

            <div className="relative rotate-1 border-4 border-brand bg-[#54218E] px-5 pb-6 pt-[50px] text-right shadow-[9px_9px_0_#0B0B16] sm:rotate-[.7deg] sm:border-[5px] sm:px-10 sm:pb-8 sm:pt-[86px] sm:shadow-[12px_12px_0_#0B0B16]">
              <span className="absolute right-4 top-3 font-display text-[42px] font-bold leading-none text-brand sm:right-6 sm:top-4 sm:text-[68px]">
                {STEPS[1].n}
              </span>
              <div className="flex items-center justify-between gap-4 sm:gap-8">
                <img
                  src="/assets/mascotte/MASCOTTE_INKU-11.png"
                  alt=""
                  className="h-20 w-auto flex-none sm:absolute sm:left-10 sm:top-1/2 sm:h-32 sm:-translate-y-1/2"
                />
                <div className="min-w-0 flex-1 sm:pl-[150px]">
                  <h3 className="font-display text-[20px] font-bold leading-tight text-white sm:text-[28px]">
                    {STEPS[1].titre}
                  </h3>
                  <p className="ml-auto mt-2.5 max-w-[560px] text-[14px] leading-[1.45] text-white sm:mt-3 sm:text-[17px]">
                    {STEPS[1].texte}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative -rotate-1 border-4 border-ink bg-brand px-5 pb-6 pt-[50px] shadow-[9px_9px_0_#0B0B16] sm:-rotate-[.6deg] sm:border-[5px] sm:px-10 sm:pb-8 sm:pt-[86px] sm:shadow-[12px_12px_0_#0B0B16]">
              <span className="absolute left-4 top-3 font-display text-[42px] font-bold leading-none text-ink sm:left-6 sm:top-4 sm:text-[68px]">
                {STEPS[2].n}
              </span>
              <div className="flex items-center justify-between gap-4 sm:gap-8">
                <div className="min-w-0 sm:pr-[150px]">
                  <h3 className="font-display text-[20px] font-bold leading-tight text-ink sm:text-[28px]">
                    {STEPS[2].titre}
                  </h3>
                  <p className="mt-2.5 max-w-[560px] text-[14px] font-semibold leading-[1.45] text-ink sm:mt-3 sm:text-[17px]">
                    {STEPS[2].texte}
                  </p>
                </div>
                <img
                  src="/assets/mascotte/mascotte-inku.png"
                  alt=""
                  className="h-20 w-auto flex-none sm:absolute sm:right-10 sm:top-1/2 sm:h-32 sm:-translate-y-1/2"
                />
              </div>
            </div>
          </div>

          <h2 className="relative mt-16 font-display text-[30px] font-bold uppercase leading-[.9] tracking-[-.03em] text-white sm:mt-24 sm:text-[54px]">
            La température
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_#9966CC] sm:[-webkit-text-stroke:3px_#9966CC]">
              de tes essais
            </span>
          </h2>

          <div className="relative mt-6 -rotate-[.6deg] border-4 border-ink bg-ink shadow-[9px_9px_0_#0B0B16] sm:mt-9 sm:border-[5px] sm:shadow-[18px_18px_0_#0B0B16]">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              {STRIP_BANDS.map((band) => (
                <div
                  key={band.min}
                  className="flex items-center justify-between gap-2 border-b-4 border-ink px-4 py-3 last:border-b-0 sm:flex-1 sm:flex-col sm:items-start sm:justify-end sm:gap-1.5 sm:border-b-0 sm:border-r-[5px] sm:px-4 sm:py-5 sm:last:border-r-0"
                  style={{ background: band.bg, color: band.fgDark }}
                >
                  <span className="font-display text-[16px] font-bold sm:text-[21px]">{band.label}</span>
                  <span className="font-display text-[12px] font-bold tracking-[.1em] sm:text-[14px]">
                    {TEMPERATURE_RANGE_LABELS[band.min]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3.5 flex justify-between font-display text-[11px] font-bold tracking-[.14em] text-muted sm:mt-5 sm:text-[13px]">
            <span>← Tu t'éloignes</span>
            <span className="text-success">Tu chauffes →</span>
          </div>

          <div className="relative mt-9 flex flex-col items-start sm:mt-16 sm:flex-row sm:items-stretch">
            <div className="flex flex-none flex-col items-center justify-center self-center border-4 border-[#9966CC] bg-ink px-4 py-3.5 text-center shadow-[7px_7px_0_#0B0B16] sm:self-auto sm:border-[5px] sm:px-5 sm:py-5 sm:shadow-none">
              <span className="block font-display text-[28px] font-bold leading-none text-brand sm:text-[48px]">8</span>
              <span className="font-display text-[11px] font-bold tracking-[.12em] text-[#9966CC] sm:text-[13px]">
                Critères
              </span>
            </div>
            <p className="mt-3.5 max-w-[600px] border-y-4 border-[#54218E] bg-bg px-0 py-3.5 text-[14px] leading-[1.5] text-muted sm:mt-0 sm:pl-11 sm:pr-6 sm:py-5 sm:text-[16px]">
              Huit critères entrent dans le calcul même anime ({POIDS.anime} pts), rôle narratif, camp moral, race,
              type de pouvoir, décennie de sortie, genre et couleur de cheveux. Les catégories voisines rapportent des
              points partiels. Le détail complet est dans la modale «{' '}
              <button
                type="button"
                onClick={() => openModal('rules')}
                className="font-semibold text-brand hover:underline"
              >
                Comment jouer
              </button>{' '}
              » du jeu.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
