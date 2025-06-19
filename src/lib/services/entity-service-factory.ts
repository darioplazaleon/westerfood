// src/lib/services/entity-service-factory.ts
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function createEntityService<T extends { id: string }>(entityPath: string) {
  async function handleResponse<R>(response: Response): Promise<R> {
    if (!response.ok) {
      let message = `Error: ${response.status}`
      try {
        const errorData = await response.json()
        message = errorData.message || message
      } catch {
        message = `Network error: ${response.status} ${response.statusText}`
      }
      const error = new Error(message) as Error & { status?: number }
      error.status = response.status
      throw error
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    return response.text() as unknown as R
  }

  async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get('auth_token')?.value || null
  }

  async function fetchWithAuth(url: string, options: RequestInit, retries = 1): Promise<Response> {
    const token = await getAuthToken()
    if (!token) throw new Error('No authentication token available')

    const config: RequestInit = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }

    let response = await fetch(url, config)

    if (response.status === 401 && retries > 0) {
      const newToken = await getAuthToken()
      if (newToken && newToken !== token) {
        response = await fetch(url, {
          ...config,
          headers: {
            ...config.headers,
            'Authorization': `Bearer ${newToken}`,
          },
        })
      }
    }

    return response
  }

  return {
    async getAll(page = 0) {
      const response = await fetchWithAuth(`${API_URL}/v1/${entityPath}?page=${page}`, {
        method: 'GET',
        cache: 'no-store',
      })
      return handleResponse(response)
    },

    async getDetails(id: string): Promise<T> {
      const response = await fetchWithAuth(`${API_URL}/v1/${entityPath}/details/${id}`, {
        method: 'GET',
        cache: 'no-store',
      })
      return handleResponse<T>(response)
    },

    async create(entity: Omit<T, 'id'>): Promise<T> {
      const response = await fetchWithAuth(`${API_URL}/v1/${entityPath}`, {
        method: 'POST',
        body: JSON.stringify(entity),
      })
      return handleResponse<T>(response)
    },

    async update(id: string, entity: Omit<T, 'id'>): Promise<T> {
      const response = await fetchWithAuth(`${API_URL}/v1/${entityPath}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entity),
      })
      return handleResponse<T>(response)
    },

    async delete(id: string): Promise<void> {
      const response = await fetchWithAuth(`${API_URL}/v1/${entityPath}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        await handleResponse<void>(response)
      }
    },
  }
}