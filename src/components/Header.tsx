'use client'

import { useAuth } from '@/context/AuthContext'
import { LogOut } from 'lucide-react'

export default function Header() {
  const { familie, signOut } = useAuth()

  if (!familie) return null

  const rolLabel = familie.rol === 'admin' ? 'Admin' : 'Utilizator'

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'linear-gradient(135deg, #0F4C75 0%, #1B6B93 100%)',
        minHeight: 56,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label="water">
            💧
          </span>
          <h1 className="text-white font-bold text-lg tracking-tight">
            ApaGalbenelelor
          </h1>
        </div>

        {/* Right: user info + logout */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-white text-sm font-medium leading-tight capitalize">
              {familie.nume}
            </p>
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
              style={{
                backgroundColor:
                  familie.rol === 'admin'
                    ? 'rgba(255,255,255,0.25)'
                    : 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
              }}
            >
              {rolLabel}
            </span>
          </div>
          <button
            onClick={signOut}
            className="ml-1 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Deconectare"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <LogOut size={18} className="text-white/80" />
          </button>
        </div>
      </div>
    </header>
  )
}
