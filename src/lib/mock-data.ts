// ============================================================================
// ApaGalbenelelor - Mock data for development without a live Supabase instance
// ============================================================================

import type {
  Familie,
  PerioadaFacturare,
  Index,
  Repartizare,
  Plata,
} from './types'

// ---------------------------------------------------------------------------
// Helper: deterministic UUID-like IDs for consistency across calls
// ---------------------------------------------------------------------------
const fid = (n: number) => `fam-${String(n).padStart(3, '0')}`
const pid = (n: number) => `per-${String(n).padStart(3, '0')}`
const iid = (f: number, p: number) => `idx-${String(f).padStart(3, '0')}-${String(p).padStart(3, '0')}`
const rid = (f: number, p: number) => `rep-${String(f).padStart(3, '0')}-${String(p).padStart(3, '0')}`

// ---------------------------------------------------------------------------
// Demo auth user IDs (would come from Supabase Auth in production)
// ---------------------------------------------------------------------------
const ADMIN_USER_ID = 'auth-admin-iliescu'
const DEMO_USER_ID = 'auth-user-demo'

// ---------------------------------------------------------------------------
// 25 Families
// ---------------------------------------------------------------------------
const familii: Familie[] = [
  { id: fid(1),  user_id: ADMIN_USER_ID, nume: 'Iliescu Ioan',       email: 'ioan.iliescu@email.ro',    telefon: '0722100001', serie_apometru: 'AP-001', activ: true,  rol: 'admin' },
  { id: fid(2),  user_id: DEMO_USER_ID,  nume: 'Popescu Ion',        email: 'ion.popescu@email.ro',     telefon: '0722100002', serie_apometru: 'AP-002', activ: true,  rol: 'user' },
  { id: fid(3),  user_id: null,           nume: 'Ionescu Maria',      email: 'maria.ionescu@email.ro',   telefon: '0722100003', serie_apometru: 'AP-003', activ: true,  rol: 'user' },
  { id: fid(4),  user_id: null,           nume: 'Gheorghe Vasile',    email: 'vasile.gheorghe@email.ro', telefon: '0722100004', serie_apometru: 'AP-004', activ: true,  rol: 'user' },
  { id: fid(5),  user_id: null,           nume: 'Radu Elena',         email: 'elena.radu@email.ro',      telefon: '0722100005', serie_apometru: 'AP-005', activ: true,  rol: 'user' },
  { id: fid(6),  user_id: null,           nume: 'Stan Mihai',         email: 'mihai.stan@email.ro',      telefon: '0722100006', serie_apometru: 'AP-006', activ: true,  rol: 'user' },
  { id: fid(7),  user_id: null,           nume: 'Popa Alexandru',     email: 'alex.popa@email.ro',       telefon: '0722100007', serie_apometru: 'AP-007', activ: true,  rol: 'user' },
  { id: fid(8),  user_id: null,           nume: 'Stoica Ana',         email: 'ana.stoica@email.ro',      telefon: '0722100008', serie_apometru: 'AP-008', activ: true,  rol: 'user' },
  { id: fid(9),  user_id: null,           nume: 'Dumitru George',     email: 'george.dumitru@email.ro',  telefon: '0722100009', serie_apometru: 'AP-009', activ: true,  rol: 'user' },
  { id: fid(10), user_id: null,           nume: 'Barbu Cristina',     email: 'cristina.barbu@email.ro',  telefon: '0722100010', serie_apometru: 'AP-010', activ: true,  rol: 'user' },
  { id: fid(11), user_id: null,           nume: 'Marin Florin',       email: 'florin.marin@email.ro',    telefon: '0722100011', serie_apometru: 'AP-011', activ: true,  rol: 'user' },
  { id: fid(12), user_id: null,           nume: 'Tudor Andreea',      email: 'andreea.tudor@email.ro',   telefon: '0722100012', serie_apometru: 'AP-012', activ: true,  rol: 'user' },
  { id: fid(13), user_id: null,           nume: 'Moldovan Petru',     email: 'petru.moldovan@email.ro',  telefon: '0722100013', serie_apometru: 'AP-013', activ: true,  rol: 'user' },
  { id: fid(14), user_id: null,           nume: 'Nistor Raluca',      email: 'raluca.nistor@email.ro',   telefon: '0722100014', serie_apometru: 'AP-014', activ: true,  rol: 'user' },
  { id: fid(15), user_id: null,           nume: 'Cosma Bogdan',       email: 'bogdan.cosma@email.ro',    telefon: '0722100015', serie_apometru: 'AP-015', activ: true,  rol: 'user' },
  { id: fid(16), user_id: null,           nume: 'Lazar Simona',       email: 'simona.lazar@email.ro',    telefon: '0722100016', serie_apometru: 'AP-016', activ: true,  rol: 'user' },
  { id: fid(17), user_id: null,           nume: 'Matei Dragos',       email: 'dragos.matei@email.ro',    telefon: '0722100017', serie_apometru: 'AP-017', activ: true,  rol: 'user' },
  { id: fid(18), user_id: null,           nume: 'Ciobanu Ioana',     email: 'ioana.ciobanu@email.ro',   telefon: '0722100018', serie_apometru: 'AP-018', activ: true,  rol: 'user' },
  { id: fid(19), user_id: null,           nume: 'Szabo Attila',       email: 'attila.szabo@email.ro',    telefon: '0722100019', serie_apometru: 'AP-019', activ: true,  rol: 'user' },
  { id: fid(20), user_id: null,           nume: 'Rus Ovidiu',         email: 'ovidiu.rus@email.ro',      telefon: '0722100020', serie_apometru: 'AP-020', activ: true,  rol: 'user' },
  { id: fid(21), user_id: null,           nume: 'Muntean Lavinia',    email: 'lavinia.muntean@email.ro', telefon: '0722100021', serie_apometru: 'AP-021', activ: true,  rol: 'user' },
  { id: fid(22), user_id: null,           nume: 'Suciu Dan',          email: 'dan.suciu@email.ro',       telefon: '0722100022', serie_apometru: 'AP-022', activ: true,  rol: 'user' },
  { id: fid(23), user_id: null,           nume: 'Crisan Adriana',     email: 'adriana.crisan@email.ro',  telefon: '0722100023', serie_apometru: 'AP-023', activ: true,  rol: 'user' },
  { id: fid(24), user_id: null,           nume: 'Sabau Liviu',        email: 'liviu.sabau@email.ro',     telefon: '0722100024', serie_apometru: 'AP-024', activ: false, rol: 'user' },
  { id: fid(25), user_id: null,           nume: 'Olar Gabriela',      email: 'gabriela.olar@email.ro',   telefon: '0722100025', serie_apometru: 'AP-025', activ: true,  rol: 'user' },
]

