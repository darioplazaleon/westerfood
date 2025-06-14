import {z} from 'zod';

export const companyFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().min(1, "La dirección es obligatoria"),
  phone: z.string().regex(/^\d{9,10}$/, "El teléfono debe tener 9 o 10 dígitos"),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyFormState = {
  errors?: {
    name?: string
    address?: string
    phone?: string
    _form?: string
  }
  success: boolean
}

export type Company = {
  id: string
  name: string
  address: string
  phone: string
}