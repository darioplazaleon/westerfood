'use client'

import { ColumnDef } from '@tanstack/table-core'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { CompanyFormModal } from '@/components/dashboard/admin/empresas/company-form-modal'
import { CompanyAlertDialog } from '@/components/dashboard/admin/empresas/company-alert-dialog'
import { CompanyDetails } from '@/components/dashboard/admin/empresas/company-details'

export type Company = {
  id: string,
  name: string,
  address: string,
  phone: string
}

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const company = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(company.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <CompanyDetails companyId={company.id} trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Ver Detalle</DropdownMenuItem>
            } />
            <CompanyFormModal title={'Actualizar Empresa'}
                              description={'Modifique los datos de la empresa'}
                              company={company}
                              trigger={<DropdownMenuItem onSelect={(e) => {
                                e.preventDefault()
                              }}>Editar</DropdownMenuItem>}
            />
            <CompanyAlertDialog company={company} trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Eliminar</DropdownMenuItem>
            } />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

