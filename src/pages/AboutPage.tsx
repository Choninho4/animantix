import { Link } from 'react-router-dom';
import { CHARACTERS } from '../data/characters';
import { POIDS } from '../lib/constants';
import { TEMPERATURE_BANDS, TEMPERATURE_RANGE_LABELS } from '../lib/temperature';
import { TemperatureBandIcon } from '../components/icons/Icon';
import { SiteHeader } from '../components/site/SiteHeader';
import { SiteFooter } from '../components/site/SiteFooter';

// Date de mise en ligne réelle du site (premier commit) : sert de base au
// compteur "jours de jeu" ci-dessous.
const LAUNCH_DATE = new Date('2026-08-10T00:00:00Z');

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
    texte: 'Le tableau se retrie du plus chaud au plus froid. Un indice se débloque tous les cinq essais si tu bloques.',
  },
];

function daysSinceLaunch(): number {
  return Math.max(1, Math.floor((Date.now() - LAUNCH_DATE.getTime()) / 86_400_000));
}

export default function AboutPage() {
  const animeCount = new Set(CHARACTERS.map((c) => c.animeSource)).size;
  const stats = [
    { key: 'p', valeur: CHARACTERS.length, label: 'personnages', detail: 'dans la base, et ça grandit' },
    { key: 'a', valeur: animeCount, label: 'œuvres couvertes', detail: 'du shonen au seinen' },
    { key: 'j', valeur: daysSinceLaunch(), label: 'jours de jeu', detail: 'depuis le lancement' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[960px] flex-1 px-4">
        <section className="flex flex-wrap items-center gap-10 py-14 sm:py-16">
          <div className="min-w-0 max-w-[620px] flex-1">
            <span className="mb-5 inline-block rounded-pill bg-surface px-3 py-1.5 text-[12px] font-bold text-brand-dark">
              Le jeu quotidien INKU
            </span>
            <h1 className="mb-5 font-display text-[36px] font-bold leading-[1.1] text-brand sm:text-[52px]">
              Un personnage d'anime mystère à deviner, chaque jour.
            </h1>
            <p className="mb-7 text-[17px] leading-[1.6] text-muted sm:text-[18px]">
              Un seul personnage par jour, le même pour toute la communauté. Tu proposes d'autres
              personnages, et chaque essai te dit à quel point tu chauffes. Essais illimités, zéro
              inscription.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="flex min-h-touch items-center rounded-control bg-brand px-6 font-display text-[16px] font-bold text-white active:scale-[.98]"
              >
                Jouer maintenant
              </Link>
              <Link
                to="/contact"
                className="flex min-h-touch items-center rounded-control border-2 border-brand px-6 font-display text-[16px] font-bold text-brand"
              >
                Nous écrire
              </Link>
            </div>
          </div>
          <img src="/assets/mascot-inku.png" alt="" className="h-auto w-[180px] flex-none sm:w-[220px]" />
        </section>

        <section className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.key}
              className="rounded-card border border-border bg-surface p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-1.5 font-display text-[30px] font-bold leading-[1.1] text-brand sm:text-[34px]">
                {s.valeur}
              </div>
              <div className="text-[14px] font-semibold text-text">{s.label}</div>
              <div className="mt-0.5 text-[12px] text-muted">{s.detail}</div>
            </div>
          ))}
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-display text-[28px] font-bold leading-[1.2] text-brand-dark sm:text-[36px]">
            Comment ça marche
          </h2>
          <p className="mb-7 max-w-[560px] text-[16px] text-muted">
            Trois minutes pour comprendre, des semaines pour décrocher.
          </p>
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map((e) => (
              <div key={e.n} className="rounded-card border border-border bg-surface p-6">
                <div className="mb-3.5 flex h-8 w-8 items-center justify-center rounded-control bg-bg font-display text-[15px] font-bold text-brand">
                  {e.n}
                </div>
                <h3 className="mb-2 font-display text-[20px] font-bold leading-[1.25] text-brand-mid">{e.titre}</h3>
                <p className="text-[14px] leading-[1.6] text-muted">{e.texte}</p>
              </div>
            ))}
          </div>
          <div className="rounded-card bg-surface p-6">
            <div className="mb-4 text-[12px] font-bold uppercase tracking-[.10em] text-muted">
              La température de tes essais
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TEMPERATURE_BANDS.map((band) => (
                <span
                  key={band.min}
                  className="flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-[13px] font-bold"
                  style={{ background: band.bg, color: band.fg }}
                >
                  <TemperatureBandIcon icon={band.icon} size={13} />
                  {band.label}
                  <span className="font-semibold opacity-70">{TEMPERATURE_RANGE_LABELS[band.min]}</span>
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-[640px] text-[14px] leading-[1.6] text-muted">
              Neuf critères entrent dans le calcul — même anime ({POIDS.anime} pts), rôle narratif,
              camp moral, tranche d'âge, race, type de pouvoir, genre, décennie de sortie et couleur
              de cheveux. Les catégories voisines rapportent des points partiels. Le détail complet
              est dans la modale « Comment jouer » du jeu.
            </p>
          </div>
        </section>

        <section
          className="mb-14 rounded-card px-8 py-12 text-center"
          style={{ background: 'linear-gradient(120deg, #D02886 0%, #9966CC 100%)' }}
        >
          <h2 className="mx-auto mb-3 max-w-[480px] font-display text-[28px] font-bold leading-[1.15] text-white sm:text-[38px]">
            Le personnage du jour t'attend
          </h2>
          <p className="mx-auto mb-7 max-w-[440px] text-[16px] leading-[1.55] text-white/90 sm:text-[17px]">
            Nouveau personnage à minuit. Essais illimités, aucune inscription.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-touch items-center rounded-control bg-white px-8 font-display text-[16px] font-bold text-brand active:scale-[.98] sm:text-[17px]"
          >
            Jouer maintenant
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
