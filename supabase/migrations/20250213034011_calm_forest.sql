/*
  # Fix Users Table RLS Policies

  1. Changes
    - Update RLS policies for users table to allow profile creation
    - Add policy for inserting new user profiles
    - Maintain existing read/update policies

  2. Security
    - Only allow users to create their own profile
    - Maintain existing security for reading and updating profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create comprehensive policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add helpful comment
COMMENT ON TABLE users IS 'User profiles with RLS enabled for secure access control';