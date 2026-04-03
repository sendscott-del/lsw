'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Template, TemplateCategory, TemplateBehavior } from '@/lib/types'

interface CallingPickerProps {
  userId: string
  hasExistingData: boolean
  onApplied: () => void
  onCancel?: () => void
}

export default function CallingPicker({ userId, hasExistingData, onApplied, onCancel }: CallingPickerProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    supabase.from('steward_templates').select('*').order('name').then(({ data }) => {
      setTemplates((data ?? []) as Template[])
      setLoading(false)
    })
  }, [])

  async function handleSelect(templateId: string) {
    if (hasExistingData && !confirm('This will replace your current categories and behaviors with the selected template. Your entry history will be preserved. Continue?')) return

    setApplying(true)

    // If user already has data, clear their categories and behaviors
    if (hasExistingData) {
      await supabase.from('steward_behaviors').delete().eq('user_id', userId)
      await supabase.from('steward_categories').delete().eq('user_id', userId)
    }

    // Fetch template content
    const { data: templateCats } = await supabase
      .from('steward_template_categories')
      .select('*')
      .eq('template_id', templateId)
      .order('sort_order')

    if (!templateCats || templateCats.length === 0) {
      setApplying(false)
      onApplied()
      return
    }

    for (let ci = 0; ci < templateCats.length; ci++) {
      const tCat = templateCats[ci] as TemplateCategory
      const { data: newCat } = await supabase
        .from('steward_categories')
        .insert({ user_id: userId, name: tCat.name, sort_order: ci })
        .select('id')
        .single()

      if (!newCat) continue

      const { data: tBehaviors } = await supabase
        .from('steward_template_behaviors')
        .select('*')
        .eq('category_id', tCat.id)
        .order('sort_order')

      if (tBehaviors && tBehaviors.length > 0) {
        await supabase.from('steward_behaviors').insert(
          (tBehaviors as TemplateBehavior[]).map((b, i) => ({
            user_id: userId,
            category_id: newCat.id,
            name: b.name,
            frequency: b.frequency ?? 'weekly',
            interval: b.interval ?? 1,
            info_text: b.info_text ?? null,
            sort_order: i,
          }))
        )
      }
    }

    setApplying(false)
    onApplied()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading...</div>
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <p className="text-gray-500 text-sm">No templates available yet. An admin needs to create them first.</p>
        {onCancel && (
          <button onClick={onCancel} className="mt-4 text-sm text-blue-600 hover:underline">Cancel</button>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {hasExistingData ? 'Change Your Calling' : 'Choose Your Calling'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {hasExistingData
            ? 'Select a new calling to replace your current stewardship items.'
            : 'Select your calling to set up your stewardship tracking.'}
        </p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            disabled={applying}
            className="w-full py-4 px-5 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-blue-400 hover:bg-blue-50 transition disabled:opacity-50"
          >
            <span className="text-sm font-semibold text-gray-800">{t.name}</span>
          </button>
        ))}
      </div>

      {applying && (
        <p className="text-center text-sm text-gray-400 mt-4">Setting up your stewardship items...</p>
      )}

      {onCancel && (
        <div className="text-center mt-6">
          <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
        </div>
      )}
    </div>
  )
}
