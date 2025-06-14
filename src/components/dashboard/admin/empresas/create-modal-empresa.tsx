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
import { useState } from 'react'
import { Company } from './colums'
import { CompanyFormValues } from '@/lib/validations/company-form'
import { saveCompany } from '@/actions/company-actions'
import { CompanyForm } from '@/components/dashboard/admin/empresas/company-form'

interface CompanyFormModalProps {
  company?: Company | null
  title: string
  description: string
  onSuccess?: () => void
}

export function CreateModalEmpresa({ company, title, description, onSuccess }: CompanyFormModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="bg-red-600 text-white h-12">Añadir Empresa</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Empresa</DialogTitle>
          <DialogDescription>
            Complete el formulario para añadir una nueva empresa al sistema.
          </DialogDescription>
        </DialogHeader>

        <CompanyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} serverError={serverError} company={company} />
      </DialogContent>
    </Dialog>
  )
}
