/*
  # Add counters and triggers for ideas

  1. Changes
    - Add comments_count and favorites_count to ideas table
    - Create triggers to automatically update counts
    - Add indexes for better performance

  2. Security
    - No new policies needed as we're only adding counters and triggers
*/

-- Add comments count to ideas
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ideas' AND column_name = 'comments_count'
  ) THEN
    ALTER TABLE ideas ADD COLUMN comments_count integer DEFAULT 0;
  END IF;
END $$;

-- Add favorites count to ideas
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ideas' AND column_name = 'favorites_count'
  ) THEN
    ALTER TABLE ideas ADD COLUMN favorites_count integer DEFAULT 0;
  END IF;
END $$;

-- Function to update comments count
CREATE OR REPLACE FUNCTION update_idea_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ideas SET comments_count = comments_count + 1 WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ideas SET comments_count = comments_count - 1 WHERE id = OLD.idea_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update favorites count
CREATE OR REPLACE FUNCTION update_idea_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ideas SET favorites_count = favorites_count + 1 WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ideas SET favorites_count = favorites_count - 1 WHERE id = OLD.idea_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating counts
DROP TRIGGER IF EXISTS update_comments_count ON comments;
CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_comments_count();

DROP TRIGGER IF EXISTS update_favorites_count ON favorites;
CREATE TRIGGER update_favorites_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_favorites_count();