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
import { Company } from './colums'
import { CompanyFormValues } from '@/lib/validations/company-form'
import { saveCompany } from '@/actions/company-actions'
import { CompanyForm } from '@/components/dashboard/admin/empresas/company-form'
import { toast } from 'sonner'

interface CompanyFormModalProps {
  company?: Company | null
  title: string
  description: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function CompanyFormModal({ company, title, description, trigger }: CompanyFormModalProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Define form with react-hook-form and zod validation
  async function handleSubmit(data: CompanyFormValues) {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const formData = new FormData()
      if (data.id) formData.append('id', data.id)
      formData.append('name', data.name)
      formData.append('address', data.address)
      formData.append('phone', data.phone)

      const result = await saveCompany(
        {
          errors: {},
          success: false,
        },
        formData,
      )


      if (result.success) {
        toast.success(data.id ? 'Empresa actualizada correctamente.' : 'Empresa creada correctamente.')
        setIsOpen(false)
      } else {
        // Manejar error general
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-red-600 text-white h-12">Añadir Empresa</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <CompanyForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          company={company}
        />
      </DialogContent>
    </Dialog>
  )
}
