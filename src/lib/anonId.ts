const ANON_ID_KEY = 'animantix.anonId';

/** Identifiant anonyme stable par navigateur, utilisé uniquement pour la déduplication côté serveur. */
export function getOrCreateAnonId(): string {
  try {
    const existing = localStorage.getItem(ANON_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
