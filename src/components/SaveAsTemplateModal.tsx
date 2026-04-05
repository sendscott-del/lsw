'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category, Behavior } from '@/lib/types'

interface SaveAsTemplateModalProps {
  userId: string
  categories: Category[]
  behaviors: Behavior[]
  onSaved: () => void
  onClose: () => void
}

export default function SaveAsTemplateModal({ userId, categories, behaviors, onSaved, onClose }: SaveAsTemplateModalProps) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)

    // Create template
    const { data: template } = await supabase
      .from('steward_templates')
      .insert({ name: name.trim(), created_by: userId })
      .select('id')
      .single()

    if (!template) { setSaving(false); return }

    // Copy categories and behaviors
    for (const cat of categories) {
      const { data: newCat } = await supabase
        .from('steward_template_categories')
        .insert({ template_id: template.id, name: cat.name, sort_order: cat.sort_order })
        .select('id')
        .single()

      if (!newCat) continue

      const catBehaviors = behaviors.filter(b => b.category_id === cat.id && !b.is_archived)
      if (catBehaviors.length > 0) {
        await supabase.from('steward_template_behaviors').insert(
          catBehaviors.map(b => ({
            category_id: newCat.id,
            name: b.name,
            frequency: b.frequency,
            interval: b.interval ?? 1,
            info_text: b.info_text || null,
            sort_order: b.sort_order,
          }))
        )
      }
    }

    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Save as Template</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Save your current categories and behaviors as a reusable template.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              id="template-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="e.g. Stake President, Bishop, etc."
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-500 mb-2">What will be saved:</div>
            <ul className="text-xs text-gray-600 space-y-1">
              {categories.map(cat => {
                const catBehaviors = behaviors.filter(b => b.category_id === cat.id && !b.is_archived)
                return (
                  <li key={cat.id}>
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-400"> — {catBehaviors.length} behavior{catBehaviors.length !== 1 ? 's' : ''}</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Template'}
          </button>
        </form>
      </div>
    </div>
  )
}
