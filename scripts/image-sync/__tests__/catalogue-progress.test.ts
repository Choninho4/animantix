import { describe, expect, it } from 'vitest';
import { cataloguePage, recordCatalogueFailure, recordCatalogueSuccess } from '../catalogue-progress';

describe('progression du catalogue Jikan', () => {
  it('met une page en échec de côté puis poursuit avec la suivante', () => {
    const state = { nextPage: 2, lastPage: 5, failedPages: [] as number[] };

    expect(cataloguePage(state)).toEqual({ page: 2, retry: false });
    recordCatalogueFailure(state, 2, false);

    expect(state).toEqual({ nextPage: 3, lastPage: 5, failedPages: [2] });
    expect(cataloguePage(state)).toEqual({ page: 3, retry: false });
  });

  it('retente les pages différées après le parcours principal', () => {
    const state = { nextPage: 6, lastPage: 5, failedPages: [2] };

    expect(cataloguePage(state)).toEqual({ page: 2, retry: true });
    recordCatalogueSuccess(state, 2, true, 5);

    expect(state.failedPages).toEqual([]);
    expect(cataloguePage(state)).toBeNull();
  });

  it('peut prioriser une page différée lors d’une nouvelle reprise', () => {
    const state = { nextPage: 22, lastPage: 3256, failedPages: [2, 3] };

    expect(cataloguePage(state, true)).toEqual({ page: 2, retry: true });
    expect(cataloguePage(state, false)).toEqual({ page: 22, retry: false });
  });
});
