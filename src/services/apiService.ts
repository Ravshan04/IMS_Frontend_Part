import { SESSION_STORAGE_KEY } from '@/constants/common';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7031/api/v1';

interface StoredSession {
  token?: string;
  access_token?: string;
}

interface ApiErrorPayload {
  message?: string;
}

/**
 * Reads the JWT from the local storage session blob without assuming a key name —
 * historically we've stored it under both `token` and `access_token`.
 */
function readAuthToken(): string | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as StoredSession;
    return session.token ?? session.access_token ?? null;
  } catch {
    return null;
  }
}

function buildHeaders(token: string | null, extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  if (!extra) return headers;

  if (extra instanceof Headers) {
    extra.forEach((value, key) => { headers[key] = value; });
  } else if (Array.isArray(extra)) {
    for (const [key, value] of extra) headers[key] = value;
  } else {
    Object.assign(headers, extra);
  }

  return headers;
}

/**
 * 401 means the session expired or the token was rotated out. Bounce the user
 * back to /login from a single place so we don't need a useEffect-driven retry
 * dance in every page.
 */
function handleUnauthorized(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  // Hard navigation rather than React Router push: 401 typically means we lost
  // auth state mid-render and we want to reset the entire app shell.
  window.location.href = '/login';
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = readAuthToken();
    const headers = buildHeaders(token, options.headers);

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized();
      }
      const error = await response.json().catch(() => ({ message: 'An error occurred' })) as ApiErrorPayload;
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) return {} as T;
    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
