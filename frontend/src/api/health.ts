export interface HealthResponse { status: string; service: string }

export async function getHealth(): Promise<HealthResponse> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const response = await fetch(`${baseUrl}/health`)
  if (!response.ok) throw new Error(`Health request failed with status ${response.status}`)
  return response.json() as Promise<HealthResponse>
}

