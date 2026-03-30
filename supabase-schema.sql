-- Leader Standard Work - Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)

-- Drop the old prototype table
DROP TABLE IF EXISTS lsw_behaviors CASCADE;

-- Categories group behaviors (e.g., "Safety", "Quality", "Production")
CREATE TABLE lsw_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual behaviors/actions within a category
CREATE TABLE lsw_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES lsw_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  is_new BOOLEAN NOT NULL DEFAULT true,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per behavior+day. Sparse: only rows that have a value.
CREATE TABLE lsw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  behavior_id UUID NOT NULL REFERENCES lsw_behaviors(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  value TEXT NOT NULL CHECK (value IN ('y', 'n', 'k')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(behavior_id, entry_date)
);

-- Cell-level comments (tap a cell to add a note about that day's performance)
CREATE TABLE lsw_cell_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  behavior_id UUID NOT NULL REFERENCES lsw_behaviors(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(behavior_id, entry_date)
);

-- General free-form notes (Notes tab)
CREATE TABLE lsw_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_lsw_categories_user ON lsw_categories(user_id);
CREATE INDEX idx_lsw_behaviors_category ON lsw_behaviors(category_id);
CREATE INDEX idx_lsw_behaviors_user ON lsw_behaviors(user_id);
CREATE INDEX idx_lsw_entries_behavior_date ON lsw_entries(behavior_id, entry_date);
CREATE INDEX idx_lsw_entries_user_date ON lsw_entries(user_id, entry_date);
CREATE INDEX idx_lsw_cell_comments_behavior_date ON lsw_cell_comments(behavior_id, entry_date);

-- Enable Row Level Security on all tables
ALTER TABLE lsw_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_cell_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: each user can only access their own data
CREATE POLICY "Users manage own categories"
  ON lsw_categories FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own behaviors"
  ON lsw_behaviors FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own entries"
  ON lsw_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own cell comments"
  ON lsw_cell_comments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own notes"
  ON lsw_notes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
