import { Company } from '@/lib/validations/company-form'
import { cookies } from 'next/headers'
import { useAuthStore } from '@/lib/auth-store'

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

  // If it's not JSON, return the response as text
  return response.text() as unknown as T
}

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value || null
}

async function fetchWithAuth(url: string, options: RequestInit, retries = 1): Promise<Response> {
  let token = await getAuthToken()

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
    // await useAuthStore.getState().refreshTokens()
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

export const companyService = {

  async getAll(): Promise<Company[]> {
    const response = await fetchWithAuth(`${API_URL}/v1/companies`, {
      method: 'GET',
      cache: 'no-store',
    })

    const result = await handleResponse<any>(response)

    // Handle paginated response
    if (result && typeof result === 'object' && 'content' in result) {
      return result.content as Company[]
    }

    // Handle direct array response
    if (Array.isArray(result)) {
      return result as Company[]
    }

    return []
  },

  async getDetails(id: string): Promise<any> {
    const response = await fetchWithAuth(`${API_URL}/v1/companies/details/${id}`, {
      method: 'GET',
      cache: 'no-store',
    })

    const result = await handleResponse<any>(response)

    return result
  },

  async create(company: Omit<Company, 'id'>): Promise<Company> {
    const response = await fetchWithAuth(`${API_URL}/v1/companies`, {
      method: 'POST',
      body: JSON.stringify(company),
    })

    return handleResponse<Company>(response)
  },

  async update(id: string, company: Omit<Company, 'id'>): Promise<Company> {
    const response = await fetchWithAuth(`${API_URL}/v1/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(company),
    })

    return handleResponse<Company>(response)
  },

  async delete(id: string): Promise<void> {
    const response = await fetchWithAuth(`${API_URL}/v1/companies/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      await handleResponse<void>(response)
    }
  },
}