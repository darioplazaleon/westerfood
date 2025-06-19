import Link from 'next/link'
import Image from 'next/image'
import { UserMenuNav } from '@/components/landing/user-menu-nav'
import { cookies } from 'next/headers'
import { getNavigationItems } from '@/lib/utils'
import { Navigation } from '@/components/landing/navigation'

export  async function Navbar() {

  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  const sessionData = session ? JSON.parse(session) : null
  const userRole = sessionData?.user?.roles[0] || null

  const navItems = getNavigationItems(userRole)

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/wf-logo-horizontal.svg" alt="WesterFood" width={150} height={45}
                   className="h-10 w-auto" />
          </Link>
          <Navigation items={navItems}/>
          <UserMenuNav />
        </div>
      </nav>
    </header>
  )
}