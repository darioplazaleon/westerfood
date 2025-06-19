'use client'

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { TrashIcon } from 'lucide-react'
import { MainDish } from '@/lib/validations/main-dish-form'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { deleteDish } from '@/actions/main-dish-actions'

interface DishDeleteAlertProps {
  dish: MainDish
}

export function DishDeleteAlert({ dish }: DishDeleteAlertProps) {

  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
    if (!dish?.id) {
      toast.error('ID de plato no válido')
      return
    }

    try {
      const result = await deleteDish(dish.id)

      if (result.success) {
        toast.success('Plato eliminado correctamente.')
        setIsOpen(false)
      } else {
        toast.error(result.error || 'Ocurrió un error al eliminar el plato.')
      }
    } catch (err) {
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
          <AlertDialogTitle>Eliminar plato</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar {dish.title}? Esta acción no se puede deshacer.
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