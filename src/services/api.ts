const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text || 'Resposta inválida do servidor.' };
    }

    if (!response.ok) {
      throw new Error(data?.message || `Erro ${response.status} ao conectar com o servidor.`);
    }

    return data as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`O servidor não respondeu. Verifique se o backend está rodando e se o celular consegue acessar ${API_URL}/health.`);
    }

    if (error instanceof TypeError || String(error?.message || '').includes('Network request failed')) {
      throw new Error(`Não foi possível conectar ao backend em ${API_URL}. Confira o IP do PC, o Wi-Fi e o Firewall do Windows.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  register(payload: { name: string; email: string; password: string; role: 'admin' | 'avaliador' }) {
    return request<{ token: string; user: unknown }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: { email: string; password: string }) {
    return request<{ token: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me() {
    return request<{ user: unknown }>('/auth/me');
  },

  listWorks(kind?: 'livro' | 'filme' | 'serie', search?: string) {
    const params = new URLSearchParams();
    if (kind) params.set('kind', kind);
    if (search) params.set('search', search);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return request<{ works: unknown[] }>(`/works${suffix}`);
  },

  createWork(payload: Record<string, unknown>) {
    return request<{ work: unknown }>('/works', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  saveReview(workId: string | number, payload: Record<string, unknown>) {
    return request<{ review: unknown }>(`/works/${workId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listShelves() {
    return request<{ shelves: unknown[] }>('/shelves');
  },

  createShelf(name: string) {
    return request<{ shelf: unknown }>('/shelves', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};

export const backendWorkIds: Record<string, number> = {
  'jantar-secreto': 1,
  'o-amor-nao-e-obvio': 2,
  'memorias-postumas': 3,
  'ainda-estou-aqui': 4,
  'cidade-invisivel': 5,
};

export function resolveBackendWorkId(localId: string) {
  return backendWorkIds[localId] ?? Number(localId);
}

export { API_URL };
