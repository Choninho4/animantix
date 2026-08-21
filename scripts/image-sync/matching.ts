export interface ProviderCharacter {
  malId: number;
  name: string;
  imageUrl: string;
}

export type MatchResult =
  | { status: 'matched'; character: ProviderCharacter }
  | { status: 'ambiguous'; candidates: ProviderCharacter[] }
  | { status: 'unmatched' };

export function canonicalName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function nameVariants(value: string): string[] {
  const variants = new Set([canonicalName(value)]);
  const comma = value.indexOf(',');
  if (comma >= 0) {
    const familyName = value.slice(0, comma).trim();
    const givenName = value.slice(comma + 1).trim();
    variants.add(canonicalName(`${givenName} ${familyName}`));
  }
  return [...variants];
}

export function matchCharacter(localName: string, candidates: ProviderCharacter[]): MatchResult {
  const local = canonicalName(localName);
  const matches = candidates.filter((candidate) => nameVariants(candidate.name).includes(local));
  if (matches.length === 1) return { status: 'matched', character: matches[0] };
  if (matches.length > 1) return { status: 'ambiguous', candidates: matches };
  return { status: 'unmatched' };
}
