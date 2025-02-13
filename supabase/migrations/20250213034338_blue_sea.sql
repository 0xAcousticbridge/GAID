/*
  # Add Idea Editing Support

  1. Changes
    - Add edit policy for idea creators
    - Add version tracking trigger
    - Add version number sequence

  2. Security
    - Only idea creators can edit their ideas
    - Automatic version tracking
*/

-- Create sequence for version numbers
CREATE SEQUENCE IF NOT EXISTS idea_version_seq;

-- Add edit policy for ideas
CREATE POLICY "Users can edit own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to create version history
CREATE OR REPLACE FUNCTION track_idea_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create version record
  INSERT INTO idea_versions (
    idea_id,
    user_id,
    title,
    description,
    version_number,
    changes,
    created_at
  ) VALUES (
    OLD.id,
    OLD.user_id,
    OLD.title,
    OLD.description,
    nextval('idea_version_seq'),
    jsonb_build_object(
      'title', CASE WHEN NEW.title <> OLD.title THEN jsonb_build_object('old', OLD.title, 'new', NEW.title) ELSE NULL END,
      'description', CASE WHEN NEW.description <> OLD.description THEN jsonb_build_object('old', OLD.description, 'new', NEW.description) ELSE NULL END,
      'category', CASE WHEN NEW.category <> OLD.category THEN jsonb_build_object('old', OLD.category, 'new', NEW.category) ELSE NULL END,
      'tags', CASE WHEN NEW.tags <> OLD.tags THEN jsonb_build_object('old', OLD.tags, 'new', NEW.tags) ELSE NULL END
    ) - 'null',
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for version tracking
DROP TRIGGER IF EXISTS idea_version_trigger ON ideas;
CREATE TRIGGER idea_version_trigger
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION track_idea_version();

-- Add helpful comment
COMMENT ON FUNCTION track_idea_version IS 'Automatically track version history when ideas are updated';