import type { Character } from '../../types/character';
import { PART_01_SEED_SHONEN_CLASSICS } from './part-01-seed-shonen-classics';
import { PART_02_SEED_MODERN_CULT } from './part-02-seed-modern-cult';
import { PART_03_SHONEN_JUMP_EXTRA } from './part-03-shonen-jump-extra';
import { PART_04_SEINEN } from './part-04-seinen';
import { PART_05_SHOJO_ROMANCE } from './part-05-shojo-romance';
import { PART_06_ISEKAI } from './part-06-isekai';
import { PART_07_MECHA } from './part-07-mecha';
import { PART_08_SPORTS } from './part-08-sports';
import { PART_09_COMEDY_SLICE_OF_LIFE } from './part-09-comedy-slice-of-life';
import { PART_10_HORROR_DARK_FANTASY } from './part-10-horror-dark-fantasy';
import { PART_11_CLASSICS_RETRO } from './part-11-classics-retro';
import { PART_12_2020S_RELEASES } from './part-12-2020s-releases';
import { PART_13_FANTASY_ADVENTURE } from './part-13-fantasy-adventure';
import { PART_14_BALANCE_FILLERS } from './part-14-balance-fillers';

export const CHARACTERS: Character[] = [
  ...PART_01_SEED_SHONEN_CLASSICS,
  ...PART_02_SEED_MODERN_CULT,
  ...PART_03_SHONEN_JUMP_EXTRA,
  ...PART_04_SEINEN,
  ...PART_05_SHOJO_ROMANCE,
  ...PART_06_ISEKAI,
  ...PART_07_MECHA,
  ...PART_08_SPORTS,
  ...PART_09_COMEDY_SLICE_OF_LIFE,
  ...PART_10_HORROR_DARK_FANTASY,
  ...PART_11_CLASSICS_RETRO,
  ...PART_12_2020S_RELEASES,
  ...PART_13_FANTASY_ADVENTURE,
  ...PART_14_BALANCE_FILLERS,
];
