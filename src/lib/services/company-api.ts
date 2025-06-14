import { Company } from '@/lib/validations/company-form'
import { cookies } from 'next/headers'
import { useAuthStore } from '@/lib/auth-store'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const pendingRetries = new Set()

async function handleResponse<T>(response: Response, requestId?: string): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json()

      // Handle 401 Unauthorized errors with token refresh
      if (response.status === 401 && !pendingRetries.has(requestId)) {
        // Generate a unique ID for this request if not provided
        const retryId = requestId || `retry-${Date.now()}`
        pendingRetries.add(retryId)

        console.log('Retrying request with new token', retryId)

        // Try to refresh the token
        const refreshed = await useAuthStore.getState().refreshTokens()

        if (refreshed) {
          // Remove from pending retries
          pendingRetries.delete(retryId)

          // Retry the original request with the new token
          // This will depend on your implementation details
          // You'll need to recreate the original request

          // Example for getAll:
          if (response.url.includes('/v1/companies')) {
            return await companyService.getAll() as unknown as T
          }
        }
      }

      throw new Error(errorData.message || `Error: ${response.status}`)
    } catch (e) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`)
    }
  }

  return response.json()
}

export const companyService = {

  async getAll(): Promise<Company[]> {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    const response = await fetch(`${API_URL}/v1/companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    const paginated = await handleResponse<Company[]>(response)
    return paginated.content
  },

  async create(company: Omit<Company, 'id'>): Promise<Company> {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    const response = await fetch(`${API_URL}/v1/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(company),
    })
    return handleResponse<Company>(response)
  },

  // Actualizar una empresa existente
  async update(id: string, company: Omit<Company, 'id'>): Promise<Company> {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(company),
    })
    return handleResponse<Company>(response)
  },

  // Eliminar una empresa
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      return handleResponse<void>(response)
    }
  },

}