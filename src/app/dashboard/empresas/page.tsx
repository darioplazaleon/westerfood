import { columns, Company } from '@/components/dashboard/admin/empresas/colums'
import { DataTable } from '@/components/dashboard/admin/empresas/data-table'
import { companyService } from '@/lib/services/company-api'

async function getData(): Promise<Company[]> {
  return companyService.getAll()
}

export default async function EmpresasPage() {
  const data = await getData()

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}