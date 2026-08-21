import { matchCharacter, type ProviderCharacter } from './matching';

interface LocalCharacter {
  id: string;
  nom: string;
  animeSource: string;
}

interface ResolvedCharacter {
  localId: string;
  provider: ProviderCharacter;
  match: 'automatic' | 'override';
}

interface ResolutionIssue {
  localId: string;
  status: 'unmatched' | 'ambiguous' | 'invalid-override';
  candidates: number[];
}

export function charactersNeedingSearch(
  locals: LocalCharacter[],
  castByAnime: Map<string, ProviderCharacter[]>,
  overrides: Record<string, number>,
): LocalCharacter[] {
  const unresolvedIds = new Set(
    resolveCharacters(locals, castByAnime, overrides).issues.map(({ localId }) => localId),
  );
  return locals.filter(({ id }) => unresolvedIds.has(id));
}

export function resolveCharacters(
  locals: LocalCharacter[],
  castByAnime: Map<string, ProviderCharacter[]>,
  overrides: Record<string, number>,
): { resolved: ResolvedCharacter[]; issues: ResolutionIssue[] } {
  const resolved: ResolvedCharacter[] = [];
  const issues: ResolutionIssue[] = [];

  for (const local of locals) {
    const candidates = castByAnime.get(local.animeSource) ?? [];
    const overrideId = overrides[local.id];
    if (overrideId !== undefined) {
      const provider = candidates.find((candidate) => candidate.malId === overrideId);
      if (provider) {
        resolved.push({ localId: local.id, provider, match: 'override' });
      } else {
        issues.push({ localId: local.id, status: 'invalid-override', candidates: candidates.map((c) => c.malId) });
      }
      continue;
    }

    const match = matchCharacter(local.nom, candidates);
    if (match.status === 'matched') {
      resolved.push({ localId: local.id, provider: match.character, match: 'automatic' });
    } else {
      issues.push({
        localId: local.id,
        status: match.status,
        candidates: match.status === 'ambiguous' ? match.candidates.map((candidate) => candidate.malId) : [],
      });
    }
  }

  return { resolved, issues };
}
