-- v2.2: Add interval and info_text to template behaviors and behaviors

-- Template behaviors: add interval (default 1) and info_text
ALTER TABLE steward_template_behaviors
  ADD COLUMN IF NOT EXISTS interval INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS info_text TEXT;

-- Behaviors: add info_text
ALTER TABLE steward_behaviors
  ADD COLUMN IF NOT EXISTS info_text TEXT;