// ---------------------------------------------------------------------------
// 2 Billing Periods
// ---------------------------------------------------------------------------
const perioade: PerioadaFacturare[] = [
  {
    id: pid(1),
    luna_start: '2025-10-01',
    luna_end: '2025-11-01',
    nr_factura: 'F-2025-042',
    suma_factura: 6820.50,
    index_central_anterior: 14520,
    index_central_curent: 15142,
    consum_central: 622,
    pret_mc: 10.97,
    status: 'inchisa',
    deadline_raportare: '2025-11-05',
  },
  {
    id: pid(2),
    luna_start: '2025-12-01',
    luna_end: '2026-01-01',
    nr_factura: 'F-2025-058',
    suma_factura: 7435.20,
    index_central_anterior: 15142,
    index_central_curent: 15820,
    consum_central: 678,
    pret_mc: 10.97,
    status: 'deschisa',
    deadline_raportare: '2026-01-07',
  },
]

// ---------------------------------------------------------------------------
// Individual consumption data per family per period
// Realistic: 10-50 mc individual, small loss share, ~11 lei/mc
// ---------------------------------------------------------------------------
interface ConsumData {
  indexAnterior: number
  indexCurent: number
  consumIndividual: number
}

// Seed consumption for period 1 (Oct-Nov 2025)
const consumP1: Record<number, ConsumData> = {
  1:  { indexAnterior: 1230, indexCurent: 1258, consumIndividual: 28 },
  2:  { indexAnterior: 890,  indexCurent: 912,  consumIndividual: 22 },
  3:  { indexAnterior: 456,  indexCurent: 487,  consumIndividual: 31 },
  4:  { indexAnterior: 1102, indexCurent: 1118, consumIndividual: 16 },
  5:  { indexAnterior: 678,  indexCurent: 720,  consumIndividual: 42 },
  6:  { indexAnterior: 334,  indexCurent: 359,  consumIndividual: 25 },
  7:  { indexAnterior: 2010, indexCurent: 2045, consumIndividual: 35 },
  8:  { indexAnterior: 560,  indexCurent: 573,  consumIndividual: 13 },
  9:  { indexAnterior: 1445, indexCurent: 1479, consumIndividual: 34 },
  10: { indexAnterior: 789,  indexCurent: 807,  consumIndividual: 18 },
  11: { indexAnterior: 312,  indexCurent: 339,  consumIndividual: 27 },
  12: { indexAnterior: 1678, indexCurent: 1699, consumIndividual: 21 },
  13: { indexAnterior: 445,  indexCurent: 481,  consumIndividual: 36 },
  14: { indexAnterior: 923,  indexCurent: 952,  consumIndividual: 29 },
  15: { indexAnterior: 1567, indexCurent: 1586, consumIndividual: 19 },
  16: { indexAnterior: 234,  indexCurent: 278,  consumIndividual: 44 },
  17: { indexAnterior: 1890, indexCurent: 1912, consumIndividual: 22 },
  18: { indexAnterior: 667,  indexCurent: 698,  consumIndividual: 31 },
  19: { indexAnterior: 1034, indexCurent: 1047, consumIndividual: 13 },
  20: { indexAnterior: 512,  indexCurent: 549,  consumIndividual: 37 },
  21: { indexAnterior: 278,  indexCurent: 296,  consumIndividual: 18 },
  22: { indexAnterior: 1456, indexCurent: 1482, consumIndividual: 26 },
  23: { indexAnterior: 834,  indexCurent: 854,  consumIndividual: 20 },
  24: { indexAnterior: 145,  indexCurent: 156,  consumIndividual: 11 },
  25: { indexAnterior: 390,  indexCurent: 423,  consumIndividual: 33 },
}

