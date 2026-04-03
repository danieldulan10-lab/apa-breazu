'use client'

import { useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

// ---------------------------------------------------------------------------
// Mock payment history for current user
// ---------------------------------------------------------------------------
interface UserPayment {
  id: number
  perioada: string
  suma: number
  dataPlata: string
  status: 'confirmat' | 'pending' | 'respins'
  nrReferinta: string
  metoda: string
  dovadaFile: string
  motivRespingere?: string
}

const mockPayments: UserPayment[] = [
  {
    id: 1,
    perioada: 'Oct-Nov 2025',
    suma: 287.16,
    dataPlata: '28.02.2026',
    status: 'pending',
    nrReferinta: 'OP-2026-0187',
    metoda: 'Transfer bancar',
    dovadaFile: 'chitanta-oct-nov.jpg',
  },
  {
    id: 2,
    perioada: 'Aug-Sep 2025',
    suma: 241.80,
    dataPlata: '12.09.2025',
    status: 'confirmat',
    nrReferinta: 'OP-2025-0156',
    metoda: 'Transfer bancar',
    dovadaFile: 'chitanta-aug-sep.jpg',
  },
  {
    id: 3,
    perioada: 'Jun-Jul 2025',
    suma: 198.44,
    dataPlata: '15.07.2025',
    status: 'confirmat',
    nrReferinta: 'OP-2025-0123',
    metoda: 'Card',
    dovadaFile: 'chitanta-jun-jul.jpg',
  },
  {
    id: 4,
    perioada: 'Apr-Mai 2025',
    suma: 312.60,
    dataPlata: '20.05.2025',
    status: 'confirmat',
    nrReferinta: 'OP-2025-0098',
    metoda: 'Transfer bancar',
    dovadaFile: 'chitanta-apr-mai.jpg',
  },
  {
    id: 5,
    perioada: 'Feb-Mar 2025',
    suma: 205.80,
    dataPlata: '10.03.2025',
    status: 'respins',
    nrReferinta: 'OP-2025-0067',
    metoda: 'Numerar',
    dovadaFile: 'chitanta-feb-mar.jpg',
    motivRespingere: 'Suma nu corespunde cu factura',
  },
]

export default function UserPlatiPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const totalPlatit = mockPayments
    .filter((p) => p.status === 'confirmat')
    .reduce((s, p) => s + p.suma, 0)
  const confirmate = mockPayments.filter((p) => p.status === 'confirmat').length
  const inAsteptare = mockPayments.filter((p) => p.status === 'pending').length

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/user"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#161513]/70 shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#161513]">Istoricul Platilor</h1>
          <p className="text-xs text-[#161513]/50">Toate platile tale</p>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B6B93] to-[#0F4C75] p-5 text-white shadow-sm">
        <p className="text-xs font-medium text-white/70">Total platit (2025-2026)</p>
        <p className="mt-1 text-3xl font-bold">{totalPlatit.toFixed(2)} <span className="text-base font-semibold text-white/60">RON</span></p>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="text-xs text-white/60">Confirmate</p>
            <p className="text-lg font-bold">{confirmate}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">In asteptare</p>
            <p className="text-lg font-bold text-yellow-300">{inAsteptare}</p>
          </div>
        </div>
      </div>

      {/* Payment list */}
      <div className="space-y-3">
        {mockPayments.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Main row - tappable */}
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              className="flex w-full items-start justify-between p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#161513]">{p.perioada}</p>
                <p className="mt-0.5 text-xs text-[#697778]">
                  {p.dataPlata}
                </p>
                <p className="mt-1 text-xl font-bold text-[#161513]">
                  {p.suma.toFixed(2)} <span className="text-xs font-semibold text-[#161513]/50">RON</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={p.status} />
                <svg
                  className={`h-4 w-4 text-[#697778] transition-transform ${expandedId === p.id ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Status messages */}
            {p.status === 'respins' && p.motivRespingere && (
              <div className="mx-4 mb-3 rounded-xl bg-[#C74634]/10 px-3 py-2">
                <p className="text-xs font-medium text-[#C74634]">
                  Motiv respingere: {p.motivRespingere}
                </p>
              </div>
            )}
            {p.status === 'pending' && (
              <div className="mx-4 mb-3 rounded-xl bg-[#AC630C]/10 px-3 py-2">
                <p className="text-xs font-medium text-[#AC630C]">
                  In asteptare confirmare admin
                </p>
              </div>
            )}

            {/* Expanded details */}
            {expandedId === p.id && (
              <div className="border-t border-[#F1EFED] px-4 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#161513]/60">Nr. referinta</span>
                  <span className="text-xs font-medium text-[#161513]">{p.nrReferinta}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#161513]/60">Metoda</span>
                  <span className="text-xs font-medium text-[#161513]">{p.metoda}</span>
                </div>
                {/* Dovada thumbnail placeholder */}
                <div className="mt-1 flex h-20 items-center justify-center rounded-lg bg-[#F1EFED]">
                  <div className="flex items-center gap-2 text-xs text-[#697778]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    {p.dovadaFile}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
