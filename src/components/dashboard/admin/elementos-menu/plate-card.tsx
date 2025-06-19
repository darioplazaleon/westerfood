import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { EntityDeleteAlert } from '@/components/dashboard/admin/elementos-menu/plate-delete-alert'

interface PlateCardProps<T extends { id: string; title: string; description: string }> {
  item: T
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>
  entityName: string
}

export function PlateCard<T extends { id: string; title: string; description: string }>({
                                                                                          item,
                                                                                          onDelete,
                                                                                          entityName,
                                                                                        }: PlateCardProps<T>) {
  return (
    <Card className="w-full">
      <CardContent className="flex justify-between">
        <div>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </div>
        <EntityDeleteAlert item={item} onDelete={onDelete} entityName={entityName} />
      </CardContent>
    </Card>
  )
}