'use client'

import Link from 'next/link'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'

// ---------------------------------------------------------------------------
// Mock data - Admin dashboard
// ---------------------------------------------------------------------------
const mockStats = {
  totalFamilii: 25,
  indexuriRaportate: 22,
  platiConfirmate: 15,
  totalDeIncasat: 5041.04,
}

const mockPerioada = {
  nume: 'Oct-Nov 2025',
  nrFactura: 'FA-2025-0011',
  sumaFactura: 7124.50,
  indexCentralAnterior: 12450,
  indexCentralCurent: 13012,
  consumCentral: 562,
  pretMc: 11.045,
  status: 'deschisa' as const,
}

const familiiFaraIndex = [
  { id: '1', nume: 'Pintilie Mihai' },
  { id: '2', nume: 'Turcu Stefan' },
  { id: '3', nume: 'Iliescu Ctin' },
]

const ultimelePlati = [
  { familie: 'Dumitrescu Ana',   suma: 312.40, data: '28.02.2026', status: 'confirmat' as const },
  { familie: 'Popescu Ion',      suma: 198.80, data: '27.02.2026', status: 'confirmat' as const },
  { familie: 'Ionescu Maria',    suma: 276.12, data: '26.02.2026', status: 'pending' as const },
  { familie: 'Vasile Gheorghe',  suma: 345.60, data: '25.02.2026', status: 'confirmat' as const },
  { familie: 'Marin Elena',      suma: 224.30, data: '24.02.2026', status: 'pending' as const },
]

export default function AdminDashboard() {
  const s = mockStats
  const p = mockPerioada
  const reportPercent = Math.round((s.indexuriRaportate / s.totalFamilii) * 100)

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 pb-24">
      {/* ----------------------------------------------------------------- */}
      {/* Stats grid                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Familii active"
          value={s.totalFamilii}
          color="blue"
          icon={<span>👥</span>}
        />
        <StatCard
          title="Indexuri raportate"
          value={`${s.indexuriRaportate}/${s.totalFamilii}`}
          subtitle={`${reportPercent}% completat`}
          color={s.indexuriRaportate > 20 ? 'green' : 'orange'}
          icon={<span>📊</span>}
        />
        <StatCard
          title="Plati confirmate"
          value={`${s.platiConfirmate}/${s.totalFamilii}`}
          color="orange"
          icon={<span>💳</span>}
        />
        <StatCard
          title="Total de incasat"
          value={`${s.totalDeIncasat.toLocaleString('ro-RO')} RON`}
          color="red"
          icon={<span>💰</span>}
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Perioada curenta                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#161513]">
            Perioada curenta
          </h2>
          <span className="rounded-full bg-[#1B6B93]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1B6B93]">
            {p.status === 'deschisa' ? 'Deschisa' : 'Inchisa'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-xs text-[#161513]/50">Perioada</p>
            <p className="font-medium">{p.nume}</p>
          </div>
          <div>
            <p className="text-xs text-[#161513]/50">Nr. factura</p>
            <p className="font-medium">{p.nrFactura}</p>
          </div>
          <div>
            <p className="text-xs text-[#161513]/50">Suma factura</p>
            <p className="font-medium">
              {p.sumaFactura.toLocaleString('ro-RO')} RON
            </p>
          </div>
          <div>
            <p className="text-xs text-[#161513]/50">Pret/mc</p>
            <p className="font-medium">{p.pretMc.toFixed(3)} RON</p>
          </div>
          <div>
            <p className="text-xs text-[#161513]/50">Index central</p>
            <p className="font-medium">
              {p.indexCentralAnterior.toLocaleString('ro-RO')} &rarr;{' '}
              {p.indexCentralCurent.toLocaleString('ro-RO')}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#161513]/50">Consum central</p>
            <p className="font-medium">{p.consumCentral} mc</p>
          </div>
        </div>

        {/* Progress bar - indexuri raportate */}
        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-xs text-[#161513]/60">
            <span>Indexuri raportate</span>
            <span>
              {s.indexuriRaportate}/{s.totalFamilii} ({reportPercent}%)
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#E8F4F8]">
            <div
              className="h-full rounded-full bg-[#508223] transition-all"
              style={{ width: `${reportPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Action buttons grid                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/factura-noua"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Adauga Factura
        </Link>
        <Link
          href="/admin/repartizare"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculeaza Repartizare
        </Link>
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Trimite Reminder
        </button>
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Raport
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Familii fara index - Warning alert                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl border-l-4 border-[#AC630C] bg-[#AC630C]/5 p-5">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#AC630C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-sm font-semibold text-[#AC630C]">
            Familii fara index raportat ({familiiFaraIndex.length})
          </h2>
        </div>
        <ul className="mt-3 space-y-2">
          {familiiFaraIndex.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
            >
              <span className="text-sm font-medium text-[#161513]">
                {f.nume}
              </span>
              <button
                type="button"
                className="rounded-lg bg-[#AC630C]/10 px-3 py-1.5 text-xs font-semibold text-[#AC630C] transition hover:bg-[#AC630C]/20 active:scale-[0.97]"
              >
                Trimite reminder
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Ultimele plati                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Ultimele plati</h2>
        <ul className="mt-3 divide-y divide-[#F1EFED]">
          {ultimelePlati.map((p, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[#161513]">
                  {p.familie}
                </p>
                <p className="text-xs text-[#161513]/50">
                  {p.suma.toFixed(2)} RON &middot; {p.data}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
