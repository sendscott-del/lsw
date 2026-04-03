'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, X, Trash2, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { SEED_TEMPLATES } from '@/constants/seedTemplates'
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
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('steward_templates').select('*').order('created_at')
    setTemplates((data ?? []) as Template[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  async function handleSeedTemplates() {
    if (!confirm('This will create the Handbook-based templates (Stake President, First Counselor, Second Counselor, High Councilor). Existing templates with the same name will be skipped. Continue?')) return
    setSeeding(true)
    for (const seed of SEED_TEMPLATES) {
      const { data: existing } = await supabase.from('steward_templates').select('id').eq('name', seed.name).limit(1)
      if (existing && existing.length > 0) continue

      const { data: template } = await supabase
        .from('steward_templates')
        .insert({ name: seed.name, created_by: userId })
        .select('id')
        .single()
      if (!template) continue

      for (let ci = 0; ci < seed.categories.length; ci++) {
        const cat = seed.categories[ci]
        const { data: newCat } = await supabase
          .from('steward_template_categories')
          .insert({ template_id: template.id, name: cat.name, sort_order: ci })
          .select('id')
          .single()
        if (!newCat) continue

        await supabase.from('steward_template_behaviors').insert(
          cat.behaviors.map((b, bi) => ({
            category_id: newCat.id,
            name: b.name,
            frequency: b.frequency,
            interval: b.interval,
            info_text: b.info_text,
            sort_order: bi,
          }))
        )
      }
    }
    setSeeding(false)
    fetchTemplates()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this template and all its contents?')) return
    await supabase.from('steward_templates').delete().eq('id', id)
    fetchTemplates()
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400 px-1">
        Edit templates here. Users choose their calling on the Work tab to apply a template.
      </p>

      {/* Seed suggested templates */}
      <button
        onClick={handleSeedTemplates}
        disabled={seeding}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 font-medium hover:bg-amber-100 disabled:opacity-50"
      >
        <Sparkles size={16} />
        {seeding ? 'Creating...' : 'Create Suggested Templates (Handbook Ch. 6)'}
      </button>

      {/* List */}
      {loading ? (
        <div className="text-center text-sm text-gray-400 py-8">Loading...</div>
      ) : templates.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-8">No templates yet. Use the button above to create the suggested templates.</div>
      ) : (
        templates.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">{t.name}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(editing === t.id ? null : t.id)}
                  className={`px-3 py-1 rounded text-xs font-medium ${editing === t.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {editing === t.id ? 'Close' : 'Edit'}
                </button>
                <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {editing === t.id && <TemplateEditor templateId={t.id} />}
          </div>
        ))
      )}
    </div>
  )
}

// ─── Template Editor ───

function TemplateEditor({ templateId }: { templateId: string }) {
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [behaviors, setBehaviors] = useState<TemplateBehavior[]>([])
  const [newCatName, setNewCatName] = useState('')
  const [addingBehavior, setAddingBehavior] = useState<string | null>(null)
  const [newBehName, setNewBehName] = useState('')
  const [newBehFreq, setNewBehFreq] = useState<Frequency>('weekly')
  const [newBehInterval, setNewBehInterval] = useState(1)

  const fetchData = useCallback(async () => {
    const [catRes, behRes] = await Promise.all([
      supabase.from('steward_template_categories').select('*').eq('template_id', templateId).order('sort_order'),
      supabase.from('steward_template_behaviors').select('*').order('sort_order'),
    ])
    const cats = (catRes.data ?? []) as TemplateCategory[]
    setCategories(cats)
    const catIds = cats.map(c => c.id)
    setBehaviors(((behRes.data ?? []) as TemplateBehavior[]).filter(b => catIds.includes(b.category_id)))
  }, [templateId])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    await supabase.from('steward_template_categories').insert({
      template_id: templateId, name: newCatName.trim(), sort_order: categories.length,
    })
    setNewCatName('')
    fetchData()
  }

  async function handleDeleteCategory(id: string) {
    await supabase.from('steward_template_categories').delete().eq('id', id)
    fetchData()
  }

  async function handleAddBehavior(categoryId: string) {
    if (!newBehName.trim()) return
    const count = behaviors.filter(b => b.category_id === categoryId).length
    await supabase.from('steward_template_behaviors').insert({
      category_id: categoryId, name: newBehName.trim(), frequency: newBehFreq, interval: newBehInterval, sort_order: count,
    })
    setNewBehName('')
    setNewBehFreq('weekly')
    setNewBehInterval(1)
    setAddingBehavior(null)
    fetchData()
  }

  async function handleDeleteBehavior(id: string) {
    await supabase.from('steward_template_behaviors').delete().eq('id', id)
    fetchData()
  }

  const freqLabel = (f: string, interval: number) => {
    if (interval > 1) return `Every ${interval} ${f === 'weekly' ? 'wks' : f === 'monthly' ? 'mo' : 'qtrs'}`
    return { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly' }[f] ?? f
  }

  return (
    <div className="p-4 space-y-3">
      {categories.map(cat => (
        <div key={cat.id} className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-t-lg">
            <span className="text-xs font-bold text-gray-600 uppercase">{cat.name}</span>
            <div className="flex gap-1">
              <button onClick={() => setAddingBehavior(addingBehavior === cat.id ? null : cat.id)} className="text-xs text-blue-600 hover:underline">
                + Behavior
              </button>
              <button onClick={() => handleDeleteCategory(cat.id)} className="p-0.5 text-gray-400 hover:text-red-500">
                <X size={12} />
              </button>
            </div>
          </div>

          <div className="px-3 py-1">
            {behaviors.filter(b => b.category_id === cat.id).map(beh => (
              <div key={beh.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div>
                  <span className="text-sm text-gray-700">{beh.name}</span>
                  <span className="ml-2 text-[10px] text-gray-400">
                    {freqLabel(beh.frequency ?? 'weekly', beh.interval ?? 1)}
                  </span>
                </div>
                <button onClick={() => handleDeleteBehavior(beh.id)} className="p-0.5 text-gray-300 hover:text-red-500">
                  <X size={12} />
                </button>
              </div>
            ))}
            {behaviors.filter(b => b.category_id === cat.id).length === 0 && (
              <p className="text-xs text-gray-400 py-2">No behaviors yet</p>
            )}
          </div>

          {addingBehavior === cat.id && (
            <div className="px-3 py-2 bg-blue-50 border-t border-blue-100 space-y-2">
              <input
                value={newBehName}
                onChange={e => setNewBehName(e.target.value)}
                placeholder="Behavior name"
                autoFocus
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={e => e.key === 'Enter' && handleAddBehavior(cat.id)}
              />
              <div className="flex gap-2 flex-wrap">
                <select value={newBehFreq} onChange={e => setNewBehFreq(e.target.value as Frequency)} className="px-2 py-1 border border-gray-300 rounded text-xs">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-gray-500">Every</label>
                  <input
                    type="number"
                    min={1}
                    value={newBehInterval}
                    onChange={e => setNewBehInterval(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 px-1 py-1 border border-gray-300 rounded text-xs text-center"
                  />
                </div>
                <button onClick={() => handleAddBehavior(cat.id)} disabled={!newBehName.trim()} className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium disabled:opacity-50">
                  Add
                </button>
                <button onClick={() => setAddingBehavior(null)} className="px-3 py-1 text-gray-500 text-xs">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add category */}
      <div className="flex gap-2">
        <input
          value={newCatName}
          onChange={e => setNewCatName(e.target.value)}
          placeholder="New category name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
        />
        <button onClick={handleAddCategory} disabled={!newCatName.trim()} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-200">
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
