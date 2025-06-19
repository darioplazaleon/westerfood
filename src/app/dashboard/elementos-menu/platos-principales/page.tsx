import { deleteDish, getMainDishes, saveDish } from '@/actions/main-dish-actions'
import PlateList from '@/components/dashboard/admin/elementos-menu/plate-list'
// import { Skeleton } from '@/components/ui/skeleton'
import { PlateFormModal } from '@/components/dashboard/admin/elementos-menu/plate-form-modal'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function PlatosPrincipalesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = Number(params.page) || 1

  const apiPage = currentPage - 1

  const data = await getMainDishes(apiPage)

  return (
    <div className="flex flex-col gap-4 w-4/5 mt-5">
      <div className="flex justify-between items-center">
        <p className="text-xl">Platos Principales</p>
        <PlateFormModal
          title={'Crear Plato Principal'}
          description={'Complete los datos para crear un nuevo plato principal'}
          buttonText={'Crear Plato'}
          schemaType="mainDish"
          saveEntity={saveDish}
          successMessage={'Plato principal creado correctamente'}
        />
      </div>
      {/*<Suspense fallback={<ProductListSkeleton />}>*/}
      <PlateList
        data={data}
        currentPage={currentPage}
        basePath={'/dashboard/elementos-menu/platos-principales'}
        onDelete={deleteDish}
        entityName={'Plato Principal'}
      />
      {/*</Suspense>*/}
    </div>
  )
}

// function ProductListSkeleton() {
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {Array.from({ length: 10 }).map((_, i) => (
//           <div key={i} className="border rounded-lg p-4 space-y-3">
//             <Skeleton className="h-48 w-full" />
//             <Skeleton className="h-4 w-3/4" />
//             <Skeleton className="h-4 w-1/2" />
//             <Skeleton className="h-6 w-1/4" />
//           </div>
//         ))}
//       </div>
//       <div className="flex justify-center">
//         <Skeleton className="h-10 w-80" />
//       </div>
//     </div>
//   )
// }