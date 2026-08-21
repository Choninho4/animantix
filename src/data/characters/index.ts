import type { Character, CharacterDefinition } from '../../types/character';
import { PART_01_BIG_THREE } from './part-01-big-three';
import { PART_02_SHONEN_JUMP_MODERN } from './part-02-shonen-jump-modern';
import { PART_03_SEINEN_DARK } from './part-03-seinen-dark';
import { PART_04_ISEKAI_FANTASY } from './part-04-isekai-fantasy';
import { PART_05_SPORTS } from './part-05-sports';
import { PART_06_COMEDY_ROMANCE } from './part-06-comedy-romance';
import { PART_07_CLASSICS_CULT } from './part-07-classics-cult';
import { PART_08_MISC } from './part-08-misc';

const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  ...PART_01_BIG_THREE,
  ...PART_02_SHONEN_JUMP_MODERN,
  ...PART_03_SEINEN_DARK,
  ...PART_04_ISEKAI_FANTASY,
  ...PART_05_SPORTS,
  ...PART_06_COMEDY_ROMANCE,
  ...PART_07_CLASSICS_CULT,
  ...PART_08_MISC,
];

export const CHARACTERS: Character[] = CHARACTER_DEFINITIONS.map((character) => ({
  ...character,
  imageUrl: `/assets/characters/${character.id}.webp`,
}));

export const CHARACTER_BY_ID = new Map(CHARACTERS.map((character) => [character.id, character]));
