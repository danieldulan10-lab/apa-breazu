'use client'

import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-[#697778]/40">{icon}</div>
      <h3 className="text-lg font-semibold text-[#161513]">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-[#697778]">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn-primary mt-6"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
