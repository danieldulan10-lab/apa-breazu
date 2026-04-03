'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export default function DovadaPlataPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ---- state ----
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [suma, setSuma] = useState<number>(287.16)
  const [dataPlata, setDataPlata] = useState<string>(
    new Date().toISOString().slice(0, 10)
  )
  const [nrReferinta, setNrReferinta] = useState<string>('')
  const [metoda, setMetoda] = useState<string>('transfer')
  const [showCamera, setShowCamera] = useState<boolean>(false)
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // ---- cleanup camera on unmount ----
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // ---- camera ----
  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setShowCamera(true)
      setIsCapturing(false)
      setCapturedImage(null)
    } catch {
      setError('Nu s-a putut accesa camera. Verificati permisiunile.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setShowCamera(false)
    setIsCapturing(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(dataUrl)
    setPreviewUrl(dataUrl)
    setSelectedFile(null)
    setIsCapturing(true)
    // stop the stream after capture
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setPreviewUrl(null)
    setIsCapturing(false)
    startCamera()
  }, [startCamera])

  const confirmPhoto = useCallback(() => {
    setShowCamera(false)
    setIsCapturing(false)
    // capturedImage and previewUrl already set
  }, [])

  // ---- file upload ----
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > MAX_FILE_SIZE) {
        setError('Fisierul depaseste limita de 5 MB.')
        return
      }
      setSelectedFile(file)
      setCapturedImage(null)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    },
    []
  )

  // ---- submit ----
  const handleSubmit = useCallback(() => {
    setError(null)
    if (!capturedImage && !selectedFile) {
      setError('Incarcati o fotografie sau alegeti un fisier.')
      return
    }
    if (!suma || suma <= 0) {
      setError('Introduceti suma platita.')
      return
    }
    setSubmitted(true)
    setTimeout(() => {
      router.push('/user')
    }, 2000)
  }, [capturedImage, selectedFile, suma, router])

  // ---- success screen ----
  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#508223]/15">
          <svg
            className="h-10 w-10 text-[#508223]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-xl font-bold text-[#161513]">
          Dovada platii a fost trimisa!
        </h2>
        <p className="mt-2 text-sm text-[#161513]/60">
          Asteptati confirmarea administratorului.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4 pb-24">
      {/* ---- header ---- */}
      <div className="flex items-center gap-3">
        <Link
          href="/user"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#161513]/70 shadow-sm transition hover:bg-[#E8F4F8]"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#161513]">
            Incarca Dovada Plata
          </h1>
          <p className="text-xs text-[#161513]/50">Inapoi</p>
        </div>
      </div>

      {/* ---- invoice summary ---- */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1B6B93] to-[#0F4C75] p-4 text-white shadow-sm">
        <p className="text-xs font-medium text-white/70">Factura curenta</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Perioada: Oct-Nov 2025</p>
            <p className="mt-0.5 text-sm">
              Suma:{' '}
              <span className="font-bold">287.16 RON</span>
            </p>
          </div>
          <span className="rounded-full bg-[#C74634]/25 px-2.5 py-0.5 text-xs font-semibold text-white">
            Neplatit
          </span>
        </div>
      </div>

      {/* ---- camera section ---- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#161513]">
          Fotografiaza Chitanta/OP
        </p>

        {!showCamera && !capturedImage && !previewUrl && (
          <button
            type="button"
            onClick={startCamera}
            className="mt-3 flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#1B6B93]/30 bg-[#E8F4F8]/50 text-[#1B6B93] transition hover:border-[#1B6B93] hover:bg-[#E8F4F8]"
          >
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              Apasa pentru a deschide camera
            </span>
          </button>
        )}

        {/* live video preview */}
        {showCamera && !isCapturing && (
          <div className="mt-3 space-y-3">
            <div className="overflow-hidden rounded-xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={stopCamera}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-[#161513]/20 px-4 py-2.5 text-sm font-semibold text-[#161513]/70 transition hover:bg-[#F1EFED]"
              >
                Anuleaza
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#1B6B93] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
              >
                Captura
              </button>
            </div>
          </div>
        )}

        {/* captured image review */}
        {isCapturing && capturedImage && (
          <div className="mt-3 space-y-3">
            <div className="overflow-hidden rounded-xl bg-black">
              <img
                src={capturedImage}
                alt="Captura"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-[#161513]/20 px-4 py-2.5 text-sm font-semibold text-[#161513]/70 transition hover:bg-[#F1EFED]"
              >
                Repreia
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#508223] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d6619] active:scale-[0.98]"
              >
                Confirma
              </button>
            </div>
          </div>
        )}

        {/* confirmed preview (from camera or file) */}
        {!showCamera && !isCapturing && previewUrl && (
          <div className="mt-3 space-y-3">
            <div className="overflow-hidden rounded-xl bg-black">
              <img
                src={previewUrl}
                alt="Dovada plata"
                className="w-full"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null)
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
              className="text-sm font-medium text-[#C74634] hover:underline"
            >
              Sterge imaginea
            </button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* ---- divider ---- */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#161513]/10" />
        <span className="text-xs font-medium text-[#161513]/40">
          sau incarca din galerie
        </span>
        <div className="h-px flex-1 bg-[#161513]/10" />
      </div>

      {/* ---- file upload ---- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93]/30 px-4 py-2.5 text-sm font-semibold text-[#1B6B93] transition hover:border-[#1B6B93] hover:bg-[#E8F4F8]"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Alege fisier
        </button>
        {selectedFile && (
          <p className="mt-2 text-xs text-[#161513]/50">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
          </p>
        )}
      </div>

      {/* ---- payment details form ---- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">Detalii Plata</h2>

        <div className="mt-4 space-y-4">
          {/* Suma platita */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#161513]/60">
              Suma platita (RON)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={suma}
              onChange={(e) => setSuma(parseFloat(e.target.value) || 0)}
              className="h-12 w-full rounded-xl border border-[#161513]/15 bg-[#F9F8F7] px-4 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>

          {/* Data plata */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#161513]/60">
              Data plata
            </label>
            <input
              type="date"
              value={dataPlata}
              onChange={(e) => setDataPlata(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#161513]/15 bg-[#F9F8F7] px-4 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>

          {/* Nr. referinta / OP */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#161513]/60">
              Nr. referinta / OP (optional)
            </label>
            <input
              type="text"
              value={nrReferinta}
              onChange={(e) => setNrReferinta(e.target.value)}
              placeholder="ex. OP-12345"
              className="h-12 w-full rounded-xl border border-[#161513]/15 bg-[#F9F8F7] px-4 text-sm text-[#161513] outline-none transition placeholder:text-[#161513]/30 focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            />
          </div>

          {/* Metoda plata */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#161513]/60">
              Metoda plata
            </label>
            <select
              value={metoda}
              onChange={(e) => setMetoda(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#161513]/15 bg-[#F9F8F7] px-4 text-sm text-[#161513] outline-none transition focus:border-[#1B6B93] focus:ring-2 focus:ring-[#1B6B93]/20"
            >
              <option value="transfer">Transfer bancar</option>
              <option value="numerar">Numerar</option>
              <option value="card">Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---- error ---- */}
      {error && (
        <div className="rounded-xl bg-[#C74634]/10 px-4 py-3 text-sm font-medium text-[#C74634]">
          {error}
        </div>
      )}

      {/* ---- submit ---- */}
      <button
        type="button"
        onClick={handleSubmit}
        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#1B6B93] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
      >
        Trimite Dovada Plata
      </button>
    </div>
  )
}
