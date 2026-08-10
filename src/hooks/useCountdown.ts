import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

/** Fait avancer `now` du store toutes les secondes (countdown, temps écoulé). */
export function useCountdown(): void {
  const tick = useGameStore((s) => s.tick);
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
}
