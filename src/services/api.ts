export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '' : 'https://timecareapi.onrender.com');

interface RequestOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  public readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const responseText = await response.text();
  let responseData: unknown = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    const message =
      responseData && typeof responseData === 'object' && 'message' in responseData
        ? String((responseData as { message?: string }).message ?? '')
        : `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  return responseData as T;
}

const warmedEndpoints = new Set<string>();

export function warmupApi(path = '/', timeoutMs = 4000): void {
  const endpoint = `${API_BASE_URL}${path}`;
  if (warmedEndpoints.has(endpoint)) return;
  warmedEndpoints.add(endpoint);

  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => abortController.abort(), timeoutMs);

  void fetch(endpoint, {
    method: 'GET',
    signal: abortController.signal,
  })
    .catch(() => undefined)
    .finally(() => {
      window.clearTimeout(timeoutId);
    });
}
