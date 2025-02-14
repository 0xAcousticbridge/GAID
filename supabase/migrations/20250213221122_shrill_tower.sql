/*
  # Fix User Settings and Theme Preferences

  1. Changes
    - Add trigger to create user profile and settings on auth signup
    - Add missing RLS policies
    - Initialize settings for existing users
    - Fix theme preference handling

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies
*/

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS create_user_settings ON users;
DROP TRIGGER IF EXISTS create_user_preferences ON users;

-- Create comprehensive auth user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (
    id,
    username,
    onboarding_completed,
    created_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    false,
    NOW()
  );

  -- Create user settings with default theme
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
  );

  -- Create user preferences with defaults
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
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;

-- Create comprehensive policies
CREATE POLICY "Users can read own settings"
  ON public.user_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Initialize settings for existing users
DO $$
BEGIN
  -- Create settings for users who don't have them
  INSERT INTO public.user_settings (
    user_id,
    theme,
    font_size,
    notifications,
    accessibility
  )
  SELECT 
    id,
    'system',
    'medium',
    '{"email": true, "push": true, "inApp": true}'::jsonb,
    '{"reduceMotion": false, "highContrast": false}'::jsonb
  FROM public.users
  WHERE id NOT IN (SELECT user_id FROM public.user_settings)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create preferences for users who don't have them
  INSERT INTO public.user_preferences (
    user_id,
    daily_routine_preferences,
    learning_style,
    suggestions_frequency,
    focus_areas,
    preferred_categories
  )
  SELECT 
    id,
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
  FROM public.users
  WHERE id NOT IN (SELECT user_id FROM public.user_preferences)
  ON CONFLICT (user_id) DO NOTHING;
END $$;

-- Add helpful comments
COMMENT ON FUNCTION public.handle_new_user IS 'Handles initialization of user data when a new user signs up';
COMMENT ON TABLE public.user_settings IS 'User settings including theme and accessibility preferences';
COMMENT ON TABLE public.user_preferences IS 'User preferences for AI assistance and daily routines';