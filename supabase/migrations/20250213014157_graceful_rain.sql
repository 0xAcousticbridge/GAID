/*
  # Add avatar URL to users table

  1. Changes
    - Add avatar_url column to users table
    - Make it nullable to support users without avatars
    - Add comment explaining the column's purpose

  2. Security
    - No changes to RLS policies needed as they're already set up for the users table
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url text;
    COMMENT ON COLUMN users.avatar_url IS 'URL to the user''s avatar image';
  END IF;
END $$;