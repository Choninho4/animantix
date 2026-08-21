export interface CatalogueProgress {
  nextPage: number;
  lastPage: number | null;
  failedPages: number[];
}

export function cataloguePage(
  state: CatalogueProgress,
  preferRetries = false,
): { page: number; retry: boolean } | null {
  if (preferRetries && state.failedPages.length > 0) {
    return { page: state.failedPages[0], retry: true };
  }
  if (state.lastPage === null || state.nextPage <= state.lastPage) {
    return { page: state.nextPage, retry: false };
  }
  return state.failedPages.length > 0 ? { page: state.failedPages[0], retry: true } : null;
}

export function recordCatalogueSuccess(
  state: CatalogueProgress,
  page: number,
  retry: boolean,
  lastPage: number,
): void {
  state.lastPage = lastPage;
  if (retry) {
    state.failedPages = state.failedPages.filter((failedPage) => failedPage !== page);
  } else {
    state.nextPage = page + 1;
  }
}

export function recordCatalogueFailure(state: CatalogueProgress, page: number, retry: boolean): void {
  state.failedPages = state.failedPages.filter((failedPage) => failedPage !== page);
  state.failedPages.push(page);
  if (!retry) state.nextPage = page + 1;
}
