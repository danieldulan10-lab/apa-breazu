'use client'

import { useState, useMemo } from 'react'
import {
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  FileText,
  Gauge,
  CreditCard,
  CheckCheck,
  ChevronDown,
} from 'lucide-react'
import EmptyState from '@/components/EmptyState'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type NotifSeverity = 'info' | 'success' | 'warning' | 'urgent'
type NotifCategory = 'facturi' | 'index' | 'plati' | 'general'
type TabFilter = 'toate' | NotifCategory

interface Notification {
  id: number
  severity: NotifSeverity
  category: NotifCategory
  title: string
  description: string
  timeAgo: string
  unread: boolean
}

// ---------------------------------------------------------------------------
// Severity config
// ---------------------------------------------------------------------------
const severityConfig: Record<
  NotifSeverity,
  { icon: typeof Info; bg: string; iconColor: string; ring: string }
> = {
  info: {
    icon: Info,
    bg: 'bg-[#1B6B93]/10',
    iconColor: 'text-[#1B6B93]',
    ring: 'ring-[#1B6B93]/20',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-[#508223]/10',
    iconColor: 'text-[#508223]',
    ring: 'ring-[#508223]/20',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[#AC630C]/10',
    iconColor: 'text-[#AC630C]',
    ring: 'ring-[#AC630C]/20',
  },
  urgent: {
    icon: AlertOctagon,
    bg: 'bg-[#C74634]/10',
    iconColor: 'text-[#C74634]',
    ring: 'ring-[#C74634]/20',
  },
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------
const tabs: { key: TabFilter; label: string; icon: typeof Bell }[] = [
  { key: 'toate', label: 'Toate', icon: Bell },
  { key: 'facturi', label: 'Facturi', icon: FileText },
  { key: 'index', label: 'Index', icon: Gauge },
  { key: 'plati', label: 'Plati', icon: CreditCard },
]

// ---------------------------------------------------------------------------
// Mock data (10 items, newest first)
// ---------------------------------------------------------------------------
const initialNotifications: Notification[] = [
  {
    id: 1,
    severity: 'urgent',
    category: 'facturi',
    title: 'Factura noua disponibila',
    description: 'Perioada Oct-Nov 2025: 287.16 RON de plata',
    timeAgo: 'acum 2 ore',
    unread: true,
  },
  {
    id: 2,
    severity: 'success',
    category: 'index',
    title: 'Index validat',
    description: 'Indexul 987.00 mc a fost validat de administrator',
    timeAgo: 'acum 1 zi',
    unread: true,
  },
  {
    id: 3,
    severity: 'warning',
    category: 'index',
    title: 'Reminder raportare',
    description: 'Raportati indexul pana la 05.03.2026',
    timeAgo: 'acum 3 zile',
    unread: true,
  },
  {
    id: 4,
    severity: 'success',
    category: 'plati',
    title: 'Plata confirmata',
    description: 'Plata de 241.80 RON pentru Aug-Sep 2025 a fost confirmata',
    timeAgo: 'acum 1 saptamana',
    unread: false,
  },
  {
    id: 5,
    severity: 'info',
    category: 'general',
    title: 'Perioada noua deschisa',
    description: 'Perioada Dec-Ian 2026 a fost deschisa. Raportati indexul!',
    timeAgo: 'acum 2 saptamani',
    unread: false,
  },
  {
    id: 6,
    severity: 'urgent',
    category: 'plati',
    title: 'Plata respinsa',
    description: 'Plata pentru Iun-Iul 2025 a fost respinsa: suma incorecta',
    timeAgo: 'acum 3 saptamani',
    unread: true,
  },
  {
    id: 7,
    severity: 'info',
    category: 'index',
    title: 'Index estimat',
    description: 'Indexul pentru Andra Bostanaru a fost estimat la 709 mc',
    timeAgo: 'acum 1 luna',
    unread: false,
  },
  {
    id: 8,
    severity: 'success',
    category: 'facturi',
    title: 'Repartizare finalizata',
    description: 'Repartizarea pentru Aug-Sep 2025 a fost confirmata',
    timeAgo: 'acum 1 luna',
    unread: false,
  },
  {
    id: 9,
    severity: 'warning',
    category: 'plati',
    title: 'Reminder plata',
    description: 'Aveti o factura neplatita de 198.44 RON',
    timeAgo: 'acum 6 saptamani',
    unread: false,
  },
  {
    id: 10,
    severity: 'info',
    category: 'general',
    title: 'Bun venit!',
    description: 'Contul dumneavoastra a fost creat in ApaGalbenelelor',
    timeAgo: 'acum 2 luni',
    unread: false,
  },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function NotificariPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState<TabFilter>('toate')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  )

  const filtered = useMemo(() => {
    if (activeTab === 'toate') return notifications
    return notifications.filter((n) => n.category === activeTab)
  }, [notifications, activeTab])

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    )
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleTap = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      handleMarkRead(id)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-[#161513]">Notificari</h1>
          {unreadCount > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#C74634] px-1.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.97]"
          >
            <CheckCheck size={16} />
            Citeste tot
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon
          const tabUnread =
            tab.key === 'toate'
              ? unreadCount
              : notifications.filter(
                  (n) => n.category === tab.key && n.unread,
                ).length

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                isActive
                  ? 'bg-[#1B6B93] text-white shadow-sm'
                  : 'bg-white text-[#697778] shadow-sm hover:bg-[#E8F4F8]'
              }`}
            >
              <Icon size={15} />
              {tab.label}
              {tabUnread > 0 && (
                <span
                  className={`ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#C74634]/10 text-[#C74634]'
                  }`}
                >
                  {tabUnread}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<BellOff size={48} />}
          title="Nicio notificare noua"
          description="Nu aveti notificari in aceasta categorie."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const config = severityConfig[n.severity]
            const Icon = config.icon
            const isExpanded = expandedId === n.id

            return (
              <button
                key={n.id}
                type="button"
                onClick={() => handleTap(n.id)}
                className={`card-hover relative w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all duration-200 ${
                  n.unread ? 'ring-1 ' + config.ring : ''
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon circle */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                  >
                    <Icon size={20} className={config.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          n.unread ? 'font-bold' : 'font-medium'
                        } text-[#161513]`}
                      >
                        {n.title}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        {n.unread && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#1B6B93]" />
                        )}
                        <ChevronDown
                          size={16}
                          className={`text-[#697778]/50 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                    <p className="mt-0.5 text-sm text-[#697778]">
                      {n.description}
                    </p>
                    <p className="mt-1 text-xs text-[#697778]/60">{n.timeAgo}</p>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="mt-3 rounded-xl bg-[#F1EFED] px-3 py-2.5 text-xs text-[#697778]">
                        <p>Glisati spre stanga pentru a marca ca citit.</p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
