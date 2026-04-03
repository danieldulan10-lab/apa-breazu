'use client'

import { ReactNode } from 'react'

type StatColor = 'blue' | 'green' | 'orange' | 'red'

const colorMap: Record<StatColor, { border: string; value: string }> = {
  blue:   { border: 'border-t-[#1B6B93]', value: 'text-[#1B6B93]' },
  green:  { border: 'border-t-[#508223]', value: 'text-[#508223]' },
  orange: { border: 'border-t-[#AC630C]', value: 'text-[#AC630C]' },
  red:    { border: 'border-t-[#C74634]', value: 'text-[#C74634]' },
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color: StatColor
  icon?: ReactNode
}

export default function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={`rounded-xl border-t-4 ${colors.border} bg-white p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-[#161513]/60">
          {title}
        </p>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className={`mt-2 text-2xl font-bold ${colors.value}`}>{value}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-[#161513]/50">{subtitle}</p>
      )}
    </div>
  )
}
