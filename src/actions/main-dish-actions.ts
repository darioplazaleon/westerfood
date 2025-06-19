'use server'

import { mainDishService } from '@/lib/services/main-dish-api'
import { revalidatePath } from 'next/cache'
import { mainDishFormSchema, MainDishFormState } from '@/lib/validations/main-dish-form'

export async function getMainDishes(page = 0) {
  try {
    return await mainDishService.getAll(page)
  } catch (error) {
    console.error('Error al obtener empresas:', error)
    throw new Error('No se pudieron cargar las empresas')
  }
}

export async function saveDish(prevState: MainDishFormState, formData: FormData): Promise<MainDishFormState> {
  const rawFormData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
  }

  const validatedFields = mainDishFormSchema.safeParse(rawFormData)

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
    await mainDishService.create({ title, description })

    revalidatePath('/dashboard/elementos-menu/platos-principales')

    return {
      errors: {},
      success: true,
    }
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Ocurrió un error al procesar el formulario',
      },
      success: false,
    }
  }
}

export async function deleteDish(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await mainDishService.delete(id)

    // Revalidar la ruta para actualizar los datos
    revalidatePath('/dashboard/elementos-menu/platos-principales')

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ocurrió un error al eliminar el plato',
    }
  }
}