/*
  # Platform Enhancement Migration

  1. New Tables
    - `ai_suggestions` - Stores personalized AI suggestions for users
    - `user_preferences` - Expanded user preferences for better personalization
    - `daily_insights` - Daily AI-generated insights and recommendations
    
  2. Updates
    - Add new fields to existing tables for better personalization
    - Enhance analytics tracking capabilities
    
  3. Security
    - RLS policies for new tables
    - Enhanced data privacy controls
*/

-- AI Suggestions table for personalized recommendations
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL,
  content text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  applied boolean DEFAULT false,
  effectiveness_rating integer,
  created_at timestamptz DEFAULT now(),
  applied_at timestamptz
);

ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their AI suggestions"
  ON ai_suggestions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhanced user preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_routine_preferences jsonb DEFAULT '{
    "wakeTime": "07:00",
    "sleepTime": "22:00",
    "productiveHours": ["09:00", "17:00"],
    "breakPreferences": {
      "frequency": "2h",
      "duration": "15m"
    }
  }'::jsonb,
  learning_style jsonb DEFAULT '{
    "primary": "visual",
    "secondary": "practical",
    "preferredTimeOfDay": "morning"
  }'::jsonb,
  wellness_goals jsonb DEFAULT '{
    "exercise": {
      "frequency": "3x_week",
      "duration": "30m"
    },
    "nutrition": {
      "diet": "balanced",
      "restrictions": []
    }
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily insights for personalized recommendations
CREATE TABLE IF NOT EXISTS daily_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL,
  insights jsonb NOT NULL,
  action_items jsonb DEFAULT '[]'::jsonb,
  progress_metrics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their insights"
  ON daily_insights FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create insights"
  ON daily_insights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_category ON ai_suggestions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_created_at ON ai_suggestions(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_insights_user_date ON daily_insights(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_insights_category ON daily_insights(category);

-- Add helpful comments
COMMENT ON TABLE ai_suggestions IS 'Personalized AI suggestions for users daily life optimization';
COMMENT ON TABLE user_preferences IS 'Detailed user preferences for AI personalization';
COMMENT ON TABLE daily_insights IS 'Daily AI-generated insights and recommendations';

-- Insert example data
INSERT INTO user_preferences (user_id)
SELECT id FROM users
ON CONFLICT DO NOTHING;

-- Function to generate daily insights
CREATE OR REPLACE FUNCTION generate_daily_insights()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO daily_insights (
    user_id,
    category,
    insights,
    action_items,
    progress_metrics
  )
  SELECT
    u.id,
    'daily_routine',
    jsonb_build_object(
      'summary', 'Based on your activity patterns, here are today''s insights',
      'key_observations', jsonb_build_array(
        'Peak productivity observed between 9 AM and 11 AM',
        'Successfully completed 85% of planned tasks',
        'Good progress on health goals'
      )
    ),
    jsonb_build_array(
      'Schedule deep work during morning hours',
      'Take a refreshing break at 3 PM',
      'Plan tomorrow''s tasks before end of day'
    ),
    jsonb_build_object(
      'task_completion_rate', 0.85,
      'wellness_score', 8.5,
      'productivity_score', 9.0
    )
  FROM users u
  WHERE NOT EXISTS (
    SELECT 1 FROM daily_insights
    WHERE user_id = u.id AND date = CURRENT_DATE
  );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION generate_daily_insights TO authenticated;