// Period 2 continues from where period 1 ended
const consumP2: Record<number, ConsumData> = {
  1:  { indexAnterior: 1258, indexCurent: 1290, consumIndividual: 32 },
  2:  { indexAnterior: 912,  indexCurent: 938,  consumIndividual: 26 },
  3:  { indexAnterior: 487,  indexCurent: 522,  consumIndividual: 35 },
  4:  { indexAnterior: 1118, indexCurent: 1137, consumIndividual: 19 },
  5:  { indexAnterior: 720,  indexCurent: 768,  consumIndividual: 48 },
  6:  { indexAnterior: 359,  indexCurent: 387,  consumIndividual: 28 },
  7:  { indexAnterior: 2045, indexCurent: 2083, consumIndividual: 38 },
  8:  { indexAnterior: 573,  indexCurent: 588,  consumIndividual: 15 },
  9:  { indexAnterior: 1479, indexCurent: 1517, consumIndividual: 38 },
  10: { indexAnterior: 807,  indexCurent: 828,  consumIndividual: 21 },
  11: { indexAnterior: 339,  indexCurent: 369,  consumIndividual: 30 },
  12: { indexAnterior: 1699, indexCurent: 1723, consumIndividual: 24 },
  13: { indexAnterior: 481,  indexCurent: 521,  consumIndividual: 40 },
  14: { indexAnterior: 952,  indexCurent: 984,  consumIndividual: 32 },
  15: { indexAnterior: 1586, indexCurent: 1608, consumIndividual: 22 },
  16: { indexAnterior: 278,  indexCurent: 326,  consumIndividual: 48 },
  17: { indexAnterior: 1912, indexCurent: 1937, consumIndividual: 25 },
  18: { indexAnterior: 698,  indexCurent: 733,  consumIndividual: 35 },
  19: { indexAnterior: 1047, indexCurent: 1062, consumIndividual: 15 },
  20: { indexAnterior: 549,  indexCurent: 590,  consumIndividual: 41 },
  21: { indexAnterior: 296,  indexCurent: 317,  consumIndividual: 21 },
  22: { indexAnterior: 1482, indexCurent: 1511, consumIndividual: 29 },
  23: { indexAnterior: 854,  indexCurent: 877,  consumIndividual: 23 },
  24: { indexAnterior: 156,  indexCurent: 168,  consumIndividual: 12 },
  25: { indexAnterior: 423,  indexCurent: 460,  consumIndividual: 37 },
}

// ---------------------------------------------------------------------------
// Build indexes, repartizari from consumption data
// ---------------------------------------------------------------------------
function buildIndexuri(
  consumMap: Record<number, ConsumData>,
  perioadaIndex: number,
  dataRaportare: string,
): Index[] {
  return Object.entries(consumMap).map(([fNum, data]) => {
    const f = Number(fNum)
    const mods: Array<'scan' | 'manual' | 'estimat'> = ['scan', 'manual', 'estimat']
    return {
      id: iid(f, perioadaIndex),
      familie_id: fid(f),
      perioada_id: pid(perioadaIndex),
      valoare_index: data.indexCurent,
      mod_raportare: f <= 10 ? 'scan' : f <= 20 ? 'manual' : mods[f % 3],
      foto_apometru_url: f <= 10 ? `/mock/foto-ap-${f}.jpg` : null,
      data_raportare: dataRaportare,
      validat: perioadaIndex === 1, // period 1 is closed, all validated
    }
  })
}

function buildRepartizari(
  consumMap: Record<number, ConsumData>,
  perioadaIndex: number,
  pretMc: number,
  consumCentral: number,
): Repartizare[] {
  const totalIndividual = Object.values(consumMap).reduce(
    (sum, d) => sum + d.consumIndividual,
    0,
  )
  // Losses = central consumption minus sum of individual readings
  const pierderiTotale = consumCentral - totalIndividual

  return Object.entries(consumMap).map(([fNum, data]) => {
    const f = Number(fNum)
    // Distribute losses proportionally to individual consumption
    const cotaPierderi =
      totalIndividual > 0
        ? Math.round((data.consumIndividual / totalIndividual) * pierderiTotale * 100) / 100
        : 0
    const consumTotal = data.consumIndividual + cotaPierderi
    const sumaPlata = Math.round(consumTotal * pretMc * 100) / 100

    const statuses: Array<'neplatit' | 'pending' | 'platit'> =
      perioadaIndex === 1
        ? // Period 1 (closed): most paid
          f <= 20 ? ['platit'] : f <= 23 ? ['pending'] : ['neplatit']
        : // Period 2 (open): most unpaid
          f <= 5 ? ['platit'] : f <= 10 ? ['pending'] : ['neplatit']

    return {
      id: rid(f, perioadaIndex),
      familie_id: fid(f),
      perioada_id: pid(perioadaIndex),
      index_anterior: data.indexAnterior,
      index_curent: data.indexCurent,
      consum_individual: data.consumIndividual,
      cota_pierderi: cotaPierderi,
      consum_total: Math.round(consumTotal * 100) / 100,
      suma_plata: sumaPlata,
      status: statuses[0],
    }
  })
}

// Pre-build collections
const indexuriP1 = buildIndexuri(consumP1, 1, '2025-11-03T10:00:00Z')
const indexuriP2 = buildIndexuri(consumP2, 2, '2026-01-05T10:00:00Z')
const allIndexuri = [...indexuriP1, ...indexuriP2]

const repartizariP1 = buildRepartizari(consumP1, 1, 10.97, 622)
const repartizariP2 = buildRepartizari(consumP2, 2, 10.97, 678)
const allRepartizari = [...repartizariP1, ...repartizariP2]

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** All 25 families */
export function getMockFamilii(): Familie[] {
  return familii
}

/** Both billing periods */
export function getMockPerioade(): PerioadaFacturare[] {
  return perioade
}

/** Meter readings, optionally filtered by familie */
export function getMockIndexuri(familieId?: string): Index[] {
  if (!familieId) return allIndexuri
  return allIndexuri.filter((i) => i.familie_id === familieId)
}

/** Cost distributions, optionally filtered by familie */
export function getMockRepartizari(familieId?: string): Repartizare[] {
  if (!familieId) return allRepartizari
  return allRepartizari.filter((r) => r.familie_id === familieId)
}

/** Demo admin credentials (for login page placeholder) */
export const DEMO_ADMIN = {
  email: 'ioan.iliescu@email.ro',
  password: 'demo1234',
  familieId: fid(1),
} as const

/** Demo regular user credentials */
export const DEMO_USER = {
  email: 'ion.popescu@email.ro',
  password: 'demo1234',
  familieId: fid(2),
} as const
