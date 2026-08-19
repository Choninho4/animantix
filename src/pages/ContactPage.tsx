import { useState, type ReactNode } from 'react';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function MessageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.2-.5L3 21l1.7-4.5A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V8.5l6-3.5v4l6-3.5V21" />
      <path d="M15 21V10.5l6 3V21" />
      <path d="M2 21h20" />
    </svg>
  );
}

const fieldClass =
  'min-h-touch border-2 border-ink bg-bg px-3.5 text-[15px] text-text placeholder:text-muted focus:border-[#FF5FB3] focus:outline-none';

function FormField({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-text">
        {label}
        {optional && <span className="font-normal text-muted"> (optionnel)</span>}
      </span>
      {children}
    </label>
  );
}

function PlayerForm() {
  const [nom, setNom] = useState('');
  const [mail, setMail] = useState('');
  const [msg, setMsg] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit() {
    if (!isValidEmail(mail)) {
      setErreur('Il nous faut un email valide pour te répondre.');
      return;
    }
    if (msg.trim().length < 5) {
      setErreur('Écris-nous quelques mots de plus.');
      return;
    }
    setErreur('');
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div role="status" className="mt-4 border-[3px] border-ink bg-success/10 p-5 shadow-[5px_5px_0_#4CAF50]">
        <div className="mb-1.5 font-display text-[18px] font-bold text-brand-dark">Message envoyé, merci !</div>
        <p className="text-[14px] leading-[1.55] text-text">
          On lit tout, promis. Si tu as laissé ton email, on te répond sous 48 heures.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-3.5">
      <FormField label="Ton pseudo" optional>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="ex. TanjiroFan_92"
          className={fieldClass}
        />
      </FormField>
      <FormField label="Ton email">
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="pour qu'on puisse te répondre"
          className={fieldClass}
        />
      </FormField>
      <FormField label="Ton message">
        <textarea
          rows={5}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Il manque un perso ? Le score te paraît bizarre ? Raconte."
          className={`${fieldClass} min-h-0 resize-y py-3`}
        />
      </FormField>
      <div aria-live="polite" className="min-h-[18px] text-[13px] font-semibold text-danger">
        {erreur}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="min-h-touch border-[3px] border-ink bg-brand font-display text-[16px] font-bold text-white shadow-[4px_4px_0_#0B0B16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        Envoyer mon message
      </button>
      <p className="text-[12px] leading-[1.5] text-muted">
        Ou directement par mail : <a href="mailto:contact@animantix.fr" className="text-brand hover:text-brand-dark">contact@animantix.fr</a>
      </p>
    </div>
  );
}

function ProForm() {
  const [nom, setNom] = useState('');
  const [societe, setSociete] = useState('');
  const [mail, setMail] = useState('');
  const [msg, setMsg] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit() {
    if (!nom.trim() || !societe.trim()) {
      setErreur("Merci d'indiquer votre nom et votre structure.");
      return;
    }
    if (!isValidEmail(mail)) {
      setErreur("Merci d'indiquer un email professionnel valide.");
      return;
    }
    if (msg.trim().length < 5) {
      setErreur('Précisez votre demande en quelques mots.');
      return;
    }
    setErreur('');
    setEnvoye(true);
  }

  if (envoye) {
    return (
      <div role="status" className="mt-4 border-[3px] border-ink bg-surface p-5 shadow-[5px_5px_0_#4CAF50]">
        <div className="mb-1.5 font-display text-[18px] font-bold text-brand-dark">Demande transmise</div>
        <p className="text-[14px] leading-[1.55] text-text">
          Merci pour votre message. Nous revenons vers vous sous 48 heures ouvrées avec les formats
          et l'audience du site.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-col gap-3.5">
      <FormField label="Nom et prénom">
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" className={fieldClass} />
      </FormField>
      <FormField label="Entreprise ou média">
        <input
          type="text"
          value={societe}
          onChange={(e) => setSociete(e.target.value)}
          placeholder="Raison sociale"
          className={fieldClass}
        />
      </FormField>
      <FormField label="Email professionnel">
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="prenom.nom@entreprise.fr"
          className={fieldClass}
        />
      </FormField>
      <FormField label="Votre demande">
        <textarea
          rows={5}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Nature du partenariat envisagé, période, budget indicatif."
          className={`${fieldClass} min-h-0 resize-y py-3`}
        />
      </FormField>
      <div aria-live="polite" className="min-h-[18px] text-[13px] font-semibold text-danger">
        {erreur}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="min-h-touch border-[3px] border-ink bg-brand font-display text-[16px] font-bold text-white shadow-[4px_4px_0_#0B0B16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
      >
        Envoyer la demande
      </button>
      <p className="text-[12px] leading-[1.5] text-muted">
        Contact direct :{' '}
        <a href="mailto:partenariats@animantix.fr" className="text-brand hover:text-brand-dark">
          partenariats@animantix.fr
        </a>
      </p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-14">
      <div className="mb-10 max-w-[600px]">
        <h1 className="mb-3.5 font-display text-[36px] font-bold leading-[1.15] text-brand sm:text-[48px]">
          Contact
        </h1>
        <p className="text-[16px] leading-[1.6] text-muted sm:text-[17px]">
          Deux boîtes, deux usages. Choisis celle qui te correspond — on répond généralement sous 48
          heures.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <section className="border-[3px] border-ink bg-surface p-6 shadow-[6px_6px_0_rgb(var(--color-shadow-accent))]">
          <div className="mb-1.5 flex items-start gap-3.5">
            <span className="flex h-11 w-11 flex-none items-center justify-center border-2 border-ink bg-brand text-white">
              <MessageIcon />
            </span>
            <div>
              <h2 className="mb-1 font-display text-[22px] font-bold leading-[1.2] text-brand-dark">
                Une suggestion, un bug à signaler ?
              </h2>
              <p className="text-[14px] leading-[1.55] text-muted">
                Un personnage manquant, un bug, une idée d'amélioration ? Dis-nous tout.
              </p>
            </div>
          </div>
          <PlayerForm />
        </section>

        <section className="border-[3px] border-ink border-t-[6px] border-t-brand-mid bg-bg p-6 shadow-[6px_6px_0_#9966CC]">
          <div className="mb-1.5 flex items-start gap-3.5">
            <span className="flex h-11 w-11 flex-none items-center justify-center border-2 border-ink bg-brand-mid text-white">
              <BriefcaseIcon />
            </span>
            <div>
              <h2 className="mb-1 font-display text-[22px] font-bold leading-[1.2] text-brand-dark">
                Vous représentez une marque ou un média ?
              </h2>
              <p className="text-[14px] leading-[1.55] text-muted">
                Intéressé par un partenariat, un sponsoring ou une intégration avec Animantix ?
                Parlons-en.
              </p>
            </div>
          </div>
          <ProForm />
        </section>
      </div>

      <p className="mt-8 max-w-[640px] text-[13px] leading-[1.6] text-muted">
        Ces formulaires n'envoient rien pour l'instant : il reste à les brancher sur un service
        d'envoi (Formspree, Resend, une route serverless…). En attendant, les deux adresses
        ci-dessus font office de contact direct.
      </p>
    </main>
  );
}
