/*
  # Add AI prompt functionality

  1. New Tables
    - `saved_prompts`
      - Store user's saved AI prompts
      - Track prompt usage and effectiveness

  2. Changes
    - Add prompt-related fields to ideas table
    - Add tracking for prompt generation
*/

-- Saved prompts table
CREATE TABLE IF NOT EXISTS saved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  used_count integer DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved prompts"
  ON saved_prompts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add prompt tracking to ideas
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ideas' AND column_name = 'generated_from_prompt'
  ) THEN
    ALTER TABLE ideas 
      ADD COLUMN generated_from_prompt uuid REFERENCES saved_prompts(id),
      ADD COLUMN prompt_effectiveness float;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_saved_prompts_user_id ON saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_generated_from_prompt ON ideas(generated_from_prompt);