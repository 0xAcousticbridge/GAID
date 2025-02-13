/*
  # Add missing tables and columns for ideas

  1. Changes to Ideas Table
    - Add `tags` column (text array)
    - Add indexes for better performance

  2. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `user_id` (uuid, references users)
      - `content` (text)
      - `created_at` (timestamp)
    
    - `collections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `idea_id` (uuid, references ideas)
      - `collection_name` (text)
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for data access
*/

-- Add tags to ideas table
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  collection_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, idea_id, collection_name)
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own collections"
  ON collections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ideas_tags ON ideas USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_comments_idea_id ON comments(idea_id);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_idea_id ON collections(idea_id);