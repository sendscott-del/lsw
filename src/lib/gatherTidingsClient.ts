import { createClient } from '@supabase/supabase-js'

// Read-only client pointed at the Tidings Supabase project so the
// /admin/gather screen (which lives in the shared "Scott's Apps" project)
// can surface Tidings users without forcing the super admin to hop apps.
//
// Env vars (set in Vercel + .env.local):
//   NEXT_PUBLIC_GATHER_TIDINGS_SUPABASE_URL      — defaults to jdlykebsqafcngpntxma.supabase.co
//   NEXT_PUBLIC_GATHER_TIDINGS_SUPABASE_ANON_KEY — required (publishable key)
//
// If the anon key is missing this client returns null and callers fall back
// to "Tidings users not configured" in the UI.
const url =
  (process.env.NEXT_PUBLIC_GATHER_TIDINGS_SUPABASE_URL as string | undefined) ??
  'https://jdlykebsqafcngpntxma.supabase.co'

const anon = process.env.NEXT_PUBLIC_GATHER_TIDINGS_SUPABASE_ANON_KEY as
  | string
  | undefined

export const gatherTidingsClient =
  url && anon
    ? createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    : null

export interface TidingsUser {
  id: string
  email: string
  full_name: string | null
  role: string | null
  ward: string | null
}

export async function fetchTidingsUsers(): Promise<TidingsUser[] | null> {
  if (!gatherTidingsClient) return null
  const { data, error } = await gatherTidingsClient.rpc('gather_tidings_users')
  if (error) {
    console.warn('[gather] Tidings users RPC error:', error.message)
    return null
  }
  if (!Array.isArray(data)) return null
  return data as TidingsUser[]
}
