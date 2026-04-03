'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Droplets,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export default function HomePage() {
  const { familie, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (familie) {
      router.replace(isAdmin ? '/admin' : '/user')
    }
  }, [familie, isAdmin, router])

  if (!familie) return null

  // Fallback render while redirecting
  if (familie.rol === 'admin') {
    return <AdminDashboard />
  }

  return <UserDashboard nume={familie.nume} />
}

/* -------------------------------------------------------------------------- */
/*  Admin dashboard placeholder                                               */
/* -------------------------------------------------------------------------- */
function AdminDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold" style={{ color: '#0F4C75' }}>
        Dashboard Admin
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          label="Familii active"
          value="25"
          icon={<Droplets size={20} style={{ color: '#1B6B93' }} />}
        />
        <SummaryCard
          label="Perioada curenta"
          value="Mar 2026"
          icon={<ArrowUpRight size={20} style={{ color: '#508223' }} />}
        />
        <SummaryCard
          label="Neplatite"
          value="8"
          icon={<AlertCircle size={20} style={{ color: '#C74634' }} />}
        />
        <SummaryCard
          label="Incasate"
          value="17"
          icon={<CheckCircle2 size={20} style={{ color: '#508223' }} />}
        />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2" style={{ color: '#161513' }}>
          Actiuni rapide
        </h3>
        <div className="flex flex-col gap-2">
          <button className="btn-primary w-full">Perioada noua</button>
          <button className="btn-secondary w-full">Genereaza repartizare</button>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  User dashboard placeholder                                                */
/* -------------------------------------------------------------------------- */
function UserDashboard({ nume }: { nume: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold" style={{ color: '#0F4C75' }}>
        Bine ai venit, <span className="capitalize">{nume}</span>!
      </h2>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: '#161513' }}>
            Ultima factura
          </h3>
          <span className="status-neplatit">Neplatit</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: '#697778' }}>Perioada</span>
          <span className="font-medium">Mar 2026</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: '#697778' }}>Consum</span>
          <span className="font-medium">4.2 mc</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span style={{ color: '#697778' }}>Suma</span>
          <span className="font-bold text-base" style={{ color: '#C74634' }}>
            32.50 lei
          </span>
        </div>
        <button className="btn-primary w-full">Plateste acum</button>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2" style={{ color: '#161513' }}>
          Raporteaza index
        </h3>
        <p className="text-sm mb-3" style={{ color: '#697778' }}>
          Fotografiaza apometrul sau introdu valoarea manual.
        </p>
        <button className="btn-secondary w-full">Scan apometru</button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Summary card widget                                                       */
/* -------------------------------------------------------------------------- */
function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: '#161513' }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: '#697778' }}>
        {label}
      </p>
    </div>
  )
}
