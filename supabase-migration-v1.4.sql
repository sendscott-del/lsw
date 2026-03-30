-- Migration for v1.4.0: Templates & User Groups
-- Run this in the Supabase SQL Editor

-- Admin designation (simple table — insert your user_id to become admin)
CREATE TABLE lsw_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User groups
CREATE TABLE lsw_user_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Group membership
CREATE TABLE lsw_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES lsw_user_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Templates
CREATE TABLE lsw_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Template categories
CREATE TABLE lsw_template_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES lsw_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Template behaviors
CREATE TABLE lsw_template_behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES lsw_template_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  days_of_week INTEGER[] DEFAULT NULL,
  monthly_pattern JSONB DEFAULT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Template-to-group assignments
CREATE TABLE lsw_template_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES lsw_templates(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES lsw_user_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, group_id)
);

-- Track which templates have been applied to which users
CREATE TABLE lsw_template_applied (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES lsw_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Indexes
CREATE INDEX idx_lsw_group_members_user ON lsw_group_members(user_id);
CREATE INDEX idx_lsw_group_members_group ON lsw_group_members(group_id);
CREATE INDEX idx_lsw_template_categories_template ON lsw_template_categories(template_id);
CREATE INDEX idx_lsw_template_behaviors_category ON lsw_template_behaviors(category_id);
CREATE INDEX idx_lsw_template_assignments_group ON lsw_template_assignments(group_id);
CREATE INDEX idx_lsw_template_assignments_template ON lsw_template_assignments(template_id);
CREATE INDEX idx_lsw_template_applied_user ON lsw_template_applied(user_id);

-- Enable RLS
ALTER TABLE lsw_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_template_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_template_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lsw_template_applied ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admins: anyone can read (to check if they're admin), only admins can write
CREATE POLICY "Anyone can read admins" ON lsw_admins FOR SELECT USING (true);
CREATE POLICY "Admins manage admins" ON lsw_admins FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- User groups: all authenticated can read, admins can write
CREATE POLICY "Authenticated read groups" ON lsw_user_groups FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage groups" ON lsw_user_groups FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Group members: all authenticated can read, admins can write
CREATE POLICY "Authenticated read group members" ON lsw_group_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage group members" ON lsw_group_members FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Templates: all authenticated can read, admins can write
CREATE POLICY "Authenticated read templates" ON lsw_templates FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage templates" ON lsw_templates FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Template categories: all authenticated can read, admins can write
CREATE POLICY "Authenticated read template categories" ON lsw_template_categories FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage template categories" ON lsw_template_categories FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Template behaviors: all authenticated can read, admins can write
CREATE POLICY "Authenticated read template behaviors" ON lsw_template_behaviors FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage template behaviors" ON lsw_template_behaviors FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Template assignments: all authenticated can read, admins can write
CREATE POLICY "Authenticated read assignments" ON lsw_template_assignments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage assignments" ON lsw_template_assignments FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM lsw_admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

-- Template applied: users can read/write their own records
CREATE POLICY "Users manage own applied" ON lsw_template_applied FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
