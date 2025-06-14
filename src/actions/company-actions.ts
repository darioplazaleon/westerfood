"use server"

import { companyFormSchema, type CompanyFormState } from "@/lib/validations/company-form"
import { companyService } from "@/lib/services/company-api"
import { revalidatePath } from "next/cache"

// Server Action para obtener todas las empresas
export async function getCompanies() {
  try {
    return await companyService.getAll()
  } catch (error) {
    console.error("Error al obtener empresas:", error)
    throw new Error("No se pudieron cargar las empresas")
  }
}

// Server Action para obtener una empresa por ID
// export async function getCompanyById(id: string) {
//   try {
//     return await companyService.getById(id)
//   } catch (error) {
//     console.error(`Error al obtener empresa ${id}:`, error)
//     throw new Error("No se pudo cargar la empresa")
//   }
// }

// Server Action para crear o actualizar una empresa
export async function saveCompany(prevState: CompanyFormState, formData: FormData): Promise<CompanyFormState> {
  const rawFormData = {
    id: formData.get("id") === null ? undefined : (formData.get("id") as string),
    name: formData.get("name") as string,
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
  }

  const validatedFields = companyFormSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors

    return {
      errors: {
        name: fieldErrors.name?.[0],
        address: fieldErrors.address?.[0],
        phone: fieldErrors.phone?.[0],
      },
      success: false,
    }
  }

  const { id, name, address, phone } = validatedFields.data

  try {
    if (id == null) {
      console.log("Creando empresa")
      await companyService.create({ name, address, phone })
    } else {
      console.log("Actualizando empresa")
      await companyService.update(id, { name, address, phone })
    }

    revalidatePath("/dashboard/empresas")

    return {
      errors: {},
      success: true,
    }
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : "Ocurrió un error al procesar el formulario",
      },
      success: false,
    }
  }
}

// Server Action para eliminar una empresa
export async function deleteCompany(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await companyService.delete(id)

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ocurrió un error al eliminar la empresa",
    }
  }
}
