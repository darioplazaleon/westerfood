import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { MainDish } from '@/lib/validations/main-dish-form'
import { DishDeleteAlert } from '@/components/dashboard/admin/elementos-menu/dish-delete-alert'

interface MainDishCardProps {
  dish: MainDish
}

export function MainDishCard({ dish }: MainDishCardProps) {

  return (
    <Card className="w-full">
      <CardContent className="flex justify-between">
        <div>
        <CardTitle>{dish.title}</CardTitle>
        <CardDescription>{dish.description}</CardDescription>
        </div>
        <DishDeleteAlert dish={dish}/>
      </CardContent>
    </Card>
  )
}