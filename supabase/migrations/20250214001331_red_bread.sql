/*
  # Fix User Settings Initialization

  1. Changes
    - Recreate user_settings and user_preferences tables with proper structure
    - Add comprehensive trigger for user initialization
    - Add proper RLS policies
    - Fix foreign key constraints

  2. Security
    - Enable RLS on all tables
    - Add proper policies for authenticated users
*/

-- Recreate user_settings table with proper structure
DROP TABLE IF EXISTS user_settings CASCADE;
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  theme text DEFAULT 'system',
  font_size text DEFAULT 'medium',
  notifications jsonb DEFAULT '{"email": true, "push": true, "inApp": true}'::jsonb,
  accessibility jsonb DEFAULT '{"reduceMotion": false, "highContrast": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Recreate user_preferences table with proper structure
DROP TABLE IF EXISTS user_preferences CASCADE;
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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
  CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user settings
  INSERT INTO public.user_settings (
    user_id,
    theme,
    font_size,
    notifications,
    accessibility
  ) VALUES (
    NEW.id,
    'system',
    'medium',
    '{"email": true, "push": true, "inApp": true}'::jsonb,
    '{"reduceMotion": false, "highContrast": false}'::jsonb
  ) ON CONFLICT (user_id) DO NOTHING;

  -- Create user preferences
  INSERT INTO public.user_preferences (
    user_id,
    daily_routine_preferences,
    learning_style,
    suggestions_frequency,
    focus_areas,
    preferred_categories
  ) VALUES (
    NEW.id,
    '{
      "wakeTime": "07:00",
      "sleepTime": "22:00",
      "productiveHours": ["morning"]
    }'::jsonb,
    '{
      "primary": "visual",
      "secondary": "practical",
      "preferredTimeOfDay": "morning"
    }'::jsonb,
    'sometimes',
    ARRAY['productivity', 'health', 'learning'],
    ARRAY['daily-routine', 'meal-planning']
  ) ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Initialize data for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Create settings if they don't exist
    INSERT INTO public.user_settings (
      user_id,
      theme,
      font_size,
      notifications,
      accessibility
    ) VALUES (
      user_record.id,
      'system',
      'medium',
      '{"email": true, "push": true, "inApp": true}'::jsonb,
      '{"reduceMotion": false, "highContrast": false}'::jsonb
    ) ON CONFLICT (user_id) DO NOTHING;

    -- Create preferences if they don't exist
    INSERT INTO public.user_preferences (
      user_id,
      daily_routine_preferences,
      learning_style,
      suggestions_frequency,
      focus_areas,
      preferred_categories
    ) VALUES (
      user_record.id,
      '{
        "wakeTime": "07:00",
        "sleepTime": "22:00",
        "productiveHours": ["morning"]
      }'::jsonb,
      '{
        "primary": "visual",
        "secondary": "practical",
        "preferredTimeOfDay": "morning"
      }'::jsonb,
      'sometimes',
      ARRAY['productivity', 'health', 'learning'],
      ARRAY['daily-routine', 'meal-planning']
    ) ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Add helpful comments
COMMENT ON TABLE user_settings IS 'User settings including theme and accessibility preferences';
COMMENT ON TABLE user_preferences IS 'User preferences for AI assistance and daily routines';
COMMENT ON FUNCTION handle_new_user IS 'Handles initialization of user data when a new user signs up';