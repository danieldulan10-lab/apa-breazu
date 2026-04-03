'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

// ---------------------------------------------------------------------------
// Mock payment data
// ---------------------------------------------------------------------------
type FilterType = 'toate' | 'confirmat' | 'pending' | 'neplatit'

interface MockPlata {
  id: number
  familie: string
  perioada: string
  suma: number
  data: string
  status: 'platit' | 'pending' | 'neplatit'
  dovadaUrl: string | null
}

const mockPlati: MockPlata[] = [
  { id: 1,  familie: 'Iliescu Ioan',      perioada: 'Oct-Nov 2025', suma: 312.40, data: '28.02.2026', status: 'platit',   dovadaUrl: '/mock/dovada-1.jpg' },
  { id: 2,  familie: 'Popescu Ion',       perioada: 'Oct-Nov 2025', suma: 287.16, data: '27.02.2026', status: 'platit',   dovadaUrl: '/mock/dovada-2.jpg' },
  { id: 3,  familie: 'Ionescu Maria',     perioada: 'Oct-Nov 2025', suma: 341.50, data: '26.02.2026', status: 'pending',  dovadaUrl: '/mock/dovada-3.jpg' },
  { id: 4,  familie: 'Gheorghe Vasile',   perioada: 'Oct-Nov 2025', suma: 176.20, data: '25.02.2026', status: 'pending',  dovadaUrl: '/mock/dovada-4.jpg' },
  { id: 5,  familie: 'Radu Elena',        perioada: 'Oct-Nov 2025', suma: 462.30, data: '24.02.2026', status: 'platit',   dovadaUrl: '/mock/dovada-5.jpg' },
  { id: 6,  familie: 'Stan Mihai',        perioada: 'Oct-Nov 2025', suma: 275.80, data: '',           status: 'neplatit', dovadaUrl: null },
  { id: 7,  familie: 'Popa Alexandru',    perioada: 'Oct-Nov 2025', suma: 384.60, data: '',           status: 'neplatit', dovadaUrl: null },
  { id: 8,  familie: 'Stoica Ana',        perioada: 'Oct-Nov 2025', suma: 143.10, data: '23.02.2026', status: 'pending',  dovadaUrl: '/mock/dovada-8.jpg' },
  { id: 9,  familie: 'Dumitru George',    perioada: 'Oct-Nov 2025', suma: 373.50, data: '22.02.2026', status: 'platit',   dovadaUrl: '/mock/dovada-9.jpg' },
  { id: 10, familie: 'Barbu Cristina',    perioada: 'Oct-Nov 2025', suma: 198.40, data: '',           status: 'neplatit', dovadaUrl: null },
]

const filterTabs: { key: FilterType; label: string }[] = [
  { key: 'toate', label: 'Toate' },
  { key: 'confirmat', label: 'Confirmate' },
  { key: 'pending', label: 'In asteptare' },
  { key: 'neplatit', label: 'Neplatite' },
]

// Map filter keys to status values for comparison
function matchesFilter(status: MockPlata['status'], filter: FilterType): boolean {
  if (filter === 'toate') return true
  if (filter === 'confirmat') return status === 'platit'
  return status === filter
}

export default function PlatiPage() {
  const [filter, setFilter] = useState<FilterType>('toate')
  const [localPlati, setLocalPlati] = useState(mockPlati)

  const filtered = useMemo(
    () => localPlati.filter((p) => matchesFilter(p.status, filter)),
    [filter, localPlati]
  )

  // Summary stats
  const totalIncasat = localPlati
    .filter((p) => p.status === 'platit')
    .reduce((s, p) => s + p.suma, 0)
  const totalDeIncasat = localPlati
    .filter((p) => p.status !== 'platit')
    .reduce((s, p) => s + p.suma, 0)
  const platiPending = localPlati.filter((p) => p.status === 'pending').length
  const totalExpected = localPlati.reduce((s, p) => s + p.suma, 0)

  const handleConfirm = (id: number) => {
    setLocalPlati((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'platit' as const } : p))
    )
  }

  const handleReject = (id: number) => {
    setLocalPlati((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'neplatit' as const } : p))
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#161513]">Gestionare Plati</h1>
        <Link
          href="/admin/plati/confirmare-rapida"
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#1B6B93] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
          Confirmare Rapida
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <p className="text-xs text-[#697778]">Total incasat</p>
          <p className="mt-1 text-lg font-bold text-[#508223]">
            {totalIncasat.toFixed(0)} RON
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <p className="text-xs text-[#697778]">De incasat</p>
          <p className="mt-1 text-lg font-bold text-[#C74634]">
            {totalDeIncasat.toFixed(0)} RON
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <p className="text-xs text-[#697778]">In asteptare</p>
          <p className="mt-1 text-lg font-bold text-[#AC630C]">
            {platiPending}
          </p>
        </div>
      </div>

      {/* Confirmed vs expected progress */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs text-[#697778]">
          <span>Confirmat aceasta perioada</span>
          <span>{totalIncasat.toFixed(0)} / {totalExpected.toFixed(0)} RON</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E8F4F8]">
          <div
            className="h-full rounded-full bg-[#508223] transition-all"
            style={{ width: `${totalExpected > 0 ? Math.round((totalIncasat / totalExpected) * 100) : 0}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[#508223] font-medium">
          {totalExpected > 0 ? Math.round((totalIncasat / totalExpected) * 100) : 0}% incasat
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === tab.key
                ? 'bg-[#1B6B93] text-white'
                : 'bg-white text-[#697778] hover:bg-[#E8F4F8]'
            }`}
            style={{ minHeight: 40 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[#697778]">
            Nicio plata in aceasta categorie.
          </p>
        )}

        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/admin/plati/${p.id}`}
            className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#161513]">
                  {p.familie}
                </h2>
                <p className="mt-0.5 text-sm text-[#697778]">
                  {p.perioada}
                  {p.data ? ` \u00B7 ${p.data}` : ''}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <p className="mt-2 text-xl font-bold text-[#161513]">
              {p.suma.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-[#161513]/50">
                RON
              </span>
            </p>

            {/* Dovada placeholder for pending */}
            {p.status === 'pending' && p.dovadaUrl && (
              <div className="mt-3">
                <div className="flex h-20 items-center justify-center rounded-xl bg-[#F1EFED] text-xs text-[#697778]">
                  Dovada plata (imagine)
                </div>
                <div className="mt-2 flex gap-2" onClick={(e) => e.preventDefault()}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleConfirm(p.id)
                    }}
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#508223] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#508223]/90 active:scale-[0.98]"
                  >
                    Confirma
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleReject(p.id)
                    }}
                    className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#C74634] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C74634]/90 active:scale-[0.98]"
                  >
                    Respinge
                  </button>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
