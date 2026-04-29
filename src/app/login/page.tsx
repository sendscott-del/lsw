'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isSignUp) {
      const { data, error: signUpErr } = await supabase.auth.signUp({ email, password })
      if (signUpErr) {
        // If account already exists (from another app sharing this Supabase), try signing in
        if (signUpErr.message.toLowerCase().includes('already') || signUpErr.message.toLowerCase().includes('exists')) {
          const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
          if (signInErr) {
            setError(t('auth.accountExists'))
          } else {
            router.push('/')
          }
        } else {
          setError(signUpErr.message)
        }
      } else if (data.session) {
        // Sign up returned a session — user is already logged in
        router.push('/')
      } else {
        // No session — Supabase requires confirmation. Try signing in directly.
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
        if (!signInErr) {
          router.push('/')
        } else {
          // Last resort: tell them to sign in
          setMessage(t('auth.accountCreatedSwitch'))
          setIsSignUp(false)
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Steward" className="h-24 md:h-32 w-auto" />
        </div>
        <p className="text-gray-500 text-center text-sm mb-8">
          {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('auth.passwordPlaceholder')}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.loading') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
            className="text-blue-600 font-medium hover:underline"
          >
            {isSignUp ? t('auth.signIn') : t('auth.signUp')}
          </button>
        </p>
      </div>
    </div>
  )
}
