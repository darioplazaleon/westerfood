import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'


export default async function DashboardPage() {

  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  const sessionData = session ? JSON.parse(session) : null
  const userRole = sessionData?.user?.roles[0] || null

  if (userRole == 'admin_client_role') {
    redirect('/dashboard/empresas')
  } else if (userRole == 'rrhh_client_role') {
    redirect('/dashboard/empleados')
  }

  return (
    <div>
      <h1>Esto es el dashboard</h1>
    </div>
  )
}