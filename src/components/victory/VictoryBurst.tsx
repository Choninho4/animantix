import { motion } from 'framer-motion';

const LINE_COUNT = 16;
const RADIUS_START = 14;
const RADIUS_END = 112;
// Léger surcroît d'accélération en sortie plutôt qu'un easeIn pur : les traits
// s'arrachent du centre plus qu'ils ne "glissent" vers l'extérieur.
const LINE_EASE = [0.5, 0, 0.85, 0.4] as const;

const LINES = Array.from({ length: LINE_COUNT }, (_, i) => {
  const angle = (Math.PI * 2 * i) / LINE_COUNT;
  return {
    angleDeg: (angle * 180) / Math.PI,
    dx: Math.cos(angle),
    dy: Math.sin(angle),
  };
});

/**
 * Éclat "lignes de vitesse" façon manga au moment de la victoire, en
 * remplacement des confettis carrés : des traits fins rayonnent depuis le
 * centre de la carte et une onomatopée ("TROUVÉ !") apparaît en surimpression
 * brève. Effet ponctuel, joué une seule fois au montage de la section
 * victoire — durée volontairement au-delà des 400ms habituels du site
 * puisqu'il s'agit d'une célébration, pas d'une interaction répétée.
 */
export function VictoryBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {LINES.map((l, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-[3px] w-14 -translate-y-1/2 rounded-full text-brand"
          style={{ background: 'currentColor', rotate: l.angleDeg }}
          initial={{ x: l.dx * RADIUS_START, y: l.dy * RADIUS_START, opacity: 1 }}
          animate={{ x: l.dx * RADIUS_END, y: l.dy * RADIUS_END, opacity: 0 }}
          transition={{ duration: 0.55, ease: LINE_EASE }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0, rotate: -6 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.1, 1, 1.05], y: [0, 0, 0, -16] }}
        transition={{ duration: 0.9, times: [0, 0.22, 0.65, 1], ease: 'easeOut' }}
      >
        <span className="font-display text-[56px] font-bold text-brand sm:text-[72px]">TROUVÉ !</span>
      </motion.div>
    </div>
  );
}
