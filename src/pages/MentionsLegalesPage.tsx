import type { ReactNode } from 'react';

interface Section {
  id: string;
  titre: string;
}

const SOMMAIRE: Section[] = [
  { id: 'editeur', titre: 'Éditeur du site' },
  { id: 'publication', titre: 'Directeur de la publication' },
  { id: 'hebergement', titre: 'Hébergement' },
  { id: 'propriete', titre: 'Propriété intellectuelle' },
  { id: 'donnees', titre: 'Données et cookies' },
  { id: 'responsabilite', titre: 'Limitation de responsabilité' },
  { id: 'droit', titre: 'Droit applicable' },
  { id: 'a-completer', titre: 'Champs à compléter' },
];

const A_COMPLETER: Array<{ section: string; champ: string }> = [
  { section: '1', champ: 'URL définitive du site' },
  { section: '1', champ: "Nom ou raison sociale de l'éditeur" },
  { section: '1', champ: 'Statut juridique (particulier, auto-entrepreneur, société)' },
  { section: '1', champ: 'N° SIREN/SIRET et n° de TVA si professionnel' },
  { section: '1', champ: "Adresse complète (ou substitution par l'hébergeur si particulier)" },
  { section: '1', champ: 'Email de contact, téléphone facultatif' },
  { section: '2', champ: 'Nom du directeur de la publication' },
  { section: '5', champ: 'Durée de conservation des messages de contact' },
  { section: '5', champ: "Responsable de traitement et prestataire d'envoi des formulaires" },
  { section: '5', champ: '« Gérer mes cookies » relié au bandeau de consentement' },
  { section: '—', champ: 'Date de dernière mise à jour de la page' },
];

function SectionHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="mb-3.5 font-display text-[22px] font-bold leading-[1.25] text-brand-mid">
      {n}. {children}
    </h2>
  );
}

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto flex w-full max-w-[960px] flex-wrap items-start gap-10 px-4 py-12">
      {/* sticky uniquement à partir de sm : en dessous, le sommaire est empilé
          en pleine largeur au-dessus de l'article — le rendre sticky à cette
          largeur le fait "coller" en haut d'écran pendant le scroll et
          chevaucher le texte de l'article qui défile dessous. */}
      <aside className="w-full flex-none sm:sticky sm:top-[76px] sm:w-[200px]">
        <div className="mb-3 text-[12px] font-bold uppercase tracking-[.10em] text-muted">Sommaire</div>
        <nav className="flex flex-col gap-0.5">
          {SOMMAIRE.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-control px-2.5 py-2 text-[13px] leading-[1.4] text-muted hover:bg-surface hover:text-brand"
            >
              {i + 1}. {s.titre}
            </a>
          ))}
        </nav>
      </aside>

      <article className="min-w-0 max-w-[660px] flex-1">
        <h1 className="mb-2.5 font-display text-[32px] font-bold leading-[1.15] text-brand-dark sm:text-[40px]">
          Mentions légales
        </h1>
        <p className="mb-6 text-[13px] text-muted">Dernière mise à jour : [DATE DE MISE À JOUR]</p>

        <div className="mb-9 border-[3px] border-ink bg-brand-mid/10 px-4.5 py-4 shadow-[5px_5px_0_#9966CC]">
          <p className="text-[14px] leading-[1.6] text-text">
            <strong>Avis au propriétaire du site :</strong> tous les éléments entre crochets sont des
            champs à compléter. Aucune information légale ne doit rester sous forme de placeholder
            sur le site publié — l'absence de mentions légales exactes est sanctionnée par la loi
            française.
          </p>
        </div>

        <section id="editeur" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={1}>Éditeur du site</SectionHeading>
          <p className="mb-4 text-[15px] leading-[1.7] text-text">
            Le site Animantix, accessible à l'adresse <strong>[URL DU SITE]</strong>, est édité par :
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[14px] leading-[1.6]">
            <dt className="font-semibold text-muted">Nom / raison sociale</dt>
            <dd className="m-0 text-text">[NOM DE L'ÉDITEUR OU RAISON SOCIALE]</dd>
            <dt className="font-semibold text-muted">Statut juridique</dt>
            <dd className="m-0 text-text">[PARTICULIER / AUTO-ENTREPRENEUR / SASU / SARL — préciser]</dd>
            <dt className="font-semibold text-muted">Immatriculation</dt>
            <dd className="m-0 text-text">[N° SIREN/SIRET — à supprimer si éditeur particulier non professionnel]</dd>
            <dt className="font-semibold text-muted">Siège / adresse</dt>
            <dd className="m-0 text-text">[ADRESSE COMPLÈTE — n°, rue, code postal, ville, pays]</dd>
            <dt className="font-semibold text-muted">Email de contact</dt>
            <dd className="m-0 text-text">[contact@animantix.fr]</dd>
            <dt className="font-semibold text-muted">Téléphone</dt>
            <dd className="m-0 text-text">[NUMÉRO — facultatif]</dd>
            <dt className="font-semibold text-muted">TVA intracommunautaire</dt>
            <dd className="m-0 text-text">[N° TVA — si assujetti]</dd>
          </dl>
          <p className="mt-4 text-[13px] leading-[1.6] text-muted">
            Si le site est édité par un particulier à titre non professionnel, l'adresse personnelle
            peut être remplacée par le nom et les coordonnées de l'hébergeur, conformément à
            l'article 6 III-2 de la loi n° 2004-575 du 21 juin 2004 (LCEN).
          </p>
        </section>

        <section id="publication" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={2}>Directeur de la publication</SectionHeading>
          <p className="text-[15px] leading-[1.7] text-text">
            <strong>[NOM DU DIRECTEUR DE LA PUBLICATION]</strong>, joignable à l'adresse{' '}
            <strong>[contact@animantix.fr]</strong>.
          </p>
        </section>

        <section id="hebergement" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={3}>Hébergement</SectionHeading>
          <p className="mb-3 text-[15px] leading-[1.7] text-text">Le site est hébergé par :</p>
          <div className="rounded-card bg-surface px-5 py-4.5 text-[14px] leading-[1.7] text-text">
            <strong>Vercel Inc.</strong>
            <br />
            340 S Lemon Ave #4133
            <br />
            Walnut, CA 91789
            <br />
            États-Unis
            <br />
            <a href="https://vercel.com" target="_blank" rel="noopener" className="text-brand underline hover:text-brand-dark">
              vercel.com
            </a>
          </div>
        </section>

        <section id="propriete" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={4}>Propriété intellectuelle</SectionHeading>
          <p className="mb-3.5 text-[15px] leading-[1.7] text-text">
            La structure du site, son code source, son identité visuelle, ses textes rédactionnels
            ainsi que le concept et les règles du jeu sont la propriété exclusive de l'éditeur. Toute
            reproduction, représentation, adaptation ou exploitation, totale ou partielle, par
            quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans
            autorisation écrite préalable.
          </p>
          <p className="mb-3.5 text-[15px] leading-[1.7] text-text">
            Les noms de personnages, titres d'œuvres et références aux séries d'animation cités sur
            ce site demeurent la propriété de leurs auteurs, éditeurs, studios et ayants droit
            respectifs. Ils sont mentionnés à titre purement informatif et référentiel, dans le cadre
            du fonctionnement du jeu, et ne sont accompagnés d'aucune reproduction d'illustration, de
            séquence ou d'élément graphique issu de ces œuvres.
          </p>
          <p className="text-[15px] leading-[1.7] text-text">
            Animantix n'est affilié à aucun studio, éditeur ou distributeur d'animation japonaise, et
            n'est ni sponsorisé ni approuvé par eux. Tout ayant droit souhaitant demander le retrait
            d'une mention peut écrire à <strong>[contact@animantix.fr]</strong> ; la demande sera
            traitée dans les meilleurs délais.
          </p>
        </section>

        <section id="donnees" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={5}>Données personnelles et cookies</SectionHeading>
          <h3 className="mb-2 font-display text-[16px] font-bold text-brand-dark">Données de jeu</h3>
          <p className="mb-4 text-[15px] leading-[1.7] text-text">
            La progression du joueur (essais du jour, statistiques, série de victoires) est
            enregistrée exclusivement dans le stockage local du navigateur (<em>localStorage</em>).
            Ces informations ne sont ni transmises à l'éditeur ni à un tiers, et peuvent être
            effacées à tout moment en vidant les données du site depuis les réglages du navigateur.
          </p>
          <h3 className="mb-2 font-display text-[16px] font-bold text-brand-dark">Formulaires de contact</h3>
          <p className="mb-4 text-[15px] leading-[1.7] text-text">
            Les données saisies dans les formulaires de contact (nom, email, entreprise, message)
            sont utilisées uniquement pour traiter la demande et conservées{' '}
            <strong>[DURÉE DE CONSERVATION, ex. 12 mois]</strong>. Elles sont traitées par{' '}
            <strong>[NOM DU RESPONSABLE DE TRAITEMENT]</strong> et transmises, le cas échéant, au
            prestataire d'envoi <strong>[NOM DU SERVICE, ex. Formspree / Resend]</strong>.
            Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, d'effacement, de
            limitation et d'opposition, exerçable à <strong>[contact@animantix.fr]</strong>. Une
            réclamation peut être adressée à la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-brand underline hover:text-brand-dark">
              cnil.fr
            </a>
            ).
          </p>
          <h3 className="mb-2 font-display text-[16px] font-bold text-brand-dark">Cookies publicitaires</h3>
          <p className="mb-4 text-[15px] leading-[1.7] text-text">
            Le site utilise la régie <strong>Google AdSense</strong> pour l'affichage de publicités.
            Google et ses partenaires peuvent déposer des cookies ou technologies similaires afin de
            mesurer l'audience et, le cas échéant, personnaliser les annonces. Ces cookies ne sont
            déposés qu'après recueil du consentement explicite du visiteur via le bandeau de
            consentement présenté à la première visite. Le consentement peut être retiré ou modifié
            à tout moment via{' '}
            <strong>[LIEN OU BOUTON « Gérer mes cookies » — à mettre en place]</strong>.
          </p>
          <p className="text-[15px] leading-[1.7] text-text">
            Les cookies strictement nécessaires au fonctionnement du site et la mesure d'audience
            anonymisée ne requièrent pas de consentement. Pour en savoir plus sur l'usage des données
            par Google, voir les{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener"
              className="text-brand underline hover:text-brand-dark"
            >
              règles de confidentialité des sites partenaires de Google
            </a>
            .
          </p>
        </section>

        <section id="responsabilite" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={6}>Limitation de responsabilité</SectionHeading>
          <p className="mb-3.5 text-[15px] leading-[1.7] text-text">
            Le site et son contenu sont fournis « en l'état », sans garantie d'aucune sorte.
            L'éditeur s'efforce d'assurer l'exactitude des informations relatives aux personnages et
            aux œuvres citées, sans pouvoir garantir qu'elles soient exemptes d'erreurs ou
            d'omissions. L'utilisation du site se fait sous la seule responsabilité de l'utilisateur.
          </p>
          <p className="text-[15px] leading-[1.7] text-text">
            L'éditeur ne saurait être tenu responsable d'une interruption de service, d'une perte de
            progression liée à l'effacement du stockage local du navigateur, ni du contenu des sites
            tiers vers lesquels des liens sont proposés.
          </p>
        </section>

        <section id="droit" className="mb-9 scroll-mt-[88px]">
          <SectionHeading n={7}>Droit applicable</SectionHeading>
          <p className="text-[15px] leading-[1.7] text-text">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, et à
            défaut de résolution amiable, les tribunaux français sont seuls compétents.
          </p>
        </section>

        <section id="a-completer" className="scroll-mt-[88px]">
          <SectionHeading n={8}>Récapitulatif des champs à compléter</SectionHeading>
          <p className="mb-4 text-[14px] leading-[1.7] text-muted">À supprimer de la page avant mise en ligne.</p>
          <ul className="flex list-none flex-col gap-2 p-0">
            {A_COMPLETER.map((c, i) => (
              <li key={i} className="flex items-baseline gap-3 rounded-control bg-surface px-3.5 py-2.5 text-[14px] leading-[1.5]">
                <span className="flex-none font-display text-[12px] font-bold text-brand">§{c.section}</span>
                <span className="text-text">{c.champ}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
