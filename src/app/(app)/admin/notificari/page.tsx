'use client'

import { useState } from 'react'
import {
  Bell,
  Send,
  Gauge,
  FileText,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
} from 'lucide-react'
import { getMockFamilii } from '@/lib/mock-data'
import Toast from '@/components/Toast'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Destinatar = 'toti' | 'fara_index' | 'neplatite' | 'individual'

interface SentNotification {
  id: number
  type: string
  date: string
  recipientCount: number
  message: string
}

// ---------------------------------------------------------------------------
// Quick action cards
// ---------------------------------------------------------------------------
const quickActions = [
  {
    key: 'reminder_index',
    icon: Gauge,
    title: 'Reminder Index',
    description: 'Trimite reminder familiilor fara index raportat',
    badge: 8,
    color: '#AC630C',
    bg: 'bg-[#AC630C]/10',
  },
  {
    key: 'factura_noua',
    icon: FileText,
    title: 'Factura Noua',
    description: 'Notifica toate familiile despre factura noua',
    badge: null,
    color: '#1B6B93',
    bg: 'bg-[#1B6B93]/10',
  },
  {
    key: 'reminder_plata',
    icon: CreditCard,
    title: 'Reminder Plata',
    description: 'Trimite reminder familiilor cu plata restanta',
    badge: 5,
    color: '#C74634',
    bg: 'bg-[#C74634]/10',
  },
  {
    key: 'mesaj_custom',
    icon: MessageSquare,
    title: 'Mesaj Custom',
    description: 'Trimite un mesaj personalizat',
    badge: null,
    color: '#508223',
    bg: 'bg-[#508223]/10',
  },
]

