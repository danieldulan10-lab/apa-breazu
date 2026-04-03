'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, familie, loading, needsPasswordReset } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (
      !loading &&
      user &&
      needsPasswordReset &&
      pathname !== '/reset-parola-obligatorie'
    ) {
      router.replace('/reset-parola-obligatorie')
    }
  }, [user, loading, needsPasswordReset, pathname, router])

  if (loading) {
    return (
      <div
        className="flex flex-1 items-center justify-center"
        style={{ minHeight: '100dvh', backgroundColor: '#F1EFED' }}
      >
        <div className="spinner" />
      </div>
    )
  }

  if (!user || !familie) {
    return null
  }

  // If needs password reset, render the children without nav (the reset page)
  if (needsPasswordReset && pathname === '/reset-parola-obligatorie') {
    return (
      <div
        className="flex flex-col"
        style={{ minHeight: '100dvh', backgroundColor: '#F1EFED' }}
      >
        <main className="flex-1 overflow-y-auto px-4 py-4">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', backgroundColor: '#F1EFED' }}
    >
      <Header />
      <main
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ paddingBottom: 80 }}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
