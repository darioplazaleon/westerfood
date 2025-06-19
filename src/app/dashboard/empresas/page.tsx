import { columns} from '@/components/dashboard/admin/empresas/colums'
import { DataTable } from '@/components/dashboard/admin/empresas/data-table'
import { getCompanies } from '@/actions/company-actions'


export default async function EmpresasPage() {

  const data = await getCompanies()

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}