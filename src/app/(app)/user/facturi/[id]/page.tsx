'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'
import { ArrowLeft, CheckCircle, Clock, Upload } from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock data for current user - invoice detail
// ---------------------------------------------------------------------------
interface FacturaDetail {
  id: string
  perioada: string
  indexAnterior: number
  indexCurent: number
  consumIndividual: number
  cotaPierderi: number
  consumTotalFacturat: number
  pretMc: number
  sumaPlata: number
  status: 'neplatit' | 'pending' | 'platit'
  dataPlata?: string
  mediaRetea: number
}

const mockFacturi: Record<string, FacturaDetail> = {
  '1': {
    id: '1',
    perioada: 'Oct-Nov 2025',
    indexAnterior: 961.0,
    indexCurent: 987.0,
    consumIndividual: 26.0,
    cotaPierderi: 1.43,
    consumTotalFacturat: 27.43,
    pretMc: 11.045,
    sumaPlata: 287.16,
    status: 'neplatit',
    mediaRetea: 18.26,
  },
  '2': {
    id: '2',
    perioada: 'Aug-Sep 2025',
    indexAnterior: 939.0,
    indexCurent: 961.0,
    consumIndividual: 22.0,
    cotaPierderi: 1.15,
    consumTotalFacturat: 23.15,
    pretMc: 10.97,
    sumaPlata: 241.80,
    status: 'platit',
    dataPlata: '15.10.2025',
    mediaRetea: 20.5,
  },
  '3': {
    id: '3',
    perioada: 'Jun-Jul 2025',
    indexAnterior: 921.0,
    indexCurent: 939.0,
    consumIndividual: 18.0,
    cotaPierderi: 1.1,
    consumTotalFacturat: 19.1,
    pretMc: 10.39,
    sumaPlata: 198.44,
    status: 'platit',
    dataPlata: '12.08.2025',
    mediaRetea: 19.2,
  },
  '4': {
    id: '4',
    perioada: 'Apr-Mai 2025',
    indexAnterior: 896.5,
    indexCurent: 921.0,
    consumIndividual: 24.5,
    cotaPierderi: 1.5,
    consumTotalFacturat: 26.0,
    pretMc: 10.37,
    sumaPlata: 269.60,
    status: 'platit',
    dataPlata: '10.06.2025',
    mediaRetea: 21.0,
  },
  '5': {
    id: '5',
    perioada: 'Feb-Mar 2025',
    indexAnterior: 876.5,
    indexCurent: 896.5,
    consumIndividual: 20.0,
    cotaPierderi: 1.3,
    consumTotalFacturat: 21.3,
    pretMc: 10.32,
    sumaPlata: 219.90,
    status: 'pending',
    mediaRetea: 17.8,
  },
}

