import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL =
  (globalThis as typeof globalThis & {
    process?: { env?: { EXPO_PUBLIC_API_URL?: string } };
  }).process?.env?.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:3333';

const AUTH_STORAGE_KEY = '@montenegro:auth-token';

let authToken: string | null = null;

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'avaliador';
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
};

export type ApiWork = {
  id: number;
  title: string;
  kind: 'livro' | 'filme' | 'serie';
  creator: string;
  publisher?: string | null;
  release_date?: string | null;
  year?: number | null;
  genre?: string | null;
  synopsis?: string | null;
  image_url?: string | null;
  rating: number;
  review_count: number;
};

export type ApiReview = {
  id: number;
  user_id: number;
  work_id: number;
  mode: 'rapida' | 'detalhada';
  rating: number;
  worth_it: 'sim' | 'mais_ou_menos' | 'nao';
  comment?: string | null;
  emotion?: string | null;
  verdict?: string | null;
  scores?: Record<string, number> | null;
  user_name?: string;
  avatar_url?: string | null;
  title?: string;
  kind?: 'livro' | 'filme' | 'serie';
  image_url?: string | null;
};

export type ApiShelf = {
  id: number;
  user_id: number;
  name: string;
  items: ApiWork[];
};

export function setAuthToken(token: string | null) {
  authToken = token;

  if (token) {
    void AsyncStorage.setItem(AUTH_STORAGE_KEY, token);
  } else {
    void AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export async function restoreAuthToken() {
  const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  authToken = token;
  return token;
}

export function getAuthToken() {
  return authToken;
}

function extractErrorMessage(data: any, fallback: string) {
  if (typeof data?.message === 'string') {
    return data.message;
  }

  if (typeof data?.detail === 'string') {
    return data.detail;
  }

  if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg;
  }

  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',

        ...(authToken
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    const text = await response.text();

    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = {
        detail: text || 'Resposta inválida do servidor.',
      };
    }

    if (!response.ok) {
      if (response.status === 401) {
        setAuthToken(null);
      }

      throw new Error(
        extractErrorMessage(
          data,
          `Erro ${response.status} ao conectar com o servidor.`,
        ),
      );
    }

    return data as T;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(
        `O servidor não respondeu. Confira ${API_URL}/health.`,
      );
    }

    if (
      error instanceof TypeError ||
      String(error?.message || '').includes(
        'Network request failed',
      )
    ) {
      throw new Error(
        `Não foi possível conectar ao backend em ${API_URL}.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadWorkCover(file: {
  uri: string;
  name: string;
  mimeType?: string;
  webFile?: any;
}) {
  if (!authToken) {
    throw new Error(
      'Você precisa estar logado para enviar uma capa.',
    );
  }

  const formData = new FormData();

  if (file.webFile) {
    formData.append(
      'file',
      file.webFile,
      file.name,
    );
  } else {
    formData.append(
      'file',
      {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'image/jpeg',
      } as any,
    );
  }

  const response = await fetch(
    `${API_URL}/work-covers`,
    {
      method: 'POST',

      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },

      body: formData,
    },
  );

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {
      detail: text || 'Resposta inválida do servidor.',
    };
  }

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
    }

    throw new Error(
      extractErrorMessage(
        data,
        `Erro ${response.status} ao enviar a imagem.`,
      ),
    );
  }

  if (!data?.image_url) {
    throw new Error(
      'O servidor não retornou o endereço da imagem.',
    );
  }

  return data as {
    image_url: string;
    filename: string;
  };
}

export const api = {
  health() {
    return request<{
      ok: boolean;
      service: string;
      backend: string;
    }>('/health');
  },

  register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'avaliador';
  }) {
    return request<{
      token: string;
      user: ApiUser;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: {
    email: string;
    password: string;
  }) {
    return request<{
      token: string;
      user: ApiUser;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me() {
    return request<{
      user: ApiUser;
    }>('/auth/me');
  },

  updateProfile(payload: {
    name?: string;
    bio?: string | null;
    avatar_url?: string | null;
  }) {
    return request<{
      user: ApiUser;
    }>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  listWorks(
    kind?: 'livro' | 'filme' | 'serie',
    search?: string,
  ) {
    const params = new URLSearchParams();

    if (kind) {
      params.set('kind', kind);
    }

    if (search?.trim()) {
      params.set('search', search.trim());
    }

    const suffix = params.toString()
      ? `?${params.toString()}`
      : '';

    return request<{
      works: ApiWork[];
    }>(`/works${suffix}`);
  },

  getWork(id: string | number) {
    return request<{
      work: ApiWork;
      reviews: ApiReview[];
    }>(`/works/${id}`);
  },

  uploadWorkCover,

  createWork(payload: Record<string, unknown>) {
    return request<{
      work: ApiWork;
    }>('/works', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  saveReview(
    workId: string | number,
    payload: Record<string, unknown>,
  ) {
    return request<{
      review: ApiReview;
    }>(`/works/${workId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listMyReviews() {
    return request<{
      reviews: ApiReview[];
    }>('/reviews/me');
  },

  listShelves() {
    return request<{
      shelves: ApiShelf[];
    }>('/shelves');
  },

  createShelf(name: string) {
    return request<{
      shelf: ApiShelf;
    }>('/shelves', {
      method: 'POST',
      body: JSON.stringify({
        name,
      }),
    });
  },

  renameShelf(
    shelfId: number,
    name: string,
  ) {
    return request<{
      shelf: Pick<
        ApiShelf,
        'id' | 'user_id' | 'name'
      >;
    }>(`/shelves/${shelfId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name,
      }),
    });
  },

  addShelfItem(
    shelfId: number,
    workId: number,
  ) {
    return request<{
      ok: true;
    }>(`/shelves/${shelfId}/items`, {
      method: 'POST',
      body: JSON.stringify({
        work_id: workId,
      }),
    });
  },

  removeShelfItem(
    shelfId: number,
    workId: number,
  ) {
    return request<void>(
      `/shelves/${shelfId}/items/${workId}`,
      {
        method: 'DELETE',
      },
    );
  },
};

export const backendWorkIds: Record<
  string,
  number
> = {
  'jantar-secreto': 1,
  'o-amor-nao-e-obvio': 2,
  'memorias-postumas': 3,
  'ainda-estou-aqui': 4,
  'cidade-invisivel': 5,
};

export function resolveBackendWorkId(
  localId: string,
) {
  return (
    backendWorkIds[localId] ??
    Number(localId)
  );
}