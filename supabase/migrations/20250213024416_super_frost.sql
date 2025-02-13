/*
  # Add user profile and challenges tables

  1. New Tables
    - `challenges`
      - Daily, weekly, and lifetime challenges
      - Progress tracking
      - Points and rewards
    - `user_achievements`
      - Track user achievements and badges
    - `user_settings`
      - User preferences and settings

  2. Changes
    - Add profile fields to users table
    - Add challenge completion tracking
*/

-- Add profile fields to users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bio'
  ) THEN
    ALTER TABLE users ADD COLUMN bio text;
    ALTER TABLE users ADD COLUMN website text;
    ALTER TABLE users ADD COLUMN location text;
    ALTER TABLE users ADD COLUMN social_links jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'weekly', 'lifetime')),
  points integer NOT NULL DEFAULT 0,
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- User challenge progress
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenge progress"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  badge_url text,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  font_size text DEFAULT 'medium',
  notifications jsonb DEFAULT '{"email": true, "push": true, "inApp": true}'::jsonb,
  accessibility jsonb DEFAULT '{"reduceMotion": false, "highContrast": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default challenges
INSERT INTO challenges (title, description, type, points, requirements) VALUES
('Daily Innovator', 'Share one new AI idea', 'daily', 50, '{"ideas_shared": 1}'),
('Weekly Contributor', 'Comment on 10 ideas', 'weekly', 100, '{"comments_made": 10}'),
('Community Builder', 'Get 100 likes on your ideas', 'lifetime', 500, '{"total_likes": 100}'),
('AI Pioneer', 'Share 50 ideas', 'lifetime', 1000, '{"total_ideas": 50}'),
('Engagement Master', 'Interact with 1000 ideas', 'lifetime', 2000, '{"total_interactions": 1000}')
ON CONFLICT DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);