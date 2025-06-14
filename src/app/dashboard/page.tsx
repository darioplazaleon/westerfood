'use client'

import { useAuthStore } from '@/lib/auth-store'
import { getRelevantRoles } from '@/lib/utils'

export default function DashboardPage() {

  const { user } = useAuthStore()
  const relevantRoles = getRelevantRoles(user?.roles)
  console.log('Relevant Roles:', relevantRoles)

  return (
    <div>
      <h1>Esto es el dashboard</h1>
    </div>
  )
}