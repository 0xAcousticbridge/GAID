/*
  # Fix User Settings and RLS Policies

  1. Changes
    - Add user_settings table if not exists
    - Add proper RLS policies for user_settings
    - Add onboarding_completed column to users table
  
  2. Security
    - Enable RLS on user_settings table
    - Add policies for user management of their settings
*/

-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  theme text DEFAULT 'system',
  font_size text DEFAULT 'medium',
  notifications jsonb DEFAULT '{"email": true, "push": true, "inApp": true}'::jsonb,
  accessibility jsonb DEFAULT '{"reduceMotion": false, "highContrast": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;

-- Create comprehensive policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add onboarding_completed column to users if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE users ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Create function to initialize user settings
CREATE OR REPLACE FUNCTION initialize_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create user settings
DROP TRIGGER IF EXISTS create_user_settings ON users;
CREATE TRIGGER create_user_settings
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_settings();

-- Add helpful comments
COMMENT ON TABLE user_settings IS 'User preferences and settings with proper RLS';
COMMENT ON COLUMN user_settings.theme IS 'User theme preference (light/dark/system)';
COMMENT ON COLUMN users.onboarding_completed IS 'Whether the user has completed the onboarding flow';