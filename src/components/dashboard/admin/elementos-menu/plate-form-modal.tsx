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
import { PlateForm, PlateFormValues } from '@/components/dashboard/admin/elementos-menu/plate-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { dessertFormSchema } from '@/lib/validations/dessert-form'
import { mainDishFormSchema } from '@/lib/validations/main-dish-form'


interface EntityFormModalProps {
  title: string;
  description: string;
  buttonText: string;
  schemaType: 'dessert' | 'mainDish'
  saveEntity: (state: any, formData: FormData) => Promise<any>;
  successMessage: string;
}

export function PlateFormModal({
                                  title,
                                  description,
                                  buttonText,
                                  schemaType,
                                  saveEntity,
                                  successMessage
                                }: EntityFormModalProps) {
  const schema = schemaType === 'dessert' ? dessertFormSchema : mainDishFormSchema

  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(data: PlateFormValues) {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)

      const result = await saveEntity(
        {
          errors: {},
          success: false,
        },
        formData,
      )

      if (result.success) {
        toast.success(successMessage)
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
          <Button className="bg-red-600 text-white h-10">Añadir Elemento</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <PlateForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            serverError={serverError}
            schema={schema}
            buttonText={buttonText}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}