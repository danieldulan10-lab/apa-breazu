'use client'

import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { ChevronRight } from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock invoice data for current user
// ---------------------------------------------------------------------------
const mockFacturi = [
  {
    id: '1',
    perioada: 'Oct-Nov 2025',
    consum: 26.0,
    consumIndividual: 24.5,
    pierderi: 1.5,
    suma: 287.16,
    status: 'neplatit' as const,
  },
  {
    id: '2',
    perioada: 'Aug-Sep 2025',
    consum: 22.0,
    consumIndividual: 20.8,
    pierderi: 1.2,
    suma: 241.8,
    status: 'platit' as const,
  },
  {
    id: '3',
    perioada: 'Jun-Jul 2025',
    consum: 18.0,
    consumIndividual: 16.9,
    pierderi: 1.1,
    suma: 198.44,
    status: 'platit' as const,
  },
  {
    id: '4',
    perioada: 'Apr-Mai 2025',
    consum: 24.5,
    consumIndividual: 23.0,
    pierderi: 1.5,
    suma: 269.6,
    status: 'platit' as const,
  },
  {
    id: '5',
    perioada: 'Feb-Mar 2025',
    consum: 20.0,
    consumIndividual: 18.7,
    pierderi: 1.3,
    suma: 219.9,
    status: 'pending' as const,
  },
]

function sumaColor(status: string): string {
  switch (status) {
    case 'neplatit':
      return '#C74634'
    case 'pending':
      return '#AC630C'
    case 'platit':
      return '#508223'
    default:
      return '#161513'
  }
}

export default function FacturiPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      <h1 className="text-xl font-bold text-[#161513]">Istoricul Facturilor</h1>

      <div className="space-y-3">
        {mockFacturi.map((f) => (
          <Link
            key={f.id}
            href={`/user/facturi/${f.id}`}
            className="block rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99]"
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#161513]">
                {f.perioada}
              </h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={f.status} />
                <ChevronRight size={16} className="text-[#697778]" />
              </div>
            </div>

            {/* Consumption */}
            <p className="mt-2 text-sm text-[#697778]">
              Consum total: <span className="font-medium text-[#161513]">{f.consum.toFixed(2)} mc</span>
            </p>

            {/* Amount */}
            <p
              className="mt-2 text-2xl font-extrabold"
              style={{ color: sumaColor(f.status) }}
            >
              {f.suma.toFixed(2)}{' '}
              <span className="text-sm font-semibold opacity-60">RON</span>
            </p>

            {/* Details */}
            <p className="mt-2 text-xs text-[#697778]">
              Consum individual: {f.consumIndividual.toFixed(1)} mc &nbsp;|&nbsp; Pierderi: {f.pierderi.toFixed(1)} mc
            </p>

            {/* Upload payment proof button for unpaid */}
            {f.status === 'neplatit' && (
              <span
                className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-[#1B6B93] px-4 py-2.5 text-sm font-semibold text-[#1B6B93]"
              >
                Incarca Dovada Plata
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
