import { PaginatedResponse } from '@/types/dashboard'
import { PlateCard } from '@/components/dashboard/admin/elementos-menu/plate-card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PlateListProps<T extends { id: string; title: string; description: string }> {
  currentPage: number;
  data: PaginatedResponse<T>;
  basePath: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  entityName: string;
}

export default function PlateList<T extends { id: string; title: string; description: string }>({
                                                                                                   data,
                                                                                                   currentPage,
                                                                                                   basePath,
                                                                                                   onDelete,
                                                                                                   entityName,
                                                                                                 }: PlateListProps<T>) {
  const products = data.content
  const { totalPages, first, last } = data

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <PlateCard item={product} key={product.id} onDelete={onDelete} entityName={entityName} />
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {!first && (
              <PaginationItem>
                <PaginationPrevious href={currentPage > 2 ? `${basePath}?page=${currentPage - 1}` : basePath} />
              </PaginationItem>
            )}

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink href={basePath}>1</PaginationLink>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Página anterior */}
            {!first && (
              <PaginationItem>
                <PaginationLink href={currentPage > 2 ? `${basePath}?page=${currentPage - 1}` : basePath}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Página actual */}
            <PaginationItem>
              <PaginationLink href={`${basePath}?page=${currentPage}`} isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Página siguiente */}
            {!last && (
              <PaginationItem>
                <PaginationLink href={`${basePath}?page=${currentPage + 1}`}>{currentPage + 1}</PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis derecha */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Última página */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink href={`${basePath}?page=${totalPages}`}>{totalPages}</PaginationLink>
              </PaginationItem>
            )}

            {!last && (
              <PaginationItem>
                <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}