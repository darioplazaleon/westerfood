'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface PlateDeleteAlertProps<T extends { id: string; title: string }> {
  item: T;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  entityName: string;
}

export function EntityDeleteAlert<T extends { id: string; title: string }>({
                                                                             item,
                                                                             onDelete,
                                                                             entityName,
                                                                           }: PlateDeleteAlertProps<T>) {

  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    if (!item?.id) {
      toast.error(`ID de ${entityName} no válido`)
      return
    }

    try {
      const result = await onDelete(item.id)

      if (result.success) {
        toast.success(`${entityName} eliminado correctamente.`)
        setIsOpen(false)
      } else {
        toast.error(result.error || `Ocurrió un error al eliminar el ${entityName}.`)
      }
    } catch (err) {
      console.error('Error al eliminar:', err)
      toast.error('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button>
          <TrashIcon className="text-red-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar {entityName}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar {item.title}? Esta acción no se puede deshacer.
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