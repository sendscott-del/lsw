-- Migration for v1.8.0: Add interval and anchor_date to behaviors
-- Run this in the Supabase SQL Editor

ALTER TABLE lsw_behaviors
  ADD COLUMN IF NOT EXISTS interval INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS anchor_date DATE DEFAULT NULL;
