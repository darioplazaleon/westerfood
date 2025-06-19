'use server'

import { PaginatedResponse } from '@/types/dashboard'
import { dessertService } from '@/lib/services/dessert-api'
import { Dessert, dessertFormSchema, DessertFormState } from '@/lib/validations/dessert-form'
import { revalidatePath } from 'next/cache'

export async function getDesserts(page = 0): Promise<PaginatedResponse<Dessert>> {
  try {
    return await dessertService.getAll(page) as PaginatedResponse<Dessert>
  } catch (error) {
    console.error('Error al obtener postres:', error)
    throw new Error('No se pudieron cargar los postres')
  }
}

export async function saveDessert(
  prevState: DessertFormState,
  formData: FormData
): Promise<DessertFormState> {
  const rawFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
  }

  const validatedFields = dessertFormSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors

    return {
      errors: {
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
      },
      success: false,
    }
  }

  const { title, description } = validatedFields.data

  try {
    await dessertService.create({ title, description })
    revalidatePath('/dashboard/elementos-menu/postres')
    return { errors: {}, success: true }
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Ocurrió un error al procesar el formulario',
      },
      success: false,
    }
  }
}

export async function deleteDessert(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await dessertService.delete(id)
    revalidatePath('/dashboard/elementos-menu/postres')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ocurrió un error al eliminar el postre',
    }
  }
}