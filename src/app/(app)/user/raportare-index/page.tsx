'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, RotateCcw, Check, Send } from 'lucide-react'

// Mock data for current user
const PREVIOUS_INDEX = 961.0
const MAX_REASONABLE_DIFF = 200
const WARNING_DIFF = 100

export default function RaportareIndexPage() {
  const router = useRouter()

  // Camera state
  const [showCamera, setShowCamera] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectedValue, setDetectedValue] = useState<string>('')

  // Manual input state
  const [manualValue, setManualValue] = useState<string>('')

  // Submit state
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  // Derived: which value to use (detected from photo or manual)
  const activeValue = detectedValue || manualValue
  const numericValue = parseFloat(activeValue) || 0
  const difference = numericValue > 0 ? numericValue - PREVIOUS_INDEX : 0

  const openCamera = useCallback(async () => {
    setError(null)
    setCapturedImage(null)
    setDetectedValue('')
    setShowCamera(true)
    setIsCapturing(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setError('Nu s-a putut accesa camera. Verifica permisiunile.')
      setShowCamera(false)
      setIsCapturing(false)
    }
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
    setIsCapturing(false)

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }

    // Simulated OCR: in production, use Tesseract.js
    // For now, just show the image and let the user confirm/enter manually
    setDetectedValue('')
  }, [])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setDetectedValue('')
    openCamera()
  }, [openCamera])

  const confirmDetected = useCallback((val: string) => {
    setDetectedValue(val)
    setManualValue('')
  }, [])

  const handleSubmit = useCallback(() => {
    setError(null)

    if (!activeValue || numericValue <= 0) {
      setError('Introduceti valoarea indexului.')
      return
    }

    if (numericValue <= PREVIOUS_INDEX) {
      setError(
        `Indexul nou (${numericValue.toFixed(2)}) trebuie sa fie mai mare decat indexul anterior (${PREVIOUS_INDEX.toFixed(2)}).`
      )
      return
    }

    if (difference > MAX_REASONABLE_DIFF) {
      setError(
        `Diferenta de ${difference.toFixed(2)} mc depaseste limita de ${MAX_REASONABLE_DIFF} mc. Verificati valoarea.`
      )
      return
    }

    setSubmitted(true)

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push('/user')
    }, 2000)
  }, [activeValue, numericValue, difference, router])

  // Success screen
  if (submitted) {
    return (
      <div className="mx-auto max-w-lg p-4 pb-24">
        <div className="mt-12 flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#508223]/15">
            <Check size={32} className="text-[#508223]" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-[#161513]">
            Index raportat cu succes!
          </h1>
          <p className="mt-2 text-sm text-[#697778]">
            Valoare: <span className="font-semibold text-[#161513]">{numericValue.toFixed(2)} mc</span>
          </p>
          <p className="mt-1 text-sm text-[#697778]">
            Consum: <span className="font-semibold text-[#161513]">{difference.toFixed(2)} mc</span>
          </p>
          <p className="mt-4 text-xs text-[#697778]">
            Redirectionare catre pagina principala...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 p-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#161513]">Raportare Index</h1>
        <p className="mt-1 text-sm text-[#697778]">
          Fotografiaza apometrul sau introdu valoarea manual.
        </p>
      </div>

      {/* Previous index info */}
      <div className="rounded-2xl bg-[#E8F4F8] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#697778]">Index anterior</span>
          <span className="text-lg font-bold text-[#1B6B93]">
            {PREVIOUS_INDEX.toFixed(2)} mc
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Camera Scan Section                                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">
          Scanare apometru
        </h2>

        {!showCamera && !capturedImage && (
          <button
            type="button"
            onClick={openCamera}
            className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
          >
            <Camera size={20} />
            Fotografiaza Apometrul
          </button>
        )}

        {/* Live video preview */}
        {showCamera && isCapturing && (
          <div className="mt-4 space-y-3">
            <div className="overflow-hidden rounded-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
                style={{ maxHeight: 320 }}
              />
            </div>
            <button
              type="button"
              onClick={capturePhoto}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
            >
              <Camera size={20} />
              Captura
            </button>
          </div>
        )}

        {/* Captured image */}
        {capturedImage && (
          <div className="mt-4 space-y-3">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Fotografie apometru"
                className="w-full"
                style={{ maxHeight: 320, objectFit: 'cover' }}
              />
            </div>

            <p className="text-center text-xs text-[#697778]">
              Introduceti valoarea citita de pe apometru in campul de mai jos, apoi confirmati.
            </p>

            {/* Detected value input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.01"
                  value={detectedValue}
                  onChange={(e) => setDetectedValue(e.target.value)}
                  placeholder="Valoare citita..."
                  className="input pr-10 text-lg font-bold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#697778]">
                  mc
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={retakePhoto}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1B6B93] px-4 py-3 text-sm font-semibold text-[#1B6B93] transition hover:bg-[#E8F4F8] active:scale-[0.98]"
              >
                <RotateCcw size={18} />
                Repreia
              </button>
              <button
                type="button"
                onClick={() => confirmDetected(detectedValue)}
                disabled={!detectedValue}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#508223] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#508223]/90 active:scale-[0.98] disabled:opacity-50"
              >
                <Check size={18} />
                Confirma
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Divider                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#D1D5DB]" />
        <span className="text-xs font-medium text-[#697778]">
          sau introdu manual
        </span>
        <div className="h-px flex-1 bg-[#D1D5DB]" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Manual Input Section                                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[#161513]">
          Introducere manuala
        </h2>
        <div className="relative mt-3">
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={manualValue}
            onChange={(e) => {
              setManualValue(e.target.value)
              setDetectedValue('')
            }}
            placeholder="Ex: 987.50"
            className="input pr-10 text-2xl font-bold"
            style={{ minHeight: 56 }}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-[#697778]">
            mc
          </span>
        </div>

        {/* Calculated difference */}
        {numericValue > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#697778]">Index anterior</span>
              <span className="font-medium text-[#161513]">
                {PREVIOUS_INDEX.toFixed(2)} mc
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#697778]">Index nou</span>
              <span className="font-medium text-[#161513]">
                {numericValue.toFixed(2)} mc
              </span>
            </div>
            <div className="h-px bg-[#F1EFED]" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#161513]">Consum calculat</span>
              <span
                className="text-lg font-bold"
                style={{
                  color:
                    difference > WARNING_DIFF
                      ? '#C74634'
                      : difference > 0
                        ? '#508223'
                        : '#C74634',
                }}
              >
                {difference > 0 ? difference.toFixed(2) : '---'} mc
              </span>
            </div>
            {difference > WARNING_DIFF && difference <= MAX_REASONABLE_DIFF && (
              <p className="text-xs text-[#AC630C]">
                Atentie: Consumul de {difference.toFixed(2)} mc este neobisnuit de mare. Verificati valoarea.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Error message                                                      */}
      {/* ----------------------------------------------------------------- */}
      {error && (
        <div className="rounded-xl border-l-4 border-[#C74634] bg-[#C74634]/5 px-4 py-3">
          <p className="text-sm text-[#C74634]">{error}</p>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Submit                                                             */}
      {/* ----------------------------------------------------------------- */}
      <button
        type="button"
        onClick={handleSubmit}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1B6B93] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#0F4C75] active:scale-[0.98]"
      >
        <Send size={18} />
        Trimite Index
      </button>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
