'use client'

type StatusType =
  | 'neplatit'
  | 'pending'
  | 'platit'
  | 'confirmat'
  | 'respins'
  | 'raportat'
  | 'neraportat'

const statusConfig: Record<StatusType, { label: string; bg: string; text: string }> = {
  neplatit:   { label: 'Neplatit',   bg: 'bg-[#C74634]/15', text: 'text-[#C74634]' },
  respins:    { label: 'Respins',    bg: 'bg-[#C74634]/15', text: 'text-[#C74634]' },
  pending:    { label: 'In asteptare', bg: 'bg-[#AC630C]/15', text: 'text-[#AC630C]' },
  platit:     { label: 'Platit',     bg: 'bg-[#508223]/15', text: 'text-[#508223]' },
  confirmat:  { label: 'Confirmat',  bg: 'bg-[#508223]/15', text: 'text-[#508223]' },
  raportat:   { label: 'Raportat',   bg: 'bg-[#508223]/15', text: 'text-[#508223]' },
  neraportat: { label: 'Neraportat', bg: 'bg-[#6B7280]/15', text: 'text-[#6B7280]' },
}

interface StatusBadgeProps {
  status: StatusType
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}
