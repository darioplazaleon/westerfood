"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { companyFormSchema, type CompanyFormValues, type Company } from "@/lib/validations/company-form"
import { useEffect } from "react"

interface CompanyFormProps {
  onSubmit: (data: CompanyFormValues) => Promise<void>
  isSubmitting: boolean
  serverError?: string | null
  company?: Company | null // Empresa para editar (opcional)
}

export function CompanyForm({ onSubmit, isSubmitting, serverError, company }: CompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      id: company?.id || undefined,
      name: company?.name || "",
      address: company?.address || "",
      phone: company?.phone || "",
    },
  })

  // Actualizar el formulario cuando cambia la empresa
  useEffect(() => {
    if (company) {
      form.reset({
        id: company.id,
        name: company.name,
        address: company.address,
        phone: company.phone,
      })
    }
  }, [company, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error general del servidor */}
        {serverError && <div className="text-sm font-medium text-destructive">{serverError}</div>}

        {/* Campo oculto para el ID */}
        {company?.id && <input type="hidden" name="id" value={company.id} />}

        {/* Campo de nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de dirección */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección de la empresa" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Teléfono de contacto" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : company ? "Actualizar empresa" : "Crear empresa"}
        </Button>
      </form>
    </Form>
  )
}
