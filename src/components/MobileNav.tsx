'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Home,
  FileText,
  Camera,
  Bell,
  BarChart3,
  Users,
  Wallet,
  Settings,
} from 'lucide-react'

interface NavTab {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  accent?: boolean
  badge?: number
}

const userTabs: NavTab[] = [
  { href: '/user', label: 'Acasa', icon: Home },
  { href: '/user/facturi', label: 'Facturi', icon: FileText },
  { href: '/user/raportare-index', label: 'Scan', icon: Camera, accent: true },
  { href: '/user/notificari', label: 'Notificari', icon: Bell, badge: 4 },
]

const adminTabs: NavTab[] = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/familii', label: 'Familii', icon: Users },
  { href: '/admin/plati', label: 'Plati', icon: Wallet, badge: 3 },
  { href: '/admin/setari', label: 'Setari', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { familie } = useAuth()

  const tabs = familie?.rol === 'admin' ? adminTabs : userTabs

  return (
    <nav
      className="sticky bottom-0 z-50 border-t bg-white"
      style={{
        borderColor: '#E5E7EB',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-end justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== '/' && pathname.startsWith(tab.href))
          const Icon = tab.icon

          if (tab.accent) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-4 transition-transform duration-150 active:scale-90"
                style={{ minWidth: 56, minHeight: 56 }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: isActive ? '#0F4C75' : '#1B6B93',
                    boxShadow: '0 2px 8px rgba(27, 107, 147, 0.4)',
                  }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <span
                  className="text-xs mt-0.5 font-medium"
                  style={{ color: isActive ? '#0F4C75' : '#697778' }}
                >
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center py-2 transition-transform duration-150 active:scale-90"
              style={{ minWidth: 56, minHeight: 48 }}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive ? 'text-[#1B6B93]' : 'text-[#697778]'}
                />
                {/* Badge */}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C74634] px-0.5 text-[10px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: isActive ? '#1B6B93' : '#697778' }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="rounded-full mt-0.5"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: '#1B6B93',
                  }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
