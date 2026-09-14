const API_URL = "http://192.168.30.16:8080";

async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token = sessionStorage.getItem("token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let mensagem = `Erro HTTP: ${response.status}`;

    try {
      const erro = await response.json();

      if (erro?.message) {
        mensagem = erro.message;
      }
    } catch {
      // resposta sem JSON
    }

    throw new Error(mensagem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const texto = await response.text();

  if (!texto) {
    return undefined as T;
  }

  return JSON.parse(texto);
}

export default api;