'use client'

import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import { useAuth } from '@/context/AuthContext'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const mockUser = {
  perioadaCurenta: 'Oct-Nov 2025',
  indexCurent: 987.0,
  indexAnterior: 961.0,
  consumIndividual: 26.0,
  consumMedieRetea: 22.5,
  sumaPlata: 287.16,
  statusPlata: 'neplatit' as const,
  statusIndex: 'raportat' as const,
  dataRaportare: '28.02.2026',
  deadlineRaportare: '05.03.2026',
  facturi: [
    { perioada: 'Oct-Nov 2025', suma: 287.16, status: 'neplatit' as const },
    { perioada: 'Aug-Sep 2025', suma: 241.80, status: 'platit' as const },
    { perioada: 'Jun-Jul 2025', suma: 198.44, status: 'platit' as const },
  ],
}

export default function UserDashboard() {
  const { familie } = useAuth()
  const u = mockUser
  const displayName = familie?.nume ?? 'Utilizator'
  const consumPercent = Math.min(
    100,
    Math.round((u.consumIndividual / (u.consumMedieRetea * 1.5)) * 100)
  )
  const avgPercent = Math.min(
    100,
    Math.round((u.consumMedieRetea / (u.consumMedieRetea * 1.5)) * 100)
  )

  // Mock payment status flags
  const pendingPayment = true
  const rejectedPayment = false
  const rejectedMotiv = 'Suma nu corespunde cu factura'

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* ----------------------------------------------------------------- */}
      {/* Payment status banners                                            */}
      {/* ----------------------------------------------------------------- */}
      {pendingPayment && !rejectedPayment && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#AC630C]/10 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#AC630C]/20">
            <svg className="h-4 w-4 text-[#AC630C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#AC630C]">Dovada platii in asteptare confirmare</p>
        </div>
      )}

      {rejectedPayment && (
        <div className="flex items-start gap-3 rounded-2xl bg-[#C74634]/10 px-4 py-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C74634]/20">
            <svg className="h-4 w-4 text-[#C74634]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#C74634]">Plata respinsa: {rejectedMotiv}</p>
            <Link href="/user/dovada-plata" className="mt-1 text-sm font-medium text-[#C74634] underline">
              Incarca o noua dovada
            </Link>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Hero card                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B6B93] to-[#0F4C75] p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-white/70">Bine ai venit</p>
        <h1 className="mt-1 text-2xl font-bold">Buna, {displayName}</h1>
        <p className="mt-2 text-sm text-white/80">
          Perioada: {u.perioadaCurenta}
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Suma de plata                                                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#161513]/60">Suma de plata</p>
          <StatusBadge status={u.statusPlata} />
        </div>
        <p className="mt-3 text-4xl font-extrabold text-[#161513]">
          {u.sumaPlata.toFixed(2)}{' '}
          <span className="text-lg font-semibold text-[#161513]/50">RON</span>
        </p>
        <p className="mt-1 text-xs text-[#161513]/50">
          Ultima factura &mdash; {u.perioadaCurenta}
        </p>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Index apometru                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[#161513]/60">
            Index apometru
          </p>
          <StatusBadge status={u.statusIndex} />
        </div>
        <p className="mt-3 text-3xl font-bold text-[#1B6B93]">
          {u.indexCurent.toFixed(2)}{' '}
          <span className="text-base font-semibold text-[#1B6B93]/50">mc</span>
        </p>
        {u.statusIndex === 'raportat' ? (
          <p className="mt-1 text-xs text-[#508223]">
            Raportat {u.dataRaportare}
          </p>
        ) : (
          <p className="mt-1 text-xs text-[#C74634]">
            Neraportat &mdash; deadline {u.deadlineRaportare}
          </p>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Consum                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-[#161513]/60">
          Consum aceasta perioada
        </p>
        <p className="mt-3 text-3xl font-bold text-[#161513]">
          {u.consumIndividual.toFixed(2)}{' '}
          <span className="text-base font-semibold text-[#161513]/50">mc</span>
        </p>

        {/* Bar comparison */}
        <div className="mt-4 space-y-2">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-[#161513]/60">
              <span>Tu</span>
              <span>{u.consumIndividual} mc</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8F4F8]">
              <div
                className="h-full rounded-full bg-[#1B6B93] transition-all"
                style={{ width: `${consumPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-[#161513]/60">
              <span>Media retea</span>
              <span>{u.consumMedieRetea} mc</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E8F4F8]">
              <div
                className="h-full rounded-full bg-[#1B6B93]/30 transition-all"
                style={{ width: `${avgPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Action buttons                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="space-y-3">
        <Link
          href="/user/raportare-index"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#1B6B93] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
        >
          Raporteaza Index Nou
        </Link>
        <Link
          href="/user/dovada-plata"
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-[#1B6B93] px-6 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          Incarca Dovada Plata
        </Link>
        <Link
          href="/user/plati"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#161513]/15 px-6 py-3 text-sm font-semibold text-[#161513]/70 transition hover:bg-[#F1EFED] active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Istoric Plati
        </Link>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Ultimele facturi                                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">
          Ultimele facturi
        </h2>
        <ul className="mt-3 divide-y divide-[#F1EFED]">
          {u.facturi.map((f, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[#161513]">
                  {f.perioada}
                </p>
                <p className="text-xs text-[#161513]/50">
                  {f.suma.toFixed(2)} RON
                </p>
              </div>
              <StatusBadge status={f.status} />
            </li>
          ))}
        </ul>
        <Link
          href="/user/facturi"
          className="mt-3 block w-full text-center text-sm font-medium text-[#1B6B93] hover:underline"
        >
          Vezi toate facturile &rarr;
        </Link>
      </div>
    </div>
  )
}
