// ============================================================================
// ApaGalbenelelor - TypeScript types matching Supabase DB schema
// ============================================================================

export type RolFamilie = 'admin' | 'user'
export type ModRaportare = 'scan' | 'manual' | 'estimat'
export type StatusRepartizare = 'neplatit' | 'pending' | 'platit'
export type StatusPlata = 'pending' | 'confirmat' | 'respins'
export type StatusPerioada = 'deschisa' | 'inchisa' | 'in_calcul'

// ----------------------------------------------------------------------------
// Familie (families / apartments)
// ----------------------------------------------------------------------------
export interface Familie {
  id: string
  user_id: string | null
  nume: string
  email: string | null
  telefon: string | null
  serie_apometru: string | null
  activ: boolean
  rol: RolFamilie
  created_at?: string
  updated_at?: string
}

// ----------------------------------------------------------------------------
// PerioadaFacturare (billing period)
// ----------------------------------------------------------------------------
export interface PerioadaFacturare {
  id: string
  luna_start: string          // ISO date (YYYY-MM-DD)
  luna_end: string            // ISO date (YYYY-MM-DD)
  nr_factura: string | null
  suma_factura: number | null // total invoice amount (lei)
  index_central_anterior: number | null
  index_central_curent: number | null
  consum_central: number | null  // mc
  pret_mc: number | null         // lei/mc
  status: StatusPerioada
  deadline_raportare: string | null // ISO date
  created_at?: string
  updated_at?: string
}

// ----------------------------------------------------------------------------
// Index (meter readings per family per period)
// ----------------------------------------------------------------------------
export interface Index {
  id: string
  familie_id: string
  perioada_id: string
  valoare_index: number
  mod_raportare: ModRaportare
  foto_apometru_url: string | null
  data_raportare: string        // ISO timestamp
  validat: boolean
  created_at?: string
}

// ----------------------------------------------------------------------------
// Repartizare (cost distribution per family per period)
// ----------------------------------------------------------------------------
export interface Repartizare {
  id: string
  familie_id: string
  perioada_id: string
  index_anterior: number
  index_curent: number
  consum_individual: number     // mc
  cota_pierderi: number         // mc (shared losses quota)
  consum_total: number          // mc (individual + losses)
  suma_plata: number            // lei
  status: StatusRepartizare
  created_at?: string
  updated_at?: string
}

// ----------------------------------------------------------------------------
// Plata (payments)
// ----------------------------------------------------------------------------
export interface Plata {
  id: string
  repartizare_id: string
  familie_id: string
  suma_platita: number          // lei
  data_plata: string            // ISO date
  dovada_url: string | null
  mod_plata: string             // e.g. 'transfer', 'numerar', 'card'
  nr_referinta: string | null
  status: StatusPlata
  motiv_respingere: string | null
  created_at?: string
}

// ----------------------------------------------------------------------------
// Convenience types for joined queries
// ----------------------------------------------------------------------------
export interface RepartizareCuFamilie extends Repartizare {
  familie: Familie
}

export interface IndexCuFamilie extends Index {
  familie: Familie
}

export interface RepartizareCuPlati extends Repartizare {
  plati: Plata[]
}
