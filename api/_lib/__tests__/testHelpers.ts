import { vi } from 'vitest';
import type { ApiRequest, ApiResponse } from '../types.js';

export function mockReq(overrides: Partial<ApiRequest> = {}): ApiRequest {
  return {
    method: 'GET',
    query: {},
    body: undefined,
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
    ...overrides,
  } as unknown as ApiRequest;
}

export function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
  };
  const api: ApiResponse = {
    status: vi.fn((code: number) => {
      res.statusCode = code;
      return api;
    }),
    json: vi.fn((payload: unknown) => {
      res.body = payload;
    }),
    setHeader: vi.fn((name: string, value: string) => {
      res.headers[name] = value;
      return api;
    }),
  } as unknown as ApiResponse;
  return { res, api };
}
