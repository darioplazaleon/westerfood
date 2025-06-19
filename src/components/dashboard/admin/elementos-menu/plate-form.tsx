"use client";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

export interface PlateFormValues {
  title: string;
  description: string;
}

interface PlateFormProps {
  onSubmit: (data: PlateFormValues) => Promise<void>
  isSubmitting: boolean
  serverError?: string | null
  schema: z.ZodType<any>
  buttonText?: string
}

export function PlateForm({ onSubmit, isSubmitting, serverError, schema, buttonText = "Crear" }: PlateFormProps) {
  const form = useForm<PlateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && <div className="text-sm font-medium text-destructive">{serverError}</div>}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del elemento" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del elemento" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : buttonText}
        </Button>
      </form>
    </Form>
  )
}