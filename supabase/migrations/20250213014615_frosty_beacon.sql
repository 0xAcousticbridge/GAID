/*
  # Add social features and collaboration

  1. New Tables
    - `follows` - User following relationships
      - `follower_id` (uuid, references users)
      - `following_id` (uuid, references users)
      - `created_at` (timestamptz)
    
    - `collaborations` - Project collaboration system
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `user_id` (uuid, references users)
      - `role` (text)
      - `status` (text)
      - `created_at` (timestamptz)

    - `activity_feed` - User activity tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (text)
      - `content` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid REFERENCES users(id) NOT NULL,
  following_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see who follows whom"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'contributor', 'reviewer')),
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see collaborations"
  ON collaborations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create collaboration requests"
  ON collaborations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collaboration status"
  ON collaborations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  type text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see activity feed"
  ON activity_feed FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create activity items"
  ON activity_feed FOR INSERT
  TO authenticated
  WITH CHECK (true);