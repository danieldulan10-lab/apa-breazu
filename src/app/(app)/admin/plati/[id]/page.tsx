'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'

// ---------------------------------------------------------------------------
// Mock data per payment ID
// ---------------------------------------------------------------------------
interface PaymentDetail {
  id: number
  familie: string
  perioada: string
  sumaDePlata: number
  sumaPlatita: number
  dataPlata: string
  nrReferinta: string
  metoda: string
  trimisaLa: string
  status: 'pending' | 'platit' | 'respins'
  dovadaFile: string
  istoric: { data: string; suma: number; status: 'platit' | 'respins' | 'pending' }[]
}

const mockPayments: Record<string, PaymentDetail> = {
  '1': {
    id: 1,
    familie: 'Iliescu Ioan',
    perioada: 'Oct-Nov 2025',
    sumaDePlata: 312.40,
    sumaPlatita: 312.40,
    dataPlata: '28.02.2026',
    nrReferinta: 'OP-2026-0187',
    metoda: 'Transfer bancar',
    trimisaLa: '28.02.2026, 10:15',
    status: 'platit',
    dovadaFile: 'chitanta-dulan.jpg',
    istoric: [
      { data: '15.12.2025', suma: 241.80, status: 'platit' },
      { data: '18.10.2025', suma: 198.44, status: 'platit' },
    ],
  },
  '3': {
    id: 3,
    familie: 'Ionescu Maria',
    perioada: 'Oct-Nov 2025',
    sumaDePlata: 341.50,
    sumaPlatita: 341.50,
    dataPlata: '26.02.2026',
    nrReferinta: 'OP-2026-0165',
    metoda: 'Transfer bancar',
    trimisaLa: '26.02.2026, 16:42',
    status: 'pending',
    dovadaFile: 'chitanta-ionescu.jpg',
    istoric: [
      { data: '10.12.2025', suma: 298.20, status: 'platit' },
      { data: '05.10.2025', suma: 275.10, status: 'platit' },
      { data: '12.08.2025', suma: 312.60, status: 'respins' },
    ],
  },
  '4': {
    id: 4,
    familie: 'Gheorghe Vasile',
    perioada: 'Oct-Nov 2025',
    sumaDePlata: 176.20,
    sumaPlatita: 176.20,
    dataPlata: '25.02.2026',
    nrReferinta: 'OP-2026-0158',
    metoda: 'Numerar',
    trimisaLa: '25.02.2026, 09:20',
    status: 'pending',
    dovadaFile: 'chitanta-gheorghe.jpg',
    istoric: [
      { data: '20.12.2025', suma: 152.40, status: 'platit' },
    ],
  },
  '8': {
    id: 8,
    familie: 'Stoica Ana',
    perioada: 'Oct-Nov 2025',
    sumaDePlata: 143.10,
    sumaPlatita: 143.10,
    dataPlata: '23.02.2026',
    nrReferinta: 'OP-2026-0142',
    metoda: 'Transfer bancar',
    trimisaLa: '23.02.2026, 14:32',
    status: 'pending',
    dovadaFile: 'chitanta-stoica.jpg',
    istoric: [
      { data: '08.12.2025', suma: 187.30, status: 'platit' },
      { data: '15.10.2025', suma: 165.80, status: 'platit' },
    ],
  },
}

// Default fallback for any ID
const defaultPayment: PaymentDetail = {
  id: 0,
  familie: 'Corbu Ciprian',
  perioada: 'Oct-Nov 2025',
  sumaDePlata: 286.49,
  sumaPlatita: 286.49,
  dataPlata: '15.02.2026',
  nrReferinta: 'OP-2026-0142',
  metoda: 'Transfer bancar',
  trimisaLa: '16.02.2026, 14:32',
  status: 'pending',
  dovadaFile: 'chitanta.jpg',
  istoric: [
    { data: '12.12.2025', suma: 241.80, status: 'platit' },
    { data: '10.10.2025', suma: 198.44, status: 'platit' },
    { data: '08.08.2025', suma: 312.60, status: 'respins' },
  ],
}

