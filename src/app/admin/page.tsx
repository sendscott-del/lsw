'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Trash2, Pencil } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Template, TemplateCategory, TemplateBehavior, Frequency } from '@/lib/types'

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading, isAdmin, adminLoading } = useAuth()

  if (authLoading || adminLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">Please log in first.</p>
        <button onClick={() => router.push('/login')} className="text-sm text-blue-600 hover:underline">Go to Login</button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">You don&apos;t have admin access.</p>
        <button onClick={() => router.push('/')} className="text-sm text-blue-600 hover:underline">Back to Home</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-1 text-gray-500 hover:text-gray-700">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Admin — Templates</h1>
      </header>

      <div className="max-w-lg mx-auto p-4">
        <TemplatesSection userId={user.id} />
      </div>
    </div>
  )
}

// ─── Templates Section ───

function TemplatesSection({ userId }: { userId: string }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('steward_templates').select('*').order('created_at')
    setTemplates((data ?? []) as Template[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  async function handleDelete(id: string) {
    if (!confirm('Delete this template and all its contents?')) return
    await supabase.from('steward_templates').delete().eq('id', id)
    fetchTemplates()
  }

  async function handleEdit(template: Template) {
    // Load template into user's work tab categories/behaviors, then navigate there
    if (!confirm(`This will load "${template.name}" into your work tab for editing. Your current categories and behaviors will be replaced, but the original template will stay intact. Continue?`)) return

    // Clear existing user categories/behaviors
    await supabase.from('steward_behaviors').delete().eq('user_id', userId)
    await supabase.from('steward_categories').delete().eq('user_id', userId)

    // Fetch template structure
    const { data: tCats } = await supabase
      .from('steward_template_categories')
      .select('*')
      .eq('template_id', template.id)
      .order('sort_order')

    if (tCats) {
      for (const tCat of tCats as TemplateCategory[]) {
        const { data: newCat } = await supabase
          .from('steward_categories')
          .insert({ user_id: userId, name: tCat.name, sort_order: tCat.sort_order })
          .select('id')
          .single()

        if (!newCat) continue

        const { data: tBehs } = await supabase
          .from('steward_template_behaviors')
          .select('*')
          .eq('category_id', tCat.id)
          .order('sort_order')

        if (tBehs && tBehs.length > 0) {
          await supabase.from('steward_behaviors').insert(
            (tBehs as TemplateBehavior[]).map(b => ({
              user_id: userId,
              category_id: newCat.id,
              name: b.name,
              frequency: b.frequency ?? 'weekly',
              interval: b.interval ?? 1,
              info_text: b.info_text || null,
              sort_order: b.sort_order,
            }))
          )
        }
      }
    }

    // Original template stays intact — Save as Template creates a new one
    // Navigate to work tab
    router.push('/')
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 px-1">
        Templates are created from the Work tab using &quot;Save as Template&quot;. Edit or delete them here.
      </p>

      {loading ? (
        <div className="text-center text-sm text-gray-400 py-8">Loading...</div>
      ) : templates.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-8">
          No templates yet. Go to the Work tab, set up your categories and behaviors, then use &quot;Save as Template&quot;.
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Created {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <TemplatePreview templateId={t.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Template Preview (read-only) ───

function TemplatePreview({ templateId }: { templateId: string }) {
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [behaviors, setBehaviors] = useState<TemplateBehavior[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('steward_template_categories').select('*').eq('template_id', templateId).order('sort_order'),
      supabase.from('steward_template_behaviors').select('*').order('sort_order'),
    ]).then(([catRes, behRes]) => {
      const cats = (catRes.data ?? []) as TemplateCategory[]
      setCategories(cats)
      const catIds = cats.map(c => c.id)
      setBehaviors(((behRes.data ?? []) as TemplateBehavior[]).filter(b => catIds.includes(b.category_id)))
    })
  }, [templateId])

  const freqLabel = (f: string, interval: number) => {
    if (interval > 1) return `Every ${interval} ${f === 'weekly' ? 'wks' : f === 'monthly' ? 'mo' : 'qtrs'}`
    return { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly' }[f] ?? f
  }

  if (categories.length === 0) return null

  return (
    <div className="px-4 pb-3 border-t border-gray-50">
      {categories.map(cat => (
        <div key={cat.id} className="mt-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{cat.name}</div>
          {behaviors.filter(b => b.category_id === cat.id).map(beh => (
            <div key={beh.id} className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-600">{beh.name}</span>
              <span className="text-[10px] text-gray-400">{freqLabel(beh.frequency ?? 'weekly', beh.interval ?? 1)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
