'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { DishForm } from '@/components/dashboard/admin/elementos-menu/dish-form'
import { toast } from 'sonner'
import { MainDishFormValues } from '@/lib/validations/main-dish-form'
import { saveDish } from '@/actions/main-dish-actions'

interface DishFormModalProps {
  title: string;
  description: string;
  onSuccess?: () => void;
}

export function DishFormModal({ title, description, onSuccess }: DishFormModalProps) {

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(data: MainDishFormValues) {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)

      const result = await saveDish(
        {
          errors: {},
          success: false,
        },
        formData,
      )


      if (result.success) {
        toast.success('Plato creado correctamente.')
        setIsOpen(false)
      } else {
        if (result.errors._form) {
          setServerError(result.errors._form)
        }
      }
    } catch (error) {
      setServerError('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-600 text-white h-10">Anadir Elemento</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DishForm onSubmit={handleSubmit} isSubmitting={isSubmitting} serverError={serverError} />
        </DialogContent>
      </Dialog>
    </>
  )

}