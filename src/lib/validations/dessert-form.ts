import { z } from 'zod';

export const dessertFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
});

export type DessertFormValues = z.infer<typeof dessertFormSchema>;

export type DessertFormState = {
  errors?: {
    title?: string
    description?: string
    _form?: string
  }
  success: boolean
}

export type Dessert = {
  id: string
  title: string
  description: string
}