// Custom fetch wrapper that always disables cache
// Use this for all API calls in the app

export async function apiFetch(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      ...options?.headers,
    },
  });
}
