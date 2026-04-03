'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, user } = useAuth()
  const router = useRouter()

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

  if (user) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completeaza email si parola.')
      return
    }

    setSubmitting(true)
    try {
      const { error: authError } = await signIn(email, password)
      if (authError) {
        setError(authError.message || 'Autentificare esuata. Incearca din nou.')
      } else {
        router.replace('/')
      }
    } catch {
      setError('Autentificare esuata. Incearca din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex flex-1 items-center justify-center px-4"
      style={{ minHeight: '100dvh', backgroundColor: '#E8F4F8' }}
    >
      <div className="card w-full" style={{ maxWidth: 400 }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-4xl" role="img" aria-label="water">
            💧
          </span>
          <h1
            className="text-2xl font-bold mt-2"
            style={{ color: '#0F4C75' }}
          >
            ApaGalbenelelor
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: '#697778' }}
          >
            Gestiune retea apa Galbenelelor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#161513' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="exemplu@email.ro"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#161513' }}
            >
              Parola
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Introdu parola"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
            className="btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Se autentifica...' : 'Autentificare'}
          </button>

          <a
            href="/reset-parola"
            className="mt-3 block text-center text-sm font-medium hover:underline"
            style={{ color: '#1B6B93' }}
          >
            Ai uitat parola?
          </a>
        </form>
      </div>
    </div>
  )
}
