/*
  # Fix Idea Views RLS Policies

  1. Changes
    - Drop existing RLS policies for idea_views
    - Add comprehensive RLS policies for view tracking
    - Add helpful indexes for better performance

  2. Security
    - Enable RLS on idea_views table
    - Add policies for authenticated users to record views
    - Add policies for reading view counts
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can record own views" ON idea_views;

-- Create comprehensive policies
CREATE POLICY "Users can record own views"
  ON idea_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read view counts"
  ON idea_views FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_idea_views_user_idea ON idea_views(user_id, idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_views_viewed_at ON idea_views(viewed_at DESC);

-- Add helpful comment
COMMENT ON TABLE idea_views IS 'Track user views of ideas with proper RLS policies';