import { MainDish } from '@/lib/validations/main-dish-form'
import { cookies } from 'next/headers'
import { PaginatedResponse } from '@/types/dashboard'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(response: Response): Promise<T> {
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

  return response.text() as unknown as T
}

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value || null
}

async function fetchWithAuth(url: string, options: RequestInit, retries = 1): Promise<Response> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('No authentication token available')
  }

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

export const mainDishService = {
  async getAll(page = 0): Promise<MainDish[]> {
    const response = await fetchWithAuth(`${API_URL}/v1/main-dishes?page=${page}`, {
      method: 'GET',
      cache: 'no-store',
    })

    const result = await handleResponse<PaginatedResponse<any>>(response)

    return result
  },

  async getDetails(id: string): Promise<any> {
    const response = await fetchWithAuth(`${API_URL}/v1/main-dishes/details/${id}`, {
      method: 'GET',
      cache: 'no-store',
    })

    const result = await handleResponse<any>(response)

    return result
  },

  async create(mainDish: Omit<MainDish, 'id'>): Promise<MainDish> {
    const response = await fetchWithAuth(`${API_URL}/v1/main-dishes`, {
      method: 'POST',
      body: JSON.stringify(mainDish),
    })

    return handleResponse<MainDish>(response)
  },

  async update(id: string, mainDish: Omit<MainDish, 'id'>): Promise<MainDish> {
    const response = await fetchWithAuth(`${API_URL}/v1/main-dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mainDish),
    })

    return handleResponse<MainDish>(response)
  },

  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/v1/main-dishes/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      await handleResponse<void>(response)
    }
  },
}