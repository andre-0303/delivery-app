import type { Categoria, Pedido, Produto } from '../types';

const BASE = (import.meta as Record<string, any>).env?.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const res = await fetch(BASE + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Erro na requisição');
  return json as T;
}

interface AuthResponse {
  token: string;
  cliente: { id: number; name: string; email: string };
}

interface CreateOrderBody {
  formaPagamento: string;
  enderecoEntrega: string;
  valorFrete: string;
  itens: { idProduto: number; quantidade: number }[];
}

interface OrderResponse {
  pedido: Pedido;
  itens: unknown[];
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string; phone?: string }) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  },
  categories: {
    list: () => request<Categoria[]>('/categories'),
  },
  products: {
    list: (slug?: string) =>
      request<Produto[]>(slug ? `/products?categoria=${slug}` : '/products'),
  },
  orders: {
    create: (body: CreateOrderBody, token: string) =>
      request<OrderResponse>('/orders', { method: 'POST', body: JSON.stringify(body) }, token),
    get: (id: number, token: string) =>
      request<OrderResponse>(`/orders/${id}`, undefined, token),
  },
};