export default function FacturaDetailPage() {
  const params = useParams()
  const id = params.id as string
  const factura = mockFacturi[id]

  if (!factura) {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
        <div className="flex items-center gap-3">
          <Link
            href="/user/facturi"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-[#E8F4F8]"
          >
            <ArrowLeft size={20} className="text-[#1B6B93]" />
          </Link>
          <h1 className="text-xl font-bold text-[#161513]">Factura negasita</h1>
        </div>
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm text-[#697778]">Factura cu ID-ul {id} nu a fost gasita.</p>
        </div>
      </div>
    )
  }

  // Consumption bar comparison
  const maxConsum = Math.max(factura.consumIndividual, factura.mediaRetea) * 1.2
  const userBarPct = Math.round((factura.consumIndividual / maxConsum) * 100)
  const avgBarPct = Math.round((factura.mediaRetea / maxConsum) * 100)

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/user/facturi"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <ArrowLeft size={20} className="text-[#1B6B93]" />
        </Link>
        <h1 className="text-xl font-bold text-[#161513]">
          Detalii Factura
        </h1>
      </div>

      {/* Summary card - gradient */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0F4C75 0%, #1B6B93 100%)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Suma de plata</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              {factura.sumaPlata.toFixed(2)}{' '}
              <span className="text-lg font-semibold text-white/70">RON</span>
            </p>
          </div>
          <StatusBadge status={factura.status} />
        </div>
        <p className="mt-3 text-sm text-white/80">
          Perioada: {factura.perioada}
        </p>
      </div>

      {/* Breakdown card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Detalii consum</h2>
        <div className="mt-4 space-y-3">
          <Row label="Index anterior" value={`${factura.indexAnterior.toFixed(2)} mc`} />
          <Row label="Index curent" value={`${factura.indexCurent.toFixed(2)} mc`} />
          <div className="border-t border-[#F1EFED]" />
          <Row label="Consum individual" value={`${factura.consumIndividual.toFixed(2)} mc`} bold />
          <Row
            label="Cota pierderi retea"
            value={`+${factura.cotaPierderi.toFixed(2)} mc`}
            valueColor="#AC630C"
          />
          <Row
            label="Consum total facturat"
            value={`${factura.consumTotalFacturat.toFixed(2)} mc`}
            bold
            valueColor="#1B6B93"
          />
          <div className="border-t border-[#F1EFED]" />
          <Row label="Pret/mc" value={`${factura.pretMc.toFixed(3)} RON`} />
          <div className="flex items-center justify-between rounded-xl bg-[#1B6B93]/5 px-4 py-3">
            <span className="text-sm font-semibold text-[#161513]">Suma de plata</span>
            <span className="text-lg font-extrabold text-[#1B6B93]">
              {factura.sumaPlata.toFixed(2)} RON
            </span>
          </div>
        </div>
      </div>

      {/* Comparison card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">
          Consumul tau vs. media retelei
        </h2>
        <div className="mt-4 space-y-4">
          {/* User bar */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[#161513]">Consumul tau</span>
              <span className="font-bold text-[#1B6B93]">
                {factura.consumIndividual.toFixed(2)} mc
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-[#E8F4F8]">
              <div
                className="h-full rounded-full bg-[#1B6B93] transition-all"
                style={{ width: `${userBarPct}%` }}
              />
            </div>
          </div>

          {/* Average bar */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[#697778]">Media retea</span>
              <span className="font-bold text-[#697778]">
                {factura.mediaRetea.toFixed(2)} mc
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-[#F1EFED]">
              <div
                className="h-full rounded-full bg-[#697778]/40 transition-all"
                style={{ width: `${avgBarPct}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-[#697778]">
            Consumul tau: {factura.consumIndividual.toFixed(2)} mc | Media retea:{' '}
            {factura.mediaRetea.toFixed(2)} mc
          </p>
        </div>
      </div>

      {/* Payment section */}
      {factura.status === 'neplatit' && (
        <Link
          href="/user/dovada-plata"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
        >
          <Upload size={18} />
          Incarca Dovada Plata
        </Link>
      )}

      {factura.status === 'pending' && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#AC630C]/10 p-5">
          <Clock size={24} className="shrink-0 text-[#AC630C]" />
          <div>
            <p className="text-sm font-semibold text-[#AC630C]">
              Dovada trimisa, in asteptare confirmare
            </p>
            <p className="mt-1 text-xs text-[#AC630C]/70">
              Administratorul va verifica dovada de plata in cel mai scurt timp.
            </p>
          </div>
        </div>
      )}

      {factura.status === 'platit' && factura.dataPlata && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#508223]/10 p-5">
          <CheckCircle size={24} className="shrink-0 text-[#508223]" />
          <div>
            <p className="text-sm font-semibold text-[#508223]">
              Plata confirmata pe {factura.dataPlata}
            </p>
            <p className="mt-1 text-xs text-[#508223]/70">
              Multumim! Plata a fost inregistrata cu succes.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reusable row component for the breakdown card
// ---------------------------------------------------------------------------
function Row({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string
  value: string
  bold?: boolean
  valueColor?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#697778]">{label}</span>
      <span
        className={`text-sm tabular-nums ${bold ? 'font-bold' : 'font-medium'}`}
        style={valueColor ? { color: valueColor } : { color: '#161513' }}
      >
        {value}
      </span>
    </div>
  )
}
