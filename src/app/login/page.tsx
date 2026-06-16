'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PIN_LENGTH = 4

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}

function LoginInner() {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get('next') || '/dashboard'

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const newPin = [...pin]
    newPin[i] = digit
    setPin(newPin)
    setError(null)
    if (digit && i < PIN_LENGTH - 1) inputs.current[i + 1]?.focus()
    if (newPin.every((d) => d) && i === PIN_LENGTH - 1) submit(newPin.join(''))
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const submit = async (pinVal: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinVal }),
      })
      if (res.ok) {
        router.push(next)
        router.refresh()
      } else {
        setError('PIN falsch')
        setPin(Array(PIN_LENGTH).fill(''))
        inputs.current[0]?.focus()
      }
    } catch {
      setError('Fehler — bitte erneut versuchen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(1200px 600px at 50% -10%, #1e3a8a55, transparent), #0a1a3a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: 360,
          padding: '40px 32px',
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35, #ff3333)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontSize: 28,
          }}
        >
          🔒
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0a1a3a', margin: 0 }}>
          Bester Urlaub Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, marginBottom: 28 }}>
          PIN eingeben, um fortzufahren
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          {pin.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el
              }}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={1}
              aria-label={`PIN Ziffer ${i + 1}`}
              placeholder="•"
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 52,
                height: 60,
                fontSize: 28,
                fontWeight: 600,
                textAlign: 'center',
                border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                borderRadius: 12,
                outline: 'none',
                background: '#f8fafc',
                color: '#0a1a3a',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2e75fa'
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>
            {error}
          </p>
        )}
        {loading && (
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Prüfen…</p>
        )}
      </div>
    </div>
  )
}
