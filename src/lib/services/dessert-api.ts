import { createEntityService } from '@/lib/services/entity-service-factory'
import { Dessert } from '@/lib/validations/dessert-form'
import { PaginatedResponse } from '@/types/dashboard'

export const dessertService = createEntityService<Dessert>('desserts')

export async function getDessertsPaginated(page = 0): Promise<PaginatedResponse<Dessert>> {
  return await dessertService.getAll(page) as PaginatedResponse<Dessert>
}