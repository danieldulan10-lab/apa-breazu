'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'
import {
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  FileDown,
  Bell,
  AlertTriangle,
  Lock,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Mock data - Oct-Nov 2025 (real Excel Sheet7 data)
// ---------------------------------------------------------------------------
interface FamilieRepartizare {
  nr: number
  nume: string
  indexAnterior: number
  indexCurent: number
  consumIndividual: number
  pierderi: number
  consumTotal: number
  suma: number
  status: 'platit' | 'pending' | 'neplatit'
  estimat?: boolean
  raportat: boolean
}

const CONSUM_CENTRAL = 456.43
const SUMA_FACTURA = 5041.04
const PRET_MC = SUMA_FACTURA / CONSUM_CENTRAL // ~11.045

// Raw data from Excel
const rawData: Array<{
  nume: string
  idxAnt: number
  idxCur: number
  consum: number
  status: 'platit' | 'pending' | 'neplatit'
  estimat?: boolean
  raportat?: boolean
}> = [
  { nume: 'Corbu Ciprian',       idxAnt: 523.06,  idxCur: 549,     consum: 25.94,  status: 'platit' },
  { nume: 'Dorofte Florin',      idxAnt: 2018.21, idxCur: 2045.44, consum: 27.23,  status: 'platit' },
  { nume: 'Iliescu Ctin',        idxAnt: 334.36,  idxCur: 334.36,  consum: 0,      status: 'platit', raportat: true },
  { nume: 'Iliescu Titi',        idxAnt: 1216.07, idxCur: 1242.27, consum: 26.21,  status: 'pending' },
  { nume: 'Iliescu Ioan',        idxAnt: 1894.01, idxCur: 1915.72, consum: 21.71,  status: 'platit' },
  { nume: 'Pintilie Mihai',      idxAnt: 267.93,  idxCur: 267.93,  consum: 0,      status: 'neplatit', raportat: false },
  { nume: 'Serban Iurie',        idxAnt: 1599.09, idxCur: 1647.5,  consum: 48.41,  status: 'pending' },
  { nume: 'Gorie Mihai',         idxAnt: 1941.22, idxCur: 1970.41, consum: 29.19,  status: 'platit' },
  { nume: 'Petru Lupu',          idxAnt: 713.4,   idxCur: 745.87,  consum: 32.47,  status: 'platit' },
  { nume: 'Iliescu Ioan',        idxAnt: 961,     idxCur: 987,     consum: 26,     status: 'neplatit' },
  { nume: 'Sucila Valeriu',      idxAnt: 653.62,  idxCur: 663.92,  consum: 10.30,  status: 'platit' },
  { nume: 'Ciprian Serban',      idxAnt: 1044.75, idxCur: 1062.27, consum: 17.52,  status: 'pending' },
  { nume: 'Marius Mancea',       idxAnt: 718.09,  idxCur: 733.05,  consum: 14.96,  status: 'platit' },
  { nume: 'Herciu Gabriela',     idxAnt: 595.24,  idxCur: 603.8,   consum: 8.56,   status: 'platit' },
  { nume: 'Astefculese Igor',    idxAnt: 872.3,   idxCur: 878.08,  consum: 5.78,   status: 'neplatit' },
  { nume: 'Chiriac Marius',      idxAnt: 1502,    idxCur: 1549,    consum: 47,     status: 'platit' },
  { nume: 'Fam. Rosca',          idxAnt: 942,     idxCur: 964,     consum: 22,     status: 'pending' },
  { nume: 'Opria Roxana',        idxAnt: 645.04,  idxCur: 665,     consum: 19.96,  status: 'platit' },
  { nume: 'Cristina Mocanu',     idxAnt: 914.99,  idxCur: 927.27,  consum: 12.27,  status: 'platit' },
  { nume: 'Tamas Stefan',        idxAnt: 451,     idxCur: 462.79,  consum: 11.79,  status: 'pending' },
  { nume: 'Turcu Stefan',        idxAnt: 110.48,  idxCur: 110.48,  consum: 0,      status: 'neplatit', raportat: false },
  { nume: 'Davidoaia Cozmin',    idxAnt: 463.36,  idxCur: 477.3,   consum: 13.94,  status: 'platit' },
  { nume: 'Gavril George',       idxAnt: 670.81,  idxCur: 686,     consum: 15.19,  status: 'platit' },
  { nume: 'Andra Bostanaru',     idxAnt: 689,     idxCur: 709,     consum: 20,     status: 'pending', estimat: true },
  { nume: 'Iliescu Gheorghe',    idxAnt: 405.12,  idxCur: 405.12,  consum: 0,      status: 'neplatit', raportat: false },
]

// Build the full distribution data
function buildRepartizare(): FamilieRepartizare[] {
  const totalIndividual = rawData.reduce((s, d) => s + d.consum, 0)
  const pierderiTotale = CONSUM_CENTRAL - totalIndividual

  return rawData.map((d, i) => {
    const cotaPierderi =
      totalIndividual > 0
        ? Math.round((d.consum / totalIndividual) * pierderiTotale * 100) / 100
        : 0
    const consumTotal = Math.round((d.consum + cotaPierderi) * 100) / 100
    const suma = Math.round(consumTotal * PRET_MC * 100) / 100

    return {
      nr: i + 1,
      nume: d.nume,
      indexAnterior: d.idxAnt,
      indexCurent: d.idxCur,
      consumIndividual: d.consum,
      pierderi: cotaPierderi,
      consumTotal,
      suma,
      status: d.status,
      estimat: d.estimat,
      raportat: d.raportat !== false, // default true
    }
  })
}

export default function RepartizarePage() {
  const [locked, setLocked] = useState(false)
  const [showLockConfirm, setShowLockConfirm] = useState(false)

  const familii = useMemo(() => buildRepartizare(), [])
  const totalConsumIndividual = useMemo(
    () => Math.round(familii.reduce((s, f) => s + f.consumIndividual, 0) * 100) / 100,
    [familii],
  )
  const pierderiRetea = useMemo(
    () => Math.round((CONSUM_CENTRAL - totalConsumIndividual) * 100) / 100,
    [totalConsumIndividual],
  )
  const procentPierderi = useMemo(
    () => Math.round((pierderiRetea / CONSUM_CENTRAL) * 1000) / 10,
    [pierderiRetea],
  )
  const familiiNeraportate = useMemo(
    () => familii.filter((f) => !f.raportat),
    [familii],
  )
  const nrRaportate = familii.length - familiiNeraportate.length
  const totalSuma = useMemo(
    () => Math.round(familii.reduce((s, f) => s + f.suma, 0) * 100) / 100,
    [familii],
  )

  function handleLock() {
    setLocked(true)
    setShowLockConfirm(false)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <ArrowLeft size={20} className="text-[#1B6B93]" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#161513]">Repartizare</h1>
          <p className="text-sm text-[#697778]">Oct-Nov 2025</p>
        </div>
        {locked && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#508223]/15 px-3 py-1 text-xs font-semibold text-[#508223]">
            <Lock size={12} />
            Confirmata
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Consum central"
          value={`${CONSUM_CENTRAL.toFixed(2)} mc`}
          color="blue"
        />
        <StatCard
          title="Pret/mc"
          value={`${PRET_MC.toFixed(3)} RON`}
          color="blue"
        />
        <StatCard
          title="Total factura"
          value={`${SUMA_FACTURA.toLocaleString('ro-RO')} RON`}
          color="blue"
        />
      </div>

      {/* Calculation details */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Detalii calcul</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div>
            <p className="text-xs text-[#697778]">Total consum individual</p>
            <p className="text-base font-bold text-[#161513]">{totalConsumIndividual.toFixed(2)} mc</p>
          </div>
          <div>
            <p className="text-xs text-[#697778]">Pierderi retea</p>
            <p
              className={`text-base font-bold ${
                procentPierderi > 10 ? 'text-[#AC630C]' : 'text-[#161513]'
              }`}
            >
              {pierderiRetea.toFixed(2)} mc
              {procentPierderi > 10 && (
                <AlertTriangle size={14} className="ml-1 inline text-[#AC630C]" />
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#697778]">Procent pierderi</p>
            <p
              className={`text-base font-bold ${
                procentPierderi > 10 ? 'text-[#AC630C]' : 'text-[#161513]'
              }`}
            >
              {procentPierderi.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-[#697778]">Familii raportate</p>
            <p className="text-base font-bold text-[#161513]">
              {nrRaportate}/{familii.length}
            </p>
          </div>
        </div>
      </div>

      {/* Warning: families without report */}
      {familiiNeraportate.length > 0 && (
        <div className="rounded-2xl border-l-4 border-[#AC630C] bg-[#AC630C]/5 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#AC630C]" />
            <h2 className="text-sm font-semibold text-[#AC630C]">
              Familii fara index raportat ({familiiNeraportate.length})
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {familiiNeraportate.map((f) => (
              <li
                key={f.nr}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2.5"
              >
                <span className="text-sm font-medium text-[#161513]">{f.nume}</span>
                <button
                  type="button"
                  className="rounded-lg bg-[#AC630C]/10 px-3 py-1.5 text-xs font-semibold text-[#AC630C] transition hover:bg-[#AC630C]/20 active:scale-[0.97]"
                >
                  Trimite Reminder
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Distribution table - Desktop */}
      <div className="hidden rounded-2xl bg-white p-5 shadow-sm md:block">
        <h2 className="mb-4 text-sm font-semibold text-[#161513]">
          Distributie pe familii
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F1EFED] text-left text-xs font-semibold uppercase tracking-wider text-[#697778]">
                <th className="pb-3 pr-2">#</th>
                <th className="pb-3 pr-2">Familie</th>
                <th className="pb-3 pr-2 text-right">Idx. Ant.</th>
                <th className="pb-3 pr-2 text-right">Idx. Cur.</th>
                <th className="pb-3 pr-2 text-right">Consum</th>
                <th className="pb-3 pr-2 text-right">Pierderi</th>
                <th className="pb-3 pr-2 text-right">Total</th>
                <th className="pb-3 pr-2 text-right">Suma (RON)</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFED]">
              {familii.map((f) => (
                <tr
                  key={f.nr}
                  className={`transition hover:bg-[#F9FAFB] ${
                    f.status === 'platit'
                      ? 'bg-[#508223]/3'
                      : f.status === 'pending'
                        ? 'bg-[#AC630C]/3'
                        : ''
                  }`}
                >
                  <td className="py-2.5 pr-2 text-[#697778]">{f.nr}</td>
                  <td className="py-2.5 pr-2 font-medium text-[#161513]">
                    {f.nume}
                    {f.estimat && (
                      <span className="ml-1.5 text-xs text-[#AC630C]">(estimat)</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-[#697778]">
                    {f.indexAnterior.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-[#161513]">
                    {f.indexCurent.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-medium text-[#161513]">
                    {f.consumIndividual.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums text-[#AC630C]">
                    {f.pierderi.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-medium text-[#1B6B93]">
                    {f.consumTotal.toFixed(2)}
                  </td>
                  <td className="py-2.5 pr-2 text-right tabular-nums font-bold text-[#161513]">
                    {f.suma.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-center">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#1B6B93]/20 font-bold">
                <td className="pt-3" colSpan={4}>
                  Total
                </td>
                <td className="pt-3 text-right tabular-nums text-[#161513]">
                  {totalConsumIndividual.toFixed(2)}
                </td>
                <td className="pt-3 text-right tabular-nums text-[#AC630C]">
                  {pierderiRetea.toFixed(2)}
                </td>
                <td className="pt-3 text-right tabular-nums text-[#1B6B93]">
                  {CONSUM_CENTRAL.toFixed(2)}
                </td>
                <td className="pt-3 text-right tabular-nums text-[#161513]">
                  {totalSuma.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Distribution cards - Mobile */}
      <div className="space-y-3 md:hidden">
        <h2 className="text-sm font-semibold text-[#161513]">
          Distributie pe familii
        </h2>
        {familii.map((f) => (
          <div key={f.nr} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B6B93]/10 text-xs font-bold text-[#1B6B93]">
                  {f.nr}
                </span>
                <span className="text-sm font-semibold text-[#161513]">
                  {f.nume}
                  {f.estimat && (
                    <span className="ml-1 text-xs font-normal text-[#AC630C]">
                      (estimat)
                    </span>
                  )}
                </span>
              </div>
              <StatusBadge status={f.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-[#697778]">Index anterior</p>
                <p className="tabular-nums font-medium">{f.indexAnterior.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[#697778]">Index curent</p>
                <p className="tabular-nums font-medium">{f.indexCurent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-[#697778]">Consum individual</p>
                <p className="tabular-nums font-medium">{f.consumIndividual.toFixed(2)} mc</p>
              </div>
              <div>
                <p className="text-xs text-[#697778]">Pierderi retea</p>
                <p className="tabular-nums font-medium text-[#AC630C]">
                  +{f.pierderi.toFixed(2)} mc
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F9FAFB] px-3 py-2">
              <span className="text-sm text-[#697778]">
                Total: {f.consumTotal.toFixed(2)} mc
              </span>
              <span className="text-base font-bold text-[#161513]">
                {f.suma.toFixed(2)} RON
              </span>
            </div>
          </div>
        ))}

        {/* Totals card mobile */}
        <div className="rounded-2xl bg-[#1B6B93] p-4 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Total consum</span>
            <span className="text-base font-bold">{CONSUM_CENTRAL.toFixed(2)} mc</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Total suma</span>
            <span className="text-lg font-bold">{totalSuma.toFixed(2)} RON</span>
          </div>
        </div>
      </div>

      {/* Lock confirmation dialog */}
      {showLockConfirm && (
        <div className="rounded-2xl border-2 border-[#1B6B93] bg-[#1B6B93]/5 p-5">
          <p className="text-sm font-medium text-[#161513]">
            Sigur doriti sa confirmati repartizarea? Aceasta actiune nu poate fi anulata.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleLock}
              className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F4C75] active:scale-[0.98]"
            >
              <Lock size={16} />
              Da, confirma
            </button>
            <button
              type="button"
              onClick={() => setShowLockConfirm(false)}
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border-2 border-[#697778] px-4 py-2.5 text-sm font-semibold text-[#697778] transition hover:bg-[#F1EFED] active:scale-[0.98]"
            >
              Anuleaza
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={locked}
          onClick={() => setShowLockConfirm(true)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98] disabled:opacity-50"
        >
          <CheckCircle size={18} />
          {locked ? 'Confirmata' : 'Confirma Repartizarea'}
        </button>
        <button
          type="button"
          disabled={locked}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98] disabled:opacity-50"
        >
          <RefreshCw size={18} />
          Recalculeaza
        </button>
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <FileDown size={18} />
          Export PDF
        </button>
        <button
          type="button"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <Bell size={18} />
          Notifica Familiile
        </button>
      </div>
    </div>
  )
}
