const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Erro na comunicação com a API.");
  }

  return response.json();
}