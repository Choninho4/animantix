import type { GuessEntry } from '../types/guess';
import { temperatureForScore } from './temperature';

const EMOJIS_PER_LINE = 5;

export function buildShareText(dayNumber: number, guesses: GuessEntry[]): string {
  const emojis = guesses.map((g) => temperatureForScore(g.score).emoji);
  const lines: string[] = [];
  for (let i = 0; i < emojis.length; i += EMOJIS_PER_LINE) {
    lines.push(emojis.slice(i, i + EMOJIS_PER_LINE).join(''));
  }
  return `Animantix #${dayNumber} · ${guesses.length} essais\n${lines.join('\n')}`;
}
