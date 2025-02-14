/*
  # Fix User Preferences and Settings

  1. Changes
    - Drop and recreate user_preferences table with correct structure
    - Add proper RLS policies
    - Create initialization triggers
    - Add indexes for performance

  2. Security
    - Enable RLS on user_preferences
    - Add policies for authenticated users
*/

-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Create user_preferences table with proper structure
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  daily_routine_preferences jsonb DEFAULT '{
    "wakeTime": "07:00",
    "sleepTime": "22:00",
    "productiveHours": ["morning"]
  }'::jsonb,
  learning_style jsonb DEFAULT '{
    "primary": "visual",
    "secondary": "practical",
    "preferredTimeOfDay": "morning"
  }'::jsonb,
  suggestions_frequency text DEFAULT 'sometimes',
  focus_areas text[] DEFAULT ARRAY['productivity', 'health', 'learning'],
  preferred_categories text[] DEFAULT ARRAY['daily-routine', 'meal-planning'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to initialize user preferences
CREATE OR REPLACE FUNCTION initialize_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user preferences
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user settings if they don't exist
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create user preferences and settings
DROP TRIGGER IF EXISTS create_user_preferences ON users;
CREATE TRIGGER create_user_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_preferences();

-- Initialize preferences for existing users
INSERT INTO user_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_preferences)
ON CONFLICT DO NOTHING;

-- Initialize settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_focus_areas ON user_preferences USING gin(focus_areas);
CREATE INDEX IF NOT EXISTS idx_user_preferences_preferred_categories ON user_preferences USING gin(preferred_categories);

-- Add helpful comments
COMMENT ON TABLE user_preferences IS 'User preferences including daily routine and learning settings';
COMMENT ON COLUMN user_preferences.daily_routine_preferences IS 'Daily schedule and routine preferences';
COMMENT ON COLUMN user_preferences.learning_style IS 'User learning style preferences';
COMMENT ON COLUMN user_preferences.suggestions_frequency IS 'How often the user wants AI suggestions';
COMMENT ON COLUMN user_preferences.focus_areas IS 'Areas the user wants to focus on';
COMMENT ON COLUMN user_preferences.preferred_categories IS 'Categories the user is interested in';