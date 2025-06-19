"use client";

import { mainDishFormSchema, MainDishFormValues } from '@/lib/validations/main-dish-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DishFormProps {
  onSubmit: (data: MainDishFormValues) => Promise<void>
  isSubmitting: boolean
  serverError?: string | null
}

export function DishForm({ onSubmit, isSubmitting, serverError}: DishFormProps) {
  const form = useForm<MainDishFormValues>({
    resolver: zodResolver(mainDishFormSchema),
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
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del plato" {...field} autoComplete="off"/>
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
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input placeholder="Descripcion del plato" {...field} autoComplete="off"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Crear plato"}
        </Button>
      </form>
    </Form>
  )

}