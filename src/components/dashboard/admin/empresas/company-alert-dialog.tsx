import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Company } from '@/components/dashboard/admin/empresas/colums'
import React, { useState } from 'react'
import { deleteCompany } from '@/actions/company-actions'
import { toast } from 'sonner'

interface CompanyAlertDialogProps {
  company?: Company | null
  trigger?: React.ReactNode
}

export function CompanyAlertDialog({ company, trigger }: CompanyAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    if (!company?.id) {
      toast.error('ID de empresa no válido')
      return
    }

    try {
      const result = await deleteCompany(company.id)

      if (result.success) {
        toast.success('Empresa eliminada correctamente.')
        setIsOpen(false)
      } else {
        toast.error(result.error || 'Ocurrió un error al eliminar la empresa.')
      }
    } catch (err) {
      toast.error('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        {trigger ||
          <button className="text-red-500 hover:text-red-700">
            Eliminar
          </button>
        }
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar empresa</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar {company?.name}? Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}