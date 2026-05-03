'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { StewardLogo } from '@/components/icons/StewardLogo'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase v2: when arriving via the reset email link, the recovery
    // session is established automatically. Just confirm we have one.
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session))
  }, [])

  const t = (en: string, es: string) => (lang === 'es' ? es : en)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('Passwords do not match.', 'Las contraseñas no coinciden.'))
      return
    }
    if (password.length < 6) {
      setError(t('Password must be at least 6 characters.', 'La contraseña debe tener al menos 6 caracteres.'))
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-primary-dark px-6 pt-14 pb-24 text-white">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <StewardLogo size={44} />
            <div>
              <p className="text-lg font-bold tracking-tight">Steward</p>
              <p className="text-xs text-white/80">Leader Standard Work</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('Choose a new password', 'Elige una nueva contraseña')}
          </h1>
        </div>
      </div>

      <div className="px-4 -mt-12 pb-10">
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6">
          {!ready ? (
            <p className="text-sm text-gray-600">
              {t(
                "This page only works from a password reset email link. Please use the link sent to your inbox.",
                "Esta página solo funciona desde el enlace que recibiste por correo."
              )}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('New password', 'Nueva contraseña')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-steward-primary"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Confirm password', 'Confirmar contraseña')}
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-steward-primary"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-steward-primary text-white rounded-lg text-sm font-medium hover:bg-steward-primary-dark disabled:opacity-50"
              >
                {loading
                  ? t('Saving…', 'Guardando…')
                  : t('Update password', 'Actualizar contraseña')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