// ---------------------------------------------------------------------------
// Mock history
// ---------------------------------------------------------------------------
const mockHistory: SentNotification[] = [
  { id: 1, type: 'Reminder Index', date: '28.03.2026', recipientCount: 8, message: 'Raportati indexul pana la 05.04.2026' },
  { id: 2, type: 'Factura Noua', date: '25.03.2026', recipientCount: 24, message: 'Factura Oct-Nov 2025 este disponibila' },
  { id: 3, type: 'Reminder Plata', date: '20.03.2026', recipientCount: 5, message: 'Aveti o factura neplatita' },
  { id: 4, type: 'Mesaj Custom', date: '15.03.2026', recipientCount: 24, message: 'Intrerupere apa planificata pe 18.03' },
  { id: 5, type: 'Reminder Index', date: '01.03.2026', recipientCount: 12, message: 'Raportati indexul pana la 05.03.2026' },
  { id: 6, type: 'Factura Noua', date: '25.02.2026', recipientCount: 24, message: 'Factura Aug-Sep 2025 este disponibila' },
  { id: 7, type: 'Reminder Plata', date: '20.02.2026', recipientCount: 3, message: 'Aveti o factura neplatita de 198.44 RON' },
  { id: 8, type: 'Mesaj Custom', date: '10.02.2026', recipientCount: 1, message: 'Verificare apometru programata' },
  { id: 9, type: 'Reminder Index', date: '01.02.2026', recipientCount: 10, message: 'Raportati indexul pana la 05.02.2026' },
  { id: 10, type: 'Factura Noua', date: '25.01.2026', recipientCount: 24, message: 'Factura Jun-Jul 2025 este disponibila' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminNotificariPage() {
  const familii = getMockFamilii().filter((f) => f.rol === 'user' && f.activ)

  const [destinatar, setDestinatar] = useState<Destinatar>('toti')
  const [selectedFamilii, setSelectedFamilii] = useState<string[]>([])
  const [titlu, setTitlu] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [history, setHistory] = useState(mockHistory)
  const [showForm, setShowForm] = useState(false)

  const handleQuickAction = (key: string) => {
    const action = quickActions.find((a) => a.key === key)!
    const count = action.badge ?? familii.length
    setHistory((prev) => [
      {
        id: Date.now(),
        type: action.title,
        date: new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        recipientCount: count,
        message: `Notificare automata: ${action.title}`,
      },
      ...prev.slice(0, 9),
    ])
    setToast({ message: `Notificare "${action.title}" trimisa la ${count} familii`, type: 'success' })
  }

  const handleToggleFamily = (id: string) => {
    setSelectedFamilii((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    )
  }

  const handleSend = () => {
    if (!titlu.trim() || !mesaj.trim()) {
      setToast({ message: 'Completati titlul si mesajul', type: 'error' })
      return
    }

    let count = familii.length
    if (destinatar === 'fara_index') count = 8
    else if (destinatar === 'neplatite') count = 5
    else if (destinatar === 'individual') count = selectedFamilii.length

    if (destinatar === 'individual' && selectedFamilii.length === 0) {
      setToast({ message: 'Selectati cel putin o familie', type: 'error' })
      return
    }

    setHistory((prev) => [
      {
        id: Date.now(),
        type: 'Mesaj Custom',
        date: new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        recipientCount: count,
        message: mesaj.slice(0, 80),
      },
      ...prev.slice(0, 9),
    ])

    setToast({ message: `Notificare trimisa la ${count} familii`, type: 'success' })
    setTitlu('')
    setMesaj('')
    setSelectedFamilii([])
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Bell size={22} className="text-[#1B6B93]" />
        <h1 className="text-xl font-bold text-[#161513]">Centru Notificari</h1>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => handleQuickAction(action.key)}
              className="card-hover relative rounded-2xl bg-white p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.97]"
            >
              {action.badge !== null && (
                <span
                  className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white"
                  style={{ backgroundColor: action.color }}
                >
                  {action.badge}
                </span>
              )}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${action.bg}`}
              >
                <Icon size={20} style={{ color: action.color }} />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#161513]">
                {action.title}
              </p>
              <p className="mt-0.5 text-xs text-[#697778]">{action.description}</p>
            </button>
          )
        })}
      </div>

      {/* Custom Notification Form Toggle */}
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="flex w-full items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B6B93]/10">
            <Send size={18} className="text-[#1B6B93]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-[#161513]">
              Trimite Notificare Personalizata
            </p>
            <p className="text-xs text-[#697778]">
              Compune un mesaj custom pentru familii
            </p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-[#697778] transition-transform duration-200 ${showForm ? 'rotate-180' : ''}`}
        />
      </button>

      {showForm && (
        <div className="rounded-2xl bg-white p-5 shadow-sm fade-in space-y-4">
          {/* Destinatari */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#161513]">
              Destinatari
            </label>
            <select
              value={destinatar}
              onChange={(e) => setDestinatar(e.target.value as Destinatar)}
              className="input"
            >
              <option value="toti">Toti ({familii.length} familii)</option>
              <option value="fara_index">Familii fara index raportat (8)</option>
              <option value="neplatite">Familii cu plata restanta (5)</option>
              <option value="individual">Selecteaza individual</option>
            </select>
          </div>

          {/* Individual selection */}
          {destinatar === 'individual' && (
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-[#D1D5DB] p-3">
              {familii.map((f) => (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-[#F1EFED]"
                >
                  <input
                    type="checkbox"
                    checked={selectedFamilii.includes(f.id)}
                    onChange={() => handleToggleFamily(f.id)}
                    className="h-4 w-4 rounded border-[#D1D5DB] text-[#1B6B93] accent-[#1B6B93]"
                  />
                  <span className="text-[#161513]">{f.nume}</span>
                </label>
              ))}
            </div>
          )}

          {/* Titlu */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#161513]">
              Titlu
            </label>
            <input
              type="text"
              value={titlu}
              onChange={(e) => setTitlu(e.target.value)}
              placeholder="ex: Intrerupere apa planificata"
              className="input"
            />
          </div>

          {/* Mesaj */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#161513]">
              Mesaj
            </label>
            <textarea
              value={mesaj}
              onChange={(e) => setMesaj(e.target.value)}
              placeholder="Scrieti mesajul notificarii..."
              rows={3}
              className="input resize-none"
            />
          </div>

          {/* Send */}
          <button
            type="button"
            onClick={handleSend}
            className="btn-primary w-full"
          >
            <Send size={16} />
            Trimite Notificare
          </button>
        </div>
      )}

      {/* Notification History */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#161513]">
          <Clock size={18} className="text-[#697778]" />
          Istoric Notificari Trimise
        </h2>
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl bg-white p-3.5 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F4F8]">
                <CheckCircle size={16} className="text-[#1B6B93]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#161513]">
                    {item.type}
                  </p>
                  <span className="shrink-0 text-xs text-[#697778]">
                    {item.date}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[#697778]">
                  {item.message}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs text-[#697778]/70">
                  <Users size={12} />
                  <span>{item.recipientCount} destinatari</span>
                </div>
              </div>
            </div>
          ))}
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
