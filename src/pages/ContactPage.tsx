import { useState, type ReactNode } from 'react';
import { LABELS, type CriterionKey } from '../lib/scoring';

const CRITERION_OPTIONS = Object.entries(LABELS) as [CriterionKey, string][];

type ReportType = 'bug' | 'suggestion' | 'erreur-personnage';

const TYPES: { key: ReportType; label: string }[] = [
  { key: 'bug', label: 'Bug' },
  { key: 'suggestion', label: 'Suggestion' },
  { key: 'erreur-personnage', label: 'Erreur personnage' },
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

const fieldClass =
  'min-h-touch border-2 border-ink bg-bg px-3.5 text-[15px] text-text placeholder:text-muted focus:border-brand focus:outline-none';

function FormField({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[12px] font-bold uppercase tracking-[.08em] text-text">
        {label} <span className="text-muted">({optional ? 'optionnel' : 'obligatoire'})</span>
      </span>
      {children}
    </label>
  );
}

export default function ContactPage() {
  const [type, setType] = useState<ReportType>('bug');
  const [mail, setMail] = useState('');
  const [msg, setMsg] = useState('');
  const [personnage, setPersonnage] = useState('');
  const [critere, setCritere] = useState<CriterionKey | ''>('');
  const [erreur, setErreur] = useState('');
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit() {
    if (mail.trim() && !isValidEmail(mail)) {
      setErreur('Cet email ne semble pas valide.');
      return;
    }
    if (msg.trim().length < 5) {
      setErreur('Écris-nous quelques mots de plus.');
      return;
    }
    setErreur('');
    setEnvoye(true);
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-14">
      <h1 className="mb-8 font-display text-[44px] font-bold uppercase leading-none text-text sm:text-[56px]">
        Contact
      </h1>

      <section className="border-[3px] border-ink bg-surface p-6 shadow-[8px_8px_0_#D02886] sm:p-8">
        <h2 className="font-display text-[22px] font-bold uppercase leading-[1.2] text-text sm:text-[26px]">
          Retours joueurs
        </h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-muted">
          Un bug, une idée, ou un personnage mal renseigné : dis-nous tout.
        </p>

        {envoye ? (
          <div role="status" className="mt-6 border-[3px] border-ink bg-success/10 p-5 shadow-[5px_5px_0_#4CAF50]">
            <div className="mb-1.5 font-display text-[18px] font-bold text-brand-dark">Message envoyé, merci !</div>
            <p className="text-[14px] leading-[1.55] text-text">
              On lit tout, promis. Si tu as laissé ton email, on te répond sous 48 heures.
            </p>
          </div>
        ) : (
          <>
            <div role="tablist" aria-label="Type de retour" className="mt-5 flex flex-wrap gap-2.5">
              {TYPES.map((t) => {
                const active = t.key === type;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setType(t.key)}
                    className={`border-2 border-ink px-4 py-2.5 font-display text-[13px] font-bold uppercase shadow-[2px_2px_0_#0B0B16] ${
                      active ? 'bg-brand text-white' : 'bg-transparent text-text'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <FormField label="Email" optional>
                <input
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="toi@exemple.fr"
                  className={fieldClass}
                />
              </FormField>

              {type === 'erreur-personnage' && (
                <>
                  <FormField label="Personnage concerné" optional>
                    <input
                      type="text"
                      value={personnage}
                      onChange={(e) => setPersonnage(e.target.value)}
                      placeholder="ex. Monkey D. Luffy"
                      className={fieldClass}
                    />
                  </FormField>
                  <FormField label="Critère concerné" optional>
                    <select
                      value={critere}
                      onChange={(e) => setCritere(e.target.value as CriterionKey | '')}
                      className={`${fieldClass} bg-bg`}
                    >
                      <option value="">Sélectionne un critère</option>
                      {CRITERION_OPTIONS.map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </>
              )}

              <FormField label="Message">
                <textarea
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Décris le bug rencontré, et si possible comment le reproduire."
                  className={`${fieldClass} min-h-0 resize-y py-3`}
                />
              </FormField>

              <div aria-live="polite" className="min-h-[18px] text-[13px] font-semibold text-danger">
                {erreur}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="self-start border-[3px] border-ink bg-brand px-8 py-3.5 font-display text-[16px] font-bold uppercase text-white shadow-[4px_4px_0_#0B0B16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                Envoyer ▸
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-[12px] leading-[1.5] text-muted">
          Ce formulaire n'envoie rien pour l'instant : il reste à le brancher sur un service d'envoi
          (Formspree, Resend, une route serverless…). En attendant, écris directement à{' '}
          <a href="mailto:contact@animantix.fr" className="text-brand hover:text-brand-dark">
            contact@animantix.fr
          </a>
          .
        </p>
      </section>
    </main>
  );
}
