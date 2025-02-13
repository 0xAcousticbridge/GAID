/*
  # Add Full-Text Search Indexes

  1. Changes
    - Add GIN index for full-text search on ideas.title
    - Add tsvector column for optimized search
    - Add trigger to automatically update search vector
*/

-- Add tsvector column for search
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION ideas_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS ideas_search_vector_trigger ON ideas;
CREATE TRIGGER ideas_search_vector_trigger
  BEFORE INSERT OR UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION ideas_search_vector_update();

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS ideas_search_idx ON ideas USING GIN (search_vector);

-- Update existing records
UPDATE ideas SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C');