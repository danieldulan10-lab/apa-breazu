'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'

// ---------------------------------------------------------------------------
// Mock pending payments
// ---------------------------------------------------------------------------
interface PendingPayment {
  id: number
  familie: string
  perioada: string
  suma: number
  dataUpload: string
  dovadaFile: string
}

const initialPayments: PendingPayment[] = [
  { id: 1,  familie: 'Ionescu Maria',     perioada: 'Oct-Nov 2025', suma: 341.50, dataUpload: '26.02.2026', dovadaFile: 'chitanta-ionescu.jpg' },
  { id: 2,  familie: 'Gheorghe Vasile',   perioada: 'Oct-Nov 2025', suma: 176.20, dataUpload: '25.02.2026', dovadaFile: 'chitanta-gheorghe.jpg' },
  { id: 3,  familie: 'Stoica Ana',        perioada: 'Oct-Nov 2025', suma: 143.10, dataUpload: '23.02.2026', dovadaFile: 'chitanta-stoica.jpg' },
  { id: 4,  familie: 'Marin Florin',      perioada: 'Oct-Nov 2025', suma: 287.40, dataUpload: '22.02.2026', dovadaFile: 'chitanta-marin.jpg' },
  { id: 5,  familie: 'Petre Daniela',     perioada: 'Oct-Nov 2025', suma: 412.30, dataUpload: '21.02.2026', dovadaFile: 'chitanta-petre.jpg' },
  { id: 6,  familie: 'Voicu Andrei',      perioada: 'Oct-Nov 2025', suma: 198.77, dataUpload: '20.02.2026', dovadaFile: 'chitanta-voicu.jpg' },
  { id: 7,  familie: 'Neagu Constantin',  perioada: 'Oct-Nov 2025', suma: 325.60, dataUpload: '19.02.2026', dovadaFile: 'chitanta-neagu.jpg' },
  { id: 8,  familie: 'Dobre Mirela',      perioada: 'Oct-Nov 2025', suma: 260.80, dataUpload: '18.02.2026', dovadaFile: 'chitanta-dobre.jpg' },
]

type ActionStatus = 'pending' | 'confirmed' | 'rejected'

export default function ConfirmareRapidaPage() {
  const [actions, setActions] = useState<Record<number, ActionStatus>>({})
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const pendingPayments = initialPayments.filter((p) => !actions[p.id])
  const totalPending = pendingPayments.length
  const totalSuma = useMemo(
    () => pendingPayments.reduce((s, p) => s + p.suma, 0),
    [pendingPayments]
  )

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === pendingPayments.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pendingPayments.map((p) => p.id)))
    }
  }

  const confirmSingle = (id: number) => {
    setActions((prev) => ({ ...prev, [id]: 'confirmed' }))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const rejectSingle = (id: number) => {
    setActions((prev) => ({ ...prev, [id]: 'rejected' }))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const bulkConfirm = () => {
    const updates: Record<number, ActionStatus> = {}
    selected.forEach((id) => { updates[id] = 'confirmed' })
    setActions((prev) => ({ ...prev, ...updates }))
    setSelected(new Set())
  }

  const bulkReject = () => {
    const updates: Record<number, ActionStatus> = {}
    selected.forEach((id) => { updates[id] = 'rejected' })
    setActions((prev) => ({ ...prev, ...updates }))
    setSelected(new Set())
  }

  // Count processed
  const confirmedCount = Object.values(actions).filter((a) => a === 'confirmed').length
  const rejectedCount = Object.values(actions).filter((a) => a === 'rejected').length

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/plati"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#161513]/70 shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#161513]">Confirmare Rapida Plati</h1>
          <p className="text-xs text-[#161513]/50">Proceseaza platile in asteptare</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <p className="text-xs text-[#697778]">In asteptare</p>
          <p className="mt-1 text-2xl font-bold text-[#AC630C]">{totalPending}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm text-center">
          <p className="text-xs text-[#697778]">Total suma</p>
          <p className="mt-1 text-lg font-bold text-[#161513]">{totalSuma.toFixed(2)} RON</p>
        </div>
      </div>

      {/* Processed feedback */}
      {(confirmedCount > 0 || rejectedCount > 0) && (
        <div className="flex gap-3">
          {confirmedCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#508223]/10 px-3 py-1.5 text-xs font-semibold text-[#508223]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {confirmedCount} confirmate
            </div>
          )}
          {rejectedCount > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#C74634]/10 px-3 py-1.5 text-xs font-semibold text-[#C74634]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {rejectedCount} respinse
            </div>
          )}
        </div>
      )}

      {/* Select all */}
      {pendingPayments.length > 0 && (
        <button
          type="button"
          onClick={toggleSelectAll}
          className="text-sm font-medium text-[#1B6B93] hover:underline"
        >
          {selected.size === pendingPayments.length ? 'Deselecteaza tot' : 'Selecteaza tot'}
        </button>
      )}

      {/* Payment cards */}
      <div className="space-y-3">
        {pendingPayments.length === 0 && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#508223]/10">
              <svg className="h-8 w-8 text-[#508223]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#161513]">Toate platile au fost procesate!</p>
            <p className="mt-1 text-xs text-[#697778]">{confirmedCount} confirmate, {rejectedCount} respinse</p>
          </div>
        )}

        {pendingPayments.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleSelect(p.id)}
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition"
                style={{
                  borderColor: selected.has(p.id) ? '#1B6B93' : '#D1D5DB',
                  backgroundColor: selected.has(p.id) ? '#1B6B93' : 'transparent',
                }}
              >
                {selected.has(p.id) && (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#161513]">{p.familie}</h3>
                    <p className="text-xs text-[#697778]">{p.perioada} &middot; {p.dataUpload}</p>
                  </div>
                  <p className="text-lg font-bold text-[#161513]">{p.suma.toFixed(2)} <span className="text-xs font-semibold text-[#161513]/50">RON</span></p>
                </div>

                {/* Dovada thumbnail placeholder */}
                <div className="mt-2 flex h-16 items-center justify-center rounded-lg bg-[#F1EFED]">
                  <div className="flex items-center gap-2 text-xs text-[#697778]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    {p.dovadaFile}
                  </div>
                </div>

                {/* Quick action buttons */}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => confirmSingle(p.id)}
                    className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#508223] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#508223]/90 active:scale-[0.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Confirma
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectSingle(p.id)}
                    className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#C74634] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#C74634]/90 active:scale-[0.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Respinge
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bulk actions bar */}
      {selected.size > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <div className="mx-auto flex max-w-lg gap-3">
            <button
              type="button"
              onClick={bulkConfirm}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#508223] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#508223]/90 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Confirma ({selected.size})
            </button>
            <button
              type="button"
              onClick={bulkReject}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#C74634] px-4 py-3 text-sm font-semibold text-[#C74634] transition hover:bg-[#C74634]/5 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Respinge ({selected.size})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
