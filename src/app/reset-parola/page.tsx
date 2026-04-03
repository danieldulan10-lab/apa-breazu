'use client'

import { useState, useEffect, useCallback, FormEvent, useRef } from 'react'
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

type Step = 'email' | 'otp' | 'password' | 'success'

export default function ResetParolaPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { requestOtp, verifyOtp, resetPasswordWithOtp } = useAuth()
  const router = useRouter()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const strength = getPasswordStrength(password)

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Redirect to login after success
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => router.push('/login'), 2000)
      return () => clearTimeout(timer)
    }
  }, [step, router])

  const handleSendOtp = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Introduceti adresa de email.')
      return
    }
    setSubmitting(true)
    try {
      const result = await requestOtp(email)
      if (result.error) {
        setError(result.error)
      } else {
        setStep('otp')
        setCountdown(60)
      }
    } catch {
      setError('Eroare la trimiterea codului.')
    } finally {
      setSubmitting(false)
    }
  }, [email, requestOtp])

  const handleResendOtp = useCallback(async () => {
    setError('')
    const result = await requestOtp(email)
    if (result.error) {
      setError(result.error)
    } else {
      setCountdown(60)
      setOtpDigits(['', '', '', '', '', ''])
    }
  }, [email, requestOtp])

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    setOtpDigits((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }, [])

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }, [otpDigits])

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 0) return
    const newDigits = [...otpDigits]
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i]
    }
    setOtpDigits(newDigits)
    const focusIdx = Math.min(pasted.length, 5)
    otpRefs.current[focusIdx]?.focus()
  }, [otpDigits])

  const handleVerifyOtp = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const code = otpDigits.join('')
    if (code.length !== 6) {
      setError('Introduceti codul complet de 6 cifre.')
      return
    }
    setSubmitting(true)
    try {
      const result = await verifyOtp(email, code)
      if (result.error) {
        setError(result.error)
      } else {
        setStep('password')
      }
    } catch {
      setError('Eroare la verificarea codului.')
    } finally {
      setSubmitting(false)
    }
  }, [otpDigits, email, verifyOtp])

  const handleResetPassword = useCallback(async (e: FormEvent) => {
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
      await resetPasswordWithOtp(email, password)
      setStep('success')
    } catch {
      setError('Eroare la resetarea parolei.')
    } finally {
      setSubmitting(false)
    }
  }, [password, confirmPassword, email, resetPasswordWithOtp])

  return (
    <div
      className="flex flex-1 items-center justify-center px-4"
      style={{ minHeight: '100dvh', backgroundColor: '#E8F4F8' }}
    >
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-6">
            <span className="text-4xl" role="img" aria-label="water">
              💧
            </span>
            <h1 className="text-xl font-bold mt-2" style={{ color: '#0F4C75' }}>
              Resetare Parola
            </h1>
          </div>

          {/* ============================================================= */}
          {/* STEP 1: Email                                                  */}
          {/* ============================================================= */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <p className="text-sm text-center" style={{ color: '#697778' }}>
                Introduceti adresa de email asociata contului.
              </p>
              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#161513' }}
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="exemplu@email.ro"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm font-medium" style={{ color: '#C74634' }} role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                style={{ backgroundColor: '#1B6B93' }}
              >
                {submitting ? 'Se trimite...' : 'Trimite Cod OTP'}
              </button>
              <a
                href="/login"
                className="block text-center text-sm font-medium hover:underline"
                style={{ color: '#1B6B93' }}
              >
                Inapoi la autentificare
              </a>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 2: OTP Verification                                       */}
          {/* ============================================================= */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <p className="text-sm text-center" style={{ color: '#697778' }}>
                Codul a fost trimis pe telefonul asociat contului.
              </p>

              {/* Demo info box */}
              <div
                className="rounded-lg p-3 text-sm text-center"
                style={{ backgroundColor: '#E8F4F8', border: '1px solid #1B6B93', color: '#0F4C75' }}
              >
                <span className="font-semibold">Demo:</span> Codul OTP este{' '}
                <code
                  className="font-bold"
                  style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: 4 }}
                >
                  123456
                </code>
              </div>

              {/* 6-digit OTP inputs */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="flex items-center justify-center rounded-xl border-2 text-center text-2xl font-bold outline-none transition-colors"
                    style={{
                      width: 48,
                      height: 56,
                      borderColor: digit ? '#1B6B93' : '#D1D5DB',
                      fontFamily: 'monospace',
                      color: '#161513',
                    }}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm font-medium text-center" style={{ color: '#C74634' }} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                style={{ backgroundColor: '#1B6B93' }}
              >
                {submitting ? 'Se verifica...' : 'Verifica Codul'}
              </button>

              {/* Resend timer */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm" style={{ color: '#697778' }}>
                    Retrimite codul in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#1B6B93' }}
                  >
                    Retrimite codul
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 3: New Password                                           */}
          {/* ============================================================= */}
          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <p className="text-sm text-center" style={{ color: '#697778' }}>
                Introduceti noua parola pentru contul dvs.
              </p>

              <div>
                <label
                  htmlFor="new-pw"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#161513' }}
                >
                  Parola noua
                </label>
                <input
                  id="new-pw"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minim 6 caractere"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                    <p className="mt-1 text-xs font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-pw"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: '#161513' }}
                >
                  Confirma parola
                </label>
                <input
                  id="confirm-pw"
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
                <p className="text-sm font-medium" style={{ color: '#C74634' }} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                style={{ backgroundColor: '#1B6B93' }}
              >
                {submitting ? 'Se reseteaza...' : 'Reseteaza Parola'}
              </button>
            </form>
          )}

          {/* ============================================================= */}
          {/* STEP 4: Success                                                */}
          {/* ============================================================= */}
          {step === 'success' && (
            <div className="flex flex-col items-center py-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: 'rgba(80, 130, 35, 0.15)' }}
              >
                <svg
                  className="h-8 w-8"
                  style={{ color: '#508223' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold" style={{ color: '#161513' }}>
                Parola a fost resetata cu succes!
              </h2>
              <p className="mt-2 text-sm" style={{ color: '#697778' }}>
                Redirectionare catre pagina de autentificare...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
