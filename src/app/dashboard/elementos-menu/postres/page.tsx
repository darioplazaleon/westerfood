import { deleteDessert, getDesserts, saveDessert } from '@/actions/dessert-actions'
import { PlateFormModal } from '@/components/dashboard/admin/elementos-menu/plate-form-modal'
import PlateList from '@/components/dashboard/admin/elementos-menu/plate-list'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function Postres({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const apiPage = currentPage - 1

  const data = await getDesserts(apiPage)

  return (
    <div className="flex flex-col gap-4 w-4/5 mt-5">
      <div className="flex justify-between items-center">
        <p className="text-xl">Platos Principales</p>
        <PlateFormModal
          title="Crear Postre"
          description="Complete los datos para crear un nuevo postre"
          buttonText="Crear postre"
          schemaType="dessert"
          saveEntity={saveDessert}
          successMessage="Postre creado correctamente"
        />
      </div>
      <PlateList
        data={data}
        currentPage={currentPage}
        basePath="/dashboard/elementos-menu/postres"
        onDelete={deleteDessert}
        entityName="Postre"
      />
    </div>
  )
}