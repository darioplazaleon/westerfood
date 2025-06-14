import { Company } from '@/lib/validations/company-form'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || `Error: ${response.status}`)
    } catch (e) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`)
    }
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

export const companyService = {

  async getAll(): Promise<Company[]> {
    const token = await getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${API_URL}/v1/companies`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data on each request
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

  async create(company: Omit<Company, 'id'>): Promise<Company> {
    const token = await getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

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

  async update(id: string, company: Omit<Company, 'id'>): Promise<Company> {
    const token = await getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${API_URL}/v1/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(company),
    })
    
    return handleResponse<Company>(response)
  },

  async delete(id: string): Promise<void> {
    const token = await getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token available')
    }

    const response = await fetch(`${API_URL}/v1/companies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      await handleResponse<void>(response)
    }
  },
}