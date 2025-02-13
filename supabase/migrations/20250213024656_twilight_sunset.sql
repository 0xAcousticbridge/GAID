/*
  # Add idea interaction and discovery features

  1. New Tables
    - `idea_views`
      - Track idea view counts
      - Support discovery algorithm
    - `idea_ratings`
      - User ratings for ideas
      - Support quality scoring
    - `idea_recommendations`
      - Personalized idea recommendations
      - Based on user interests and behavior

  2. Changes
    - Add view count to ideas
    - Add recommendation score
    - Add interaction metrics
*/

-- Add view tracking
CREATE TABLE IF NOT EXISTS idea_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

ALTER TABLE idea_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can record own views"
  ON idea_views FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add ratings
CREATE TABLE IF NOT EXISTS idea_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

ALTER TABLE idea_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON idea_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can rate once"
  ON idea_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add recommendation tracking
CREATE TABLE IF NOT EXISTS idea_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  score float NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

ALTER TABLE idea_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON idea_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add metrics to ideas table
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ideas' AND column_name = 'views_count'
  ) THEN
    ALTER TABLE ideas 
      ADD COLUMN views_count integer DEFAULT 0,
      ADD COLUMN recommendation_score float DEFAULT 0,
      ADD COLUMN interaction_rate float DEFAULT 0;
  END IF;
END $$;

-- Function to update view count
CREATE OR REPLACE FUNCTION update_idea_views_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ideas 
  SET views_count = views_count + 1,
      interaction_rate = (CAST(views_count + 1 + favorites_count + comments_count AS float) / CAST(views_count + 1 AS float))
  WHERE id = NEW.idea_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for view count
CREATE TRIGGER update_views_count
  AFTER INSERT ON idea_views
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_views_count();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_idea_views_idea_id ON idea_views(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_ratings_idea_id ON idea_ratings(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_recommendations_user_id ON idea_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_recommendation_score ON ideas(recommendation_score);
CREATE INDEX IF NOT EXISTS idx_ideas_interaction_rate ON ideas(interaction_rate);