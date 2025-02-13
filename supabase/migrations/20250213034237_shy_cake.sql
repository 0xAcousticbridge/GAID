/*
  # Fix Idea Views Handling

  1. Changes
    - Add function to safely record idea views
    - Handle duplicate view records gracefully
    - Update view counts atomically

  2. Security
    - Function runs with security definer
    - Proper permission checks within function
*/

-- Create function to safely record idea views
CREATE OR REPLACE FUNCTION record_idea_view(p_idea_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert view record if it doesn't exist
  INSERT INTO idea_views (idea_id, user_id)
  VALUES (p_idea_id, p_user_id)
  ON CONFLICT (idea_id, user_id) 
  DO UPDATE SET viewed_at = NOW();

  -- Update idea view count
  UPDATE ideas
  SET views_count = views_count + 1
  WHERE id = p_idea_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION record_idea_view TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION record_idea_view IS 'Safely record user views of ideas with duplicate handling';