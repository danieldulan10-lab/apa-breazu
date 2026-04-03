'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Familie } from '@/lib/types'
import { getMockFamilii, DEMO_ADMIN, DEMO_USER } from '@/lib/mock-data'

// ----------------------------------------------------------------------------
// Context shape
// ----------------------------------------------------------------------------
interface AuthContextValue {
  user: { id: string; email: string } | null
  familie: Familie | null
  loading: boolean
  isAdmin: boolean
  needsPasswordReset: boolean
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
  signUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>
  signOut: () => Promise<void>
  resetPassword: (newPassword: string) => Promise<void>
  requestOtp: (email: string) => Promise<{ error: string | null }>
  verifyOtp: (email: string, code: string) => Promise<{ error: string | null }>
  resetPasswordWithOtp: (email: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ----------------------------------------------------------------------------
// Demo mode: authenticate against mock data (no Supabase needed)
// ----------------------------------------------------------------------------
const STORAGE_KEY = 'apa-galbenelelor-auth'
const FIRST_LOGIN_PREFIX = 'apa-galbenelelor-first-login-'
const OTP_STORAGE_KEY = 'apa-galbenelelor-otp'

function findFamilieByEmail(email: string): Familie | null {
  const familii = getMockFamilii()
  return familii.find((f) => f.email === email) ?? null
}

// ----------------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [familie, setFamilie] = useState<Familie | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as { email: string }
        const fam = findFamilieByEmail(parsed.email)
        if (fam) {
          setUser({ id: fam.user_id ?? fam.id as string, email: fam.email ?? '' })
          setFamilie(fam)
          // Check first login
          const firstLoginKey = FIRST_LOGIN_PREFIX + parsed.email
          if (!localStorage.getItem(firstLoginKey)) {
            setNeedsPasswordReset(true)
          }
        }
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  // ------ Auth actions ------

  const signIn = useCallback(
    async (email: string, password: string) => {
      const trimmed = email.trim().toLowerCase()

      // Accept any email from mock families with password "demo1234"
      if (password === 'demo1234') {
        const fam = findFamilieByEmail(trimmed)
        if (fam) {
          setUser({ id: fam.user_id ?? fam.id as string, email: trimmed })
          setFamilie(fam)
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: trimmed }))
          // Check first login
          const firstLoginKey = FIRST_LOGIN_PREFIX + trimmed
          if (!localStorage.getItem(firstLoginKey)) {
            setNeedsPasswordReset(true)
          } else {
            setNeedsPasswordReset(false)
          }
          return { error: null }
        }
      }

      return { error: { message: 'Email sau parola incorecta.' } }
    },
    [],
  )

  const signUp = useCallback(
    async (_email: string, _password: string) => {
      return { error: { message: 'Inregistrarea nu este disponibila in modul demo.' } }
    },
    [],
  )

  const signOut = useCallback(async () => {
    setUser(null)
    setFamilie(null)
    setNeedsPasswordReset(false)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const resetPassword = useCallback(async (_newPassword: string) => {
    if (!user) return
    const firstLoginKey = FIRST_LOGIN_PREFIX + user.email
    localStorage.setItem(firstLoginKey, 'done')
    setNeedsPasswordReset(false)
  }, [user])

  const requestOtp = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase()
    const fam = findFamilieByEmail(trimmed)
    if (!fam) {
      return { error: 'Adresa de email nu a fost gasita.' }
    }
    // In demo mode, always use "123456"
    const otpCode = '123456'
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify({ email: trimmed, code: otpCode, ts: Date.now() }))
    return { error: null }
  }, [])

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const trimmed = email.trim().toLowerCase()
    try {
      const stored = localStorage.getItem(OTP_STORAGE_KEY)
      if (!stored) return { error: 'Codul OTP a expirat. Solicita un cod nou.' }
      const parsed = JSON.parse(stored) as { email: string; code: string; ts: number }
      if (parsed.email !== trimmed) return { error: 'Codul OTP nu corespunde.' }
      if (parsed.code !== code) return { error: 'Codul OTP este incorect.' }
      // OTP valid for 5 minutes
      if (Date.now() - parsed.ts > 5 * 60 * 1000) return { error: 'Codul OTP a expirat. Solicita un cod nou.' }
      return { error: null }
    } catch {
      return { error: 'Eroare la verificarea codului.' }
    }
  }, [])

  const resetPasswordWithOtp = useCallback(async (email: string, _newPassword: string) => {
    const trimmed = email.trim().toLowerCase()
    // Mark first login as done so forced reset is skipped
    const firstLoginKey = FIRST_LOGIN_PREFIX + trimmed
    localStorage.setItem(firstLoginKey, 'done')
    // Clean up OTP
    localStorage.removeItem(OTP_STORAGE_KEY)
  }, [])

  // ------ Derived state ------

  const isAdmin = familie?.rol === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        familie,
        loading,
        isAdmin,
        needsPasswordReset,
        signIn,
        signUp,
        signOut,
        resetPassword,
        requestOtp,
        verifyOtp,
        resetPasswordWithOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
