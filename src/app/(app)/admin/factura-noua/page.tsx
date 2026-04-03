'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, FileEdit, AlertTriangle, CheckCircle } from 'lucide-react'

const LAST_CENTRAL_INDEX = 15820

export default function FacturaNouaPage() {
  const router = useRouter()

  // Perioada
  const [lunaStart, setLunaStart] = useState('')
  const [lunaEnd, setLunaEnd] = useState('')
  const [deadlineRaportare, setDeadlineRaportare] = useState('')

  // Date factura
  const [nrFactura, setNrFactura] = useState('')
  const [sumaFactura, setSumaFactura] = useState('')
  const [dataFactura, setDataFactura] = useState('')

  // Apometru central
  const [indexAnterior] = useState(LAST_CENTRAL_INDEX)
  const [indexCurent, setIndexCurent] = useState('')

  // UI state
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Calculated values
  const consumCentral = useMemo(() => {
    const curent = parseFloat(indexCurent)
    if (isNaN(curent) || curent <= indexAnterior) return null
    return Math.round((curent - indexAnterior) * 100) / 100
  }, [indexCurent, indexAnterior])

  const pretMc = useMemo(() => {
    const suma = parseFloat(sumaFactura)
    if (!consumCentral || isNaN(suma) || suma <= 0) return null
    return suma / consumCentral
  }, [sumaFactura, consumCentral])

  const pretWarning = useMemo(() => {
    if (pretMc === null) return false
    return pretMc < 8 || pretMc > 15
  }, [pretMc])

  function validate(): string[] {
    const errs: string[] = []
    if (!lunaStart) errs.push('Luna start este obligatorie')
    if (!lunaEnd) errs.push('Luna end este obligatorie')
    if (!deadlineRaportare) errs.push('Deadline raportare este obligatoriu')
    if (!nrFactura.trim()) errs.push('Nr. factura este obligatoriu')
    if (!sumaFactura || parseFloat(sumaFactura) <= 0) errs.push('Suma factura trebuie sa fie > 0')
    if (!dataFactura) errs.push('Data factura este obligatorie')
    if (!indexCurent) errs.push('Index curent este obligatoriu')
    const curent = parseFloat(indexCurent)
    if (!isNaN(curent) && curent <= indexAnterior) {
      errs.push('Indexul curent trebuie sa fie mai mare decat cel anterior')
    }
    return errs
  }

  async function handleSave(isDraft: boolean) {
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])
    setSaving(true)

    // Simulate save delay
    await new Promise((r) => setTimeout(r, 800))

    setSaving(false)
    setSuccess(true)

    if (!isDraft) {
      // Redirect to repartizare after 2s
      setTimeout(() => {
        router.push('/admin/repartizare')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#508223]/15">
            <CheckCircle size={32} className="text-[#508223]" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-[#161513]">
            Perioada creata cu succes!
          </h2>
          <p className="mt-2 text-center text-sm text-[#697778]">
            Notificari trimise catre 25 familii. Redirectionare catre repartizare...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <ArrowLeft size={20} className="text-[#1B6B93]" />
        </Link>
        <h1 className="text-xl font-bold text-[#161513]">Adauga Factura Noua</h1>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="rounded-2xl border-l-4 border-[#C74634] bg-[#C74634]/5 p-4">
          <ul className="space-y-1 text-sm text-[#C74634]">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Card 1: Perioada facturare */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Perioada facturare</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#697778]">Luna start</label>
            <input
              type="month"
              value={lunaStart}
              onChange={(e) => setLunaStart(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#697778]">Luna end</label>
            <input
              type="month"
              value={lunaEnd}
              onChange={(e) => setLunaEnd(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#697778]">Deadline raportare index</label>
            <input
              type="date"
              value={deadlineRaportare}
              onChange={(e) => setDeadlineRaportare(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Date factura furnizor */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Date factura furnizor</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#697778]">Nr. factura</label>
            <input
              type="text"
              value={nrFactura}
              onChange={(e) => setNrFactura(e.target.value)}
              placeholder="FA-2026-003"
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#697778]">Suma totala factura (RON)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sumaFactura}
              onChange={(e) => setSumaFactura(e.target.value)}
              placeholder="5041.04"
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#697778]">Data factura</label>
            <input
              type="date"
              value={dataFactura}
              onChange={(e) => setDataFactura(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Apometru central */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Apometru central</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#697778]">Index anterior</label>
            <input
              type="number"
              value={indexAnterior}
              readOnly
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F1EFED] px-4 py-3 text-sm text-[#697778] outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#697778]">Index curent</label>
            <input
              type="number"
              step="0.01"
              value={indexCurent}
              onChange={(e) => setIndexCurent(e.target.value)}
              placeholder="16276"
              className="mt-1 block w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>

          {/* Live calculated consumption */}
          {consumCentral !== null && (
            <div className="rounded-xl bg-[#1B6B93]/5 px-4 py-3">
              <p className="text-xs font-medium text-[#697778]">Consum central</p>
              <p className="text-lg font-bold text-[#1B6B93]">
                {consumCentral.toFixed(2)} mc
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Calcule automate (shown when we have enough data) */}
      {consumCentral !== null && pretMc !== null && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[#161513]">Calcule automate</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#1B6B93]/5 px-4 py-3">
              <span className="text-sm text-[#697778]">Consum central</span>
              <span className="text-base font-bold text-[#1B6B93]">
                {consumCentral.toFixed(2)} mc
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#1B6B93]/5 px-4 py-3">
              <span className="text-sm text-[#697778]">Pret/mc</span>
              <span className="text-base font-bold text-[#1B6B93]">
                {pretMc.toFixed(3)} RON
              </span>
            </div>

            {pretWarning && (
              <div className="flex items-center gap-2 rounded-xl bg-[#AC630C]/10 px-4 py-3">
                <AlertTriangle size={18} className="shrink-0 text-[#AC630C]" />
                <p className="text-sm font-medium text-[#AC630C]">
                  Atentie: pretul/mc pare neobisnuit (interval normal: 8-15 RON)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(false)}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98] disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Se salveaza...' : 'Salveaza si Notifica Familiile'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98] disabled:opacity-50"
        >
          <FileEdit size={18} />
          Salveaza ca Draft
        </button>
      </div>
    </div>
  )
}
