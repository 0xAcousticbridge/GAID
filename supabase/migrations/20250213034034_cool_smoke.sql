/*
  # Add Initial Ideas and Fix Favorites

  1. New Data
    - Add initial ideas for testing and development
    - Ensure proper foreign key relationships

  2. Changes
    - Add sample ideas with valid UUIDs
    - Add indexes for better query performance
*/

-- Add initial ideas
INSERT INTO ideas (
  id,
  title,
  description,
  category,
  user_id,
  tags,
  created_at
)
SELECT 
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'AI-Powered Personal Learning Assistant',
  'An intelligent system that adapts to individual learning styles, creating personalized study plans and interactive content to optimize educational outcomes.',
  'Education',
  users.id,
  ARRAY['AI', 'Education', 'Machine Learning'],
  NOW()
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ideas (
  id,
  title,
  description,
  category,
  user_id,
  tags,
  created_at
)
SELECT 
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8'::uuid,
  'Sustainable Smart City Platform',
  'AI-driven urban management system that optimizes energy usage, traffic flow, and waste management while promoting sustainable living practices.',
  'Sustainability',
  users.id,
  ARRAY['AI', 'Smart City', 'Sustainability'],
  NOW()
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ideas (
  id,
  title,
  description,
  category,
  user_id,
  tags,
  created_at
)
SELECT 
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'::uuid,
  'AI Health Monitoring Ecosystem',
  'Comprehensive health tracking system that uses AI to analyze vital signs, sleep patterns, and lifestyle factors to provide personalized wellness recommendations.',
  'Health & Wellness',
  users.id,
  ARRAY['AI', 'Health', 'Machine Learning'],
  NOW()
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT (id) DO NOTHING;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at DESC);

-- Add comment
COMMENT ON TABLE ideas IS 'AI project ideas with proper foreign key relationships';