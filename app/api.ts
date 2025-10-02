// api.ts
const BASE_URL = 'http://localhost:8080';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const body = await res.json(); msg = body?.error || body?.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function apiHealth(): Promise<{ ok: boolean; service: string; time: string }> {
  return fetchJson(`${BASE_URL}/api/health`);
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export async function aiChat(params: {
  messages: ChatMessage[];
  temperature?: number;
  model?: string;
}): Promise<{ id: string; created: number; model: string; role?: string; content?: string }> {
  return fetchJson(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(params),
  });
}

export async function aiEmbeddings(params: {
  input: string | string[];
  model?: string;
}): Promise<{ model: string; data: { index: number; embedding: number[] }[] }> {
  return fetchJson(`${BASE_URL}/api/ai/embeddings`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(params),
  });
}