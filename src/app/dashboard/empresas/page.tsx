'use client'

import { useQuery } from '@tanstack/react-query'
import { columns, Company } from '@/components/dashboard/admin/empresas/colums'
import { DataTable } from '@/components/dashboard/admin/empresas/data-table'
import { httpClient } from '@/lib/query-client'
import { Loader2 } from 'lucide-react'

// Client-side data fetching function
async function fetchCompanies(): Promise<Company[]> {
  const result = await httpClient('/v1/companies')
  
  // Handle paginated response
  if (result && typeof result === 'object' && 'content' in result) {
    return result.content as Company[]
  }
  
  // Handle direct array response
  if (Array.isArray(result)) {
    return result as Company[]
  }
  
  return []
}

export default function EmpresasPage() {
  const { 
    data: companies = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false
      }
      return failureCount < 3
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Cargando empresas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error al cargar las empresas</p>
            <button 
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={companies} />
    </div>
  )
}