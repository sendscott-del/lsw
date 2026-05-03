'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { StewardLogo } from '@/components/icons/StewardLogo'

export default function ForgotPasswordPage() {
  const { lang, setLang } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const t = (en: string, es: string) => (lang === 'es' ? es : en)

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
            {t('Reset your password', 'Restablecer contraseña')}
          </h1>
        </div>
      </div>

      <div className="px-4 -mt-12 pb-10">
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6">
          {sent ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                {t(
                  "Check your inbox. We sent a password reset link to that email — open it to choose a new password.",
                  "Revisa tu bandeja de entrada. Te enviamos un enlace para restablecer la contraseña."
                )}
              </p>
              <Link
                href="/login"
                className="block w-full text-center py-2.5 bg-steward-primary text-white rounded-lg text-sm font-medium hover:bg-steward-primary-dark"
              >
                {t('Back to sign in', 'Volver a iniciar sesión')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                {t(
                  "Enter your email and we'll send you a link to reset your password.",
                  "Escribe tu correo y te enviaremos un enlace para restablecer la contraseña."
                )}
              </p>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Email', 'Correo electrónico')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-steward-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-steward-primary text-white rounded-lg text-sm font-medium hover:bg-steward-primary-dark disabled:opacity-50"
              >
                {loading
                  ? t('Sending…', 'Enviando…')
                  : t('Send reset link', 'Enviar enlace')}
              </button>
              <p className="text-center text-sm text-gray-500">
                <Link href="/login" className="text-steward-primary font-medium hover:underline">
                  {t('Back to sign in', 'Volver a iniciar sesión')}
                </Link>
              </p>
            </form>
          )}

          <div className="flex justify-center gap-1 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1 text-xs rounded-full font-semibold ${
                lang === 'en' ? 'bg-brand-primary-fade text-brand-primary' : 'text-gray-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('es')}
              className={`px-4 py-1 text-xs rounded-full font-semibold ${
                lang === 'es' ? 'bg-brand-primary-fade text-brand-primary' : 'text-gray-400'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
