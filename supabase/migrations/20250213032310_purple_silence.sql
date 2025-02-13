/*
  # Add new features for AI integration and analytics

  1. New Tables
    - `idea_versions` - Track idea history
    - `idea_moderation` - AI content moderation
    - `idea_analytics` - Real-time analytics
    - `achievements` - Achievement system
    - `user_voice_commands` - Voice command preferences
    - `social_shares` - Track social sharing

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Idea versions table
CREATE TABLE IF NOT EXISTS idea_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  version_number integer NOT NULL,
  changes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE idea_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of accessible ideas"
  ON idea_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create versions for own ideas"
  ON idea_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    idea_id IN (
      SELECT id FROM ideas WHERE user_id = auth.uid()
    )
  );

-- Content moderation table
CREATE TABLE IF NOT EXISTS idea_moderation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
  confidence float,
  categories text[],
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE idea_moderation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view moderation status of own ideas"
  ON idea_moderation FOR SELECT
  TO authenticated
  USING (
    idea_id IN (
      SELECT id FROM ideas WHERE user_id = auth.uid()
    )
  );

-- Real-time analytics table
CREATE TABLE IF NOT EXISTS idea_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  views_last_hour integer DEFAULT 0,
  views_last_day integer DEFAULT 0,
  engagement_rate float DEFAULT 0,
  trending_score float DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE idea_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view idea analytics"
  ON idea_analytics FOR SELECT
  TO authenticated
  USING (true);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  badge_url text,
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Voice command preferences
CREATE TABLE IF NOT EXISTS user_voice_commands (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled boolean DEFAULT true,
  custom_commands jsonb DEFAULT '{}'::jsonb,
  language text DEFAULT 'en-US',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_voice_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their voice command preferences"
  ON user_voice_commands FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Social sharing tracking
CREATE TABLE IF NOT EXISTS social_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL,
  share_url text,
  engagement_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view share counts"
  ON social_shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create share records"
  ON social_shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_idea_versions_idea_id ON idea_versions(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_moderation_status ON idea_moderation(status);
CREATE INDEX IF NOT EXISTS idx_idea_analytics_trending ON idea_analytics(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_social_shares_idea_id ON social_shares(idea_id);

-- Insert default achievements
INSERT INTO achievements (title, description, category, points, requirements) VALUES
('First Idea', 'Share your first AI idea', 'Basics', 100, '{"ideas_created": 1}'),
('Rising Star', 'Get 100 views on your ideas', 'Growth', 200, '{"total_views": 100}'),
('Innovator', 'Create 10 unique AI ideas', 'Creation', 500, '{"ideas_created": 10}'),
('Trendsetter', 'Have an idea reach trending status', 'Impact', 1000, '{"trending_ideas": 1}'),
('Community Leader', 'Receive 100 positive reactions', 'Engagement', 1500, '{"positive_reactions": 100}')
ON CONFLICT DO NOTHING;