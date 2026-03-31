-- Rename all lsw_ tables to steward_
-- Run this in the Supabase SQL Editor
-- IMPORTANT: Run this BEFORE deploying the new code

-- Core tables
ALTER TABLE IF EXISTS lsw_categories RENAME TO steward_categories;
ALTER TABLE IF EXISTS lsw_behaviors RENAME TO steward_behaviors;
ALTER TABLE IF EXISTS lsw_entries RENAME TO steward_entries;
ALTER TABLE IF EXISTS lsw_cell_comments RENAME TO steward_cell_comments;
ALTER TABLE IF EXISTS lsw_notes RENAME TO steward_notes;

-- Admin and template tables
ALTER TABLE IF EXISTS lsw_admins RENAME TO steward_admins;
ALTER TABLE IF EXISTS lsw_templates RENAME TO steward_templates;
ALTER TABLE IF EXISTS lsw_template_categories RENAME TO steward_template_categories;
ALTER TABLE IF EXISTS lsw_template_behaviors RENAME TO steward_template_behaviors;
ALTER TABLE IF EXISTS lsw_template_assignments RENAME TO steward_template_assignments;
ALTER TABLE IF EXISTS lsw_template_applied RENAME TO steward_template_applied;

-- Group tables
ALTER TABLE IF EXISTS lsw_user_groups RENAME TO steward_user_groups;
ALTER TABLE IF EXISTS lsw_group_members RENAME TO steward_group_members;

-- Rename indexes (Postgres keeps old index names after table rename, but they still work)
-- These are optional but keep things clean
ALTER INDEX IF EXISTS idx_lsw_categories_user RENAME TO idx_steward_categories_user;
ALTER INDEX IF EXISTS idx_lsw_behaviors_category RENAME TO idx_steward_behaviors_category;
ALTER INDEX IF EXISTS idx_lsw_behaviors_user RENAME TO idx_steward_behaviors_user;
ALTER INDEX IF EXISTS idx_lsw_entries_behavior_date RENAME TO idx_steward_entries_behavior_date;
ALTER INDEX IF EXISTS idx_lsw_entries_user_date RENAME TO idx_steward_entries_user_date;
ALTER INDEX IF EXISTS idx_lsw_cell_comments_behavior_date RENAME TO idx_steward_cell_comments_behavior_date;
ALTER INDEX IF EXISTS idx_lsw_group_members_user RENAME TO idx_steward_group_members_user;
ALTER INDEX IF EXISTS idx_lsw_group_members_group RENAME TO idx_steward_group_members_group;
ALTER INDEX IF EXISTS idx_lsw_template_categories_template RENAME TO idx_steward_template_categories_template;
ALTER INDEX IF EXISTS idx_lsw_template_behaviors_category RENAME TO idx_steward_template_behaviors_category;
ALTER INDEX IF EXISTS idx_lsw_template_assignments_group RENAME TO idx_steward_template_assignments_group;
ALTER INDEX IF EXISTS idx_lsw_template_assignments_template RENAME TO idx_steward_template_assignments_template;
ALTER INDEX IF EXISTS idx_lsw_template_applied_user RENAME TO idx_steward_template_applied_user;

-- Rename constraints
ALTER TABLE steward_entries RENAME CONSTRAINT lsw_entries_value_check TO steward_entries_value_check;
