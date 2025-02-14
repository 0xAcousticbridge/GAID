/*
  # Fix User Data Initialization

  1. Changes
    - Add trigger to create user profile on auth signup
    - Ensure proper initialization of settings and preferences
    - Add missing RLS policies

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies
*/

-- Create auth user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW()
  );

  -- Create user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create comprehensive policies for users table
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Initialize missing data for existing users
DO $$
BEGIN
  -- Create settings for users who don't have them
  INSERT INTO public.user_settings (user_id)
  SELECT id FROM public.users
  WHERE id NOT IN (SELECT user_id FROM public.user_settings)
  ON CONFLICT DO NOTHING;

  -- Create preferences for users who don't have them
  INSERT INTO public.user_preferences (user_id)
  SELECT id FROM public.users
  WHERE id NOT IN (SELECT user_id FROM public.user_preferences)
  ON CONFLICT DO NOTHING;
END $$;

-- Add helpful comments
COMMENT ON FUNCTION public.handle_new_user IS 'Handles initialization of user data when a new user signs up';