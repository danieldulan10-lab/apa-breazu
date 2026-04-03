'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Config per type
// ---------------------------------------------------------------------------
const typeConfig: Record<ToastType, {
  icon: typeof CheckCircle
  bg: string
  border: string
  text: string
}> = {
  success: {
    icon: CheckCircle,
    bg: 'bg-[#E8F5E9]',
    border: 'border-[#508223]',
    text: 'text-[#508223]',
  },
  error: {
    icon: AlertOctagon,
    bg: 'bg-[#FEE2E0]',
    border: 'border-[#C74634]',
    text: 'text-[#C74634]',
  },
  info: {
    icon: Info,
    bg: 'bg-[#E8F4F8]',
    border: 'border-[#1B6B93]',
    text: 'text-[#1B6B93]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[#FFF3E0]',
    border: 'border-[#AC630C]',
    text: 'text-[#AC630C]',
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter')
  const config = typeConfig[type]
  const Icon = config.icon

  const startExit = useCallback(() => {
    setPhase('exit')
    setTimeout(onClose, 300)
  }, [onClose])

  // Enter animation
  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 20)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(startExit, duration)
    return () => clearTimeout(t)
  }, [duration, startExit])

  const animClass =
    phase === 'enter'
      ? 'translate-y-4 opacity-0'
      : phase === 'exit'
        ? 'translate-y-4 opacity-0'
        : 'translate-y-0 opacity-100'

  return (
    <div
      className={`fixed bottom-[100px] left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ease-out ${animClass}`}
      role="alert"
    >
      <div
        className={`flex items-center gap-3 rounded-xl border-l-4 ${config.border} ${config.bg} px-4 py-3 shadow-lg`}
        style={{ minWidth: 280, maxWidth: 'calc(100vw - 2rem)' }}
      >
        <Icon size={20} className={`shrink-0 ${config.text}`} />
        <p className={`flex-1 text-sm font-medium ${config.text}`}>{message}</p>
        <button
          type="button"
          onClick={startExit}
          className={`shrink-0 rounded-full p-1 transition hover:bg-black/5 ${config.text}`}
          aria-label="Inchide"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
