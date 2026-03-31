-- Fix lsw_admins RLS: the FOR ALL policy was blocking SELECT reads
-- Drop the conflicting policies and recreate properly

DROP POLICY IF EXISTS "Anyone can read admins" ON lsw_admins;
DROP POLICY IF EXISTS "Admins manage admins" ON lsw_admins;

-- Anyone authenticated can read (needed to check if you're admin)
CREATE POLICY "Anyone can read admins" ON lsw_admins
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only existing admins can insert/update/delete
CREATE POLICY "Admins insert admins" ON lsw_admins
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM lsw_admins));

CREATE POLICY "Admins delete admins" ON lsw_admins
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM lsw_admins));