export default function PaymentReviewPage() {
  const params = useParams()
  const id = params.id as string
  const payment = mockPayments[id] ?? { ...defaultPayment, id: Number(id) || 0 }

  const [status, setStatus] = useState<'pending' | 'platit' | 'respins'>(payment.status)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionDone, setActionDone] = useState<'confirmed' | 'rejected' | null>(null)
  const [showHistoric, setShowHistoric] = useState(false)

  const handleConfirm = () => {
    setStatus('platit')
    setActionDone('confirmed')
    setShowRejectForm(false)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    setStatus('respins')
    setActionDone('rejected')
    setShowRejectForm(false)
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
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
          <h1 className="text-lg font-bold text-[#161513]">Verificare Plata</h1>
          <p className="text-xs text-[#161513]/50">Inapoi la lista plati</p>
        </div>
      </div>

      {/* Family Info Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B6B93] to-[#0F4C75] p-5 text-white shadow-sm">
        <p className="text-xs font-medium text-white/70">Familia</p>
        <h2 className="mt-1 text-xl font-bold">{payment.familie}</h2>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-white/80">
            Perioada: <span className="font-semibold text-white">{payment.perioada}</span>
          </p>
          <p className="text-sm text-white/80">
            Suma de plata: <span className="font-bold text-white">{payment.sumaDePlata.toFixed(2)} RON</span>
          </p>
        </div>
      </div>

      {/* Dovada Plata Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#161513]">Dovada Plata</h3>
          <StatusBadge status={status} />
        </div>

        {/* Image placeholder */}
        <div className="mt-3 flex h-48 items-center justify-center rounded-xl bg-[#F1EFED]">
          <div className="text-center">
            <svg className="mx-auto h-10 w-10 text-[#697778]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <p className="mt-2 text-xs text-[#697778]">Dovada plata - {payment.dovadaFile}</p>
          </div>
        </div>

        {/* Payment details */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#161513]/60">Suma platita</span>
            <span className="text-sm font-semibold text-[#161513]">{payment.sumaPlatita.toFixed(2)} RON</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#161513]/60">Data plata</span>
            <span className="text-sm font-medium text-[#161513]">{payment.dataPlata}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#161513]/60">Nr. referinta</span>
            <span className="text-sm font-medium text-[#161513]">{payment.nrReferinta}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#161513]/60">Metoda</span>
            <span className="text-sm font-medium text-[#161513]">{payment.metoda}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#161513]/60">Trimisa la</span>
            <span className="text-sm font-medium text-[#161513]">{payment.trimisaLa}</span>
          </div>
        </div>
      </div>

      {/* Action Result Messages */}
      {actionDone === 'confirmed' && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#508223]/10 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#508223]/20">
            <svg className="h-6 w-6 text-[#508223] animate-[scaleIn_0.3s_ease-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#508223]">Plata confirmata!</p>
            <p className="text-xs text-[#508223]/70">Familia va fi notificata automat.</p>
          </div>
        </div>
      )}

      {actionDone === 'rejected' && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#C74634]/10 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C74634]/20">
            <svg className="h-6 w-6 text-[#C74634]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#C74634]">Plata respinsa.</p>
            <p className="text-xs text-[#C74634]/70">Familia va fi notificata.</p>
          </div>
        </div>
      )}

      {/* Verification Buttons */}
      {!actionDone && status === 'pending' && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#508223] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#508223]/90 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Confirma Plata
          </button>

          {!showRejectForm ? (
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C74634] px-6 py-3 text-sm font-semibold text-[#C74634] transition hover:bg-[#C74634]/5 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Respinge
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-[#C74634]/20 bg-[#C74634]/5 p-4 space-y-3">
              <label className="block text-sm font-semibold text-[#C74634]">
                Motivul respingerii
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Suma nu corespunde cu factura..."
                rows={3}
                className="w-full rounded-xl border border-[#C74634]/20 bg-white px-4 py-3 text-sm text-[#161513] outline-none transition placeholder:text-[#161513]/30 focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/20"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[#161513]/20 px-4 py-2.5 text-sm font-medium text-[#161513]/60 transition hover:bg-[#F1EFED]"
                >
                  Anuleaza
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#C74634] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C74634]/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trimite Respingere
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment History - Collapsible */}
      <div className="rounded-2xl bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setShowHistoric(!showHistoric)}
          className="flex w-full items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#161513]">Istoric plati familie</h3>
          <svg
            className={`h-5 w-5 text-[#697778] transition-transform ${showHistoric ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showHistoric && (
          <div className="border-t border-[#F1EFED] px-5 pb-5">
            <ul className="divide-y divide-[#F1EFED]">
              {payment.istoric.map((h, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#161513]">{h.data}</p>
                    <p className="text-xs text-[#161513]/50">{h.suma.toFixed(2)} RON</p>
                  </div>
                  <StatusBadge status={h.status} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
