'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { getMockFamilii } from '@/lib/mock-data'

export default function FamiliiPage() {
  const familii = useMemo(() => getMockFamilii(), [])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return familii
    const q = search.trim().toLowerCase()
    return familii.filter((f) => f.nume.toLowerCase().includes(q))
  }, [familii, search])

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#161513]">Gestiune Familii</h1>
        <span className="rounded-full bg-[#1B6B93]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1B6B93]">
          {familii.length}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#697778]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cauta dupa nume..."
          className="input pl-10"
        />
      </div>

      {/* Family list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[#697778]">
            Nicio familie gasita.
          </p>
        )}

        {filtered.map((f) => (
          <div key={f.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#161513]">
                    {f.nume}
                  </h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      f.activ
                        ? 'bg-[#508223]/15 text-[#508223]'
                        : 'bg-[#6B7280]/15 text-[#6B7280]'
                    }`}
                  >
                    {f.activ ? 'Activ' : 'Inactiv'}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-[#697778]">
                  <p>
                    Apometru:{' '}
                    <span className="font-medium text-[#161513]">
                      {f.serie_apometru ?? '---'}
                    </span>
                  </p>
                  {f.telefon && (
                    <p>
                      Telefon:{' '}
                      <span className="font-medium text-[#161513]">
                        {f.telefon}
                      </span>
                    </p>
                  )}
                  {f.email && (
                    <p>
                      Email:{' '}
                      <span className="font-medium text-[#161513]">
                        {f.email}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
