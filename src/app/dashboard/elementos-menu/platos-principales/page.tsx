import { getMainDishes } from '@/actions/main-dish-actions'
import PlatosPrincipalesList from '@/components/dashboard/admin/elementos-menu/platos-principales-list'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { DishFormModal } from '@/components/dashboard/admin/elementos-menu/dish-form-modal'

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
        <DishFormModal title={'Anadir Plato Principal'} description={''} />
      </div>
      {/*<Suspense fallback={<ProductListSkeleton />}>*/}
        <PlatosPrincipalesList data={data} currentPage={currentPage} />
      {/*</Suspense>*/}
    </div>
  )
}

function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-80" />
      </div>
    </div>
  )
}