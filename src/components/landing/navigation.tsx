'use client'

import { usePathname } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NavItem } from '@/types/dashboard'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {

  const pathname = usePathname()

  return (
    <>
      <div className="flex gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href)

          if (item.hasSubmenu && item.submenuItems) {
            return (
              <DropdownMenu key={item.href}>
                <DropdownMenuTrigger className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md',
                  isActive ? 'bg-muted text-primary' : 'text-muted-foreground',
                )}>
                  {item.label}
                  <ChevronDown className="ml=1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.submenuItems.map((submenuItem) => (
                    <DropdownMenuItem key={submenuItem.href} asChild>
                      <Link href={submenuItem.href}
                            className={cn('w-full cursor-pointer', pathname === submenuItem.href && 'bg-muted font-medium')}>
                        {submenuItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }

          return (
            <Link key={item.href} href={item.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md',
                    isActive ? 'bg-muted text-primary' : 'text-muted-foreground',
                  )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </>
  )
}