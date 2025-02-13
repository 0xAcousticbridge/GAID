/*
  # Create daily challenges table

  1. New Tables
    - `daily_challenges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `description` (text)
      - `points` (integer)
      - `progress` (integer)
      - `total` (integer)
      - `completed` (boolean)
      - `date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on daily_challenges table
    - Add policies for users to manage their own challenges
*/

CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  progress integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own daily challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own daily challenges"
  ON daily_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily challenges"
  ON daily_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);