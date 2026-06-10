// app/inscription/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    clinicName: '',
    sector: 'clinique',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 6) {
      setError('Mot de passe trop court (minimum 6 caracteres).')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription')

      // Auto sign in
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
      setLoading(false)
    }
  }

  const SECTORS = [
    'clinique', 'garage', 'immobilier', 'avocat',
    'restaurant', 'hotel', 'salon', 'ecole', 'autre'
  ]

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
      <div className="w-full max-w-[460px]">

        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-8 h-8 bg-[#0C0E12] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-wide text-[#0C0E12]">BOS SYSTEMS</span>
        </Link>

        <div className="bg-white border border-[rgba(12,14,18,0.08)] rounded-2xl p-8 shadow-sm">

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#0C0E12]' : 'bg-[rgba(12,14,18,0.08)]'}`} />
            ))}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#0C0E12] mb-1">
            {step === 1 ? 'Votre entreprise' : 'Votre compte'}
          </h1>
          <p className="text-sm text-[#7A7F8E] mb-8">
            {step === 1 ? 'Etape 1 sur 2 — Informations de base' : 'Etape 2 sur 2 — Connexion securisee'}
          </p>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#3A3D45] mb-1.5">Nom de votre entreprise</label>
                  <input
                    className="input"
                    placeholder="Clinique Dr. Bennani"
                    value={form.clinicName}
                    onChange={(e) => update('clinicName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3D45] mb-1.5">Secteur d'activite</label>
                  <select
                    className="input capitalize"
                    value={form.sector}
                    onChange={(e) => update('sector', e.target.value)}
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full py-3 justify-center mt-2">
                  Continuer →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#3A3D45] mb-1.5">Email professionnel</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3D45] mb-1.5">Mot de passe</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Minimum 6 caracteres"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3D45] mb-1.5">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
                )}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3 justify-center">
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 justify-center">
                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Creer mon compte'}
                  </button>
                </div>

                <p className="text-xs text-center text-[#B0B5C3] mt-2">
                  14 jours gratuits. Sans carte bancaire.
                </p>
              </>
            )}
          </form>

          <p className="text-center text-sm text-[#7A7F8E] mt-6">
            Deja un compte ?{' '}
            <Link href="/connexion" className="text-[#1A56FF] font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
