'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Save,
  Lock,
  Upload,
  Info,
  Bell,
  Download,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react'
import { getMockFamilii } from '@/lib/mock-data'
import Toast from '@/components/Toast'

export default function SetariPage() {
  const [pretMc, setPretMc] = useState('11.045')
  const [pretSaved, setPretSaved] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null)

  // Load dark mode preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('apa-theme')
      if (stored === 'dark') setDarkMode(true)
    } catch { /* ignore */ }
  }, [])

  const handleSavePret = () => {
    setPretSaved(true)
    setTimeout(() => setPretSaved(false), 2000)
  }

  const handleToggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    try {
      localStorage.setItem('apa-theme', next ? 'dark' : 'light')
    } catch { /* ignore */ }
    setToast({ message: next ? 'Tema intunecata activata' : 'Tema deschisa activata', type: 'info' })
  }

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      familii: getMockFamilii(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apa-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setToast({ message: 'Backup JSON descarcat cu succes', type: 'success' })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 pb-24">
      <h1 className="text-xl font-bold text-[#161513]">Setari</h1>

      {/* ----------------------------------------------------------------- */}
      {/* Notificari link card                                               */}
      {/* ----------------------------------------------------------------- */}
      <Link
        href="/admin/notificari"
        className="card-hover flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B6B93]/10">
            <Bell size={20} className="text-[#1B6B93]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#161513]">Notificari</p>
            <p className="text-xs text-[#697778]">
              Trimite notificari si mesaje catre familii
            </p>
          </div>
        </div>
        <ChevronRight size={20} className="text-[#697778]" />
      </Link>

      {/* ----------------------------------------------------------------- */}
      {/* Configurare Pret                                                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          Configurare Pret
        </h2>
        <p className="mt-1 text-sm text-[#697778]">
          Pretul per metru cub utilizat la calculul repartizarii.
        </p>
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.001"
              value={pretMc}
              onChange={(e) => setPretMc(e.target.value)}
              className="input pr-16 text-lg font-bold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#697778]">
              RON/mc
            </span>
          </div>
          <button
            type="button"
            onClick={handleSavePret}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1B6B93] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F4C75] active:scale-[0.98]"
          >
            <Save size={16} />
            Salveaza
          </button>
        </div>
        {pretSaved && (
          <p className="mt-2 text-sm font-medium text-[#508223]">
            Pretul a fost salvat cu succes.
          </p>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Perioada Facturare                                                  */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          Perioada Facturare
        </h2>
        <p className="mt-1 text-sm text-[#697778]">
          Perioada curenta deschisa pentru raportare indexuri.
        </p>

        <div className="mt-4 rounded-xl bg-[#E8F4F8] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#697778]">Perioada curenta</p>
              <p className="mt-0.5 text-lg font-bold text-[#1B6B93]">
                Dec 2025 - Ian 2026
              </p>
            </div>
            <span className="rounded-full bg-[#1B6B93]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1B6B93]">
              Deschisa
            </span>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C74634] px-6 py-3 text-sm font-semibold text-[#C74634] transition hover:bg-[#C74634]/5 active:scale-[0.98]"
        >
          <Lock size={16} />
          Inchide Perioada
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Backup Date                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          <Download size={18} className="text-[#1B6B93]" />
          Backup Date
        </h2>
        <p className="mt-1 text-sm text-[#697778]">
          Exporta toate datele aplicatiei intr-un fisier JSON.
        </p>
        <button
          type="button"
          onClick={handleExportJSON}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-6 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <Download size={16} />
          Export JSON
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Tema                                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          {darkMode ? (
            <Moon size={18} className="text-[#1B6B93]" />
          ) : (
            <Sun size={18} className="text-[#AC630C]" />
          )}
          Tema
        </h2>
        <p className="mt-1 text-sm text-[#697778]">
          Alegeti intre tema deschisa si tema intunecata.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#161513]">
            {darkMode ? 'Tema intunecata' : 'Tema deschisa'}
          </span>
          <button
            type="button"
            onClick={handleToggleDark}
            className={`relative h-8 w-14 rounded-full transition-colors duration-200 ${
              darkMode ? 'bg-[#0F4C75]' : 'bg-[#D1D5DB]'
            }`}
            role="switch"
            aria-checked={darkMode}
          >
            <div
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                darkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Import Date                                                        */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          Import Date
        </h2>
        <p className="mt-1 text-sm text-[#697778]">
          Importa datele familiilor sau indexurile din fisiere Excel.
        </p>
        <button
          type="button"
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-6 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
        >
          <Upload size={16} />
          Import din Excel
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Despre Aplicatie                                                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-[#161513]">
          <Info size={18} className="text-[#1B6B93]" />
          Despre Aplicatie
        </h2>
        <div className="mt-3 space-y-2 text-sm text-[#697778]">
          <div className="flex justify-between">
            <span>Versiune</span>
            <span className="font-medium text-[#161513]">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Familii inregistrate</span>
            <span className="font-medium text-[#161513]">25</span>
          </div>
          <div className="flex justify-between">
            <span>Tehnologii</span>
            <span className="font-medium text-[#161513]">Next.js 16 + Tailwind CSS</span>
          </div>
          <div className="flex justify-between">
            <span>Baza de date</span>
            <span className="font-medium text-[#161513]">Supabase (PostgreSQL)</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
