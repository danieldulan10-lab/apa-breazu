'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function getPasswordStrength(password: string): { label: string; color: string; percent: number } {
  if (password.length < 6) return { label: 'Slaba', color: '#C74634', percent: 33 }
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const strong = password.length >= 8 && hasMixed && (hasNumber || hasSpecial)
  if (strong) return { label: 'Puternica', color: '#508223', percent: 100 }
  return { label: 'Medie', color: '#AC630C', percent: 66 }
}

export default function ResetParolaObligatoriePage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { resetPassword } = useAuth()
  const router = useRouter()

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Parola trebuie sa aiba cel putin 6 caractere.')
      return
    }
    if (password !== confirmPassword) {
      setError('Parolele nu coincid.')
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(password)
      router.replace('/')
    } catch {
      setError('Eroare la salvarea parolei.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex flex-1 items-center justify-center px-4"
      style={{ minHeight: '100dvh' }}
    >
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {/* Lock icon */}
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: '#1B6B93', opacity: 0.15 }}
            >
            </div>
            <div className="-mt-14 flex h-16 w-16 items-center justify-center">
              <svg
                className="h-8 w-8"
                style={{ color: '#1B6B93' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-bold" style={{ color: '#0F4C75' }}>
              Resetare Parola Obligatorie
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#697778' }}>
              Pentru securitate, va rugam sa va schimbati parola la prima autentificare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#161513' }}
              >
                Parola noua
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Minim 6 caractere"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${strength.percent}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <p
                    className="mt-1 text-xs font-medium"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#161513' }}
              >
                Confirma parola
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeta parola noua"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: '#C74634' }}>
                  Parolele nu coincid
                </p>
              )}
            </div>

            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: '#C74634' }}
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
              style={{ backgroundColor: '#1B6B93' }}
            >
              {submitting ? 'Se salveaza...' : 'Salveaza Parola Noua'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
