-- Add daily routines table
CREATE TABLE IF NOT EXISTS daily_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  schedule jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_optimized boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their daily routines"
  ON daily_routines FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  target integer NOT NULL,
  current integer DEFAULT 0,
  deadline timestamptz NOT NULL,
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add AI preferences to user settings
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS ai_preferences jsonb DEFAULT '{
  "suggestionsFrequency": "sometimes",
  "focusAreas": ["productivity", "health", "learning"],
  "preferredCategories": ["daily", "home", "health"]
}'::jsonb;

-- Add notification preferences
ALTER TABLE user_settings 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{
  "dailyReminders": true,
  "weeklyInsights": true
}'::jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_routines_user_id ON daily_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);

-- Insert example daily routines
INSERT INTO daily_routines (user_id, name, schedule, is_optimized)
SELECT 
  users.id,
  'Morning Routine',
  '[
    {"time": "07:00", "task": "Wake up & hydrate"},
    {"time": "07:15", "task": "Quick exercise"},
    {"time": "07:45", "task": "Shower & get ready"},
    {"time": "08:15", "task": "Healthy breakfast"},
    {"time": "08:45", "task": "Plan day"}
  ]'::jsonb,
  true
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT DO NOTHING;

-- Insert example goals
INSERT INTO goals (user_id, title, category, target, current, deadline)
SELECT 
  users.id,
  'Daily Steps Goal',
  'Health',
  10000,
  0,
  NOW() + INTERVAL '30 days'
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE daily_routines IS 'User daily routines with AI optimization';
COMMENT ON TABLE goals IS 'User goals with AI recommendations';
COMMENT ON COLUMN daily_routines.schedule IS 'Array of daily tasks with times';
COMMENT ON COLUMN goals.ai_recommendations IS 'AI-generated suggestions for achieving goals';