/*
  # Seed Initial Users and Data

  1. Changes
    - Create initial users with proper auth records
    - Add sample ideas and activity
    - Ensure proper foreign key relationships
*/

-- Create initial users
DO $$
DECLARE
  auth_uid uuid;
  user_data RECORD;
BEGIN
  -- Create users with consistent IDs
  FOR user_data IN (
    SELECT * FROM (VALUES
      ('sarah_chen@example.com', 'sarah_chen', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 1000, NOW() - INTERVAL '60 days'),
      ('alex_kim@example.com', 'alex_kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 850, NOW() - INTERVAL '58 days'),
      ('maria_garcia@example.com', 'maria_garcia', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 1200, NOW() - INTERVAL '55 days')
    ) AS t(email, username, avatar_url, points, created_at)
  ) LOOP
    -- Create auth user
    auth_uid := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      auth_uid,
      '00000000-0000-0000-0000-000000000000',
      user_data.email,
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('username', user_data.username),
      user_data.created_at,
      NOW()
    );

    -- Create user profile
    INSERT INTO public.users (
      id,
      username,
      avatar_url,
      points,
      created_at
    ) VALUES (
      auth_uid,
      user_data.username,
      user_data.avatar_url,
      user_data.points,
      user_data.created_at
    );
  END LOOP;
END $$;

-- Add initial ideas
WITH first_user AS (
  SELECT id FROM users ORDER BY created_at LIMIT 1
)
INSERT INTO ideas (
  id,
  title,
  description,
  category,
  user_id,
  tags,
  created_at,
  views_count,
  favorites_count,
  comments_count
)
SELECT
  gen_random_uuid(),
  title,
  description,
  category,
  first_user.id,
  tags,
  created_at,
  FLOOR(RANDOM() * 1000)::int,
  FLOOR(RANDOM() * 100)::int,
  FLOOR(RANDOM() * 50)::int
FROM (
  VALUES
    (
      'AI-Powered Learning Assistant',
      'An intelligent system that adapts to individual learning styles and creates personalized study plans.',
      'Education',
      ARRAY['AI', 'Education', 'Machine Learning']::text[],
      NOW() - INTERVAL '30 days'
    ),
    (
      'Smart City Platform',
      'AI-driven urban management system that optimizes energy usage and traffic flow.',
      'Sustainability',
      ARRAY['AI', 'Smart City', 'Sustainability']::text[],
      NOW() - INTERVAL '25 days'
    ),
    (
      'Health Monitoring System',
      'Comprehensive health tracking system using AI for personalized wellness recommendations.',
      'Health & Wellness',
      ARRAY['AI', 'Health', 'Machine Learning']::text[],
      NOW() - INTERVAL '20 days'
    )
) AS t(title, description, category, tags, created_at)
CROSS JOIN first_user;

-- Add some initial ratings
WITH idea_ratings AS (
  SELECT i.id as idea_id, u.id as user_id
  FROM ideas i
  CROSS JOIN users u
  WHERE RANDOM() < 0.5
)
INSERT INTO idea_ratings (idea_id, user_id, rating)
SELECT 
  idea_id,
  user_id,
  FLOOR(RANDOM() * 3 + 3)::int -- Ratings between 3 and 5
FROM idea_ratings;

-- Add some initial comments
WITH idea_comments AS (
  SELECT i.id as idea_id, u.id as user_id
  FROM ideas i
  CROSS JOIN users u
  WHERE RANDOM() < 0.3
)
INSERT INTO comments (idea_id, user_id, content, created_at)
SELECT 
  idea_id,
  user_id,
  CASE FLOOR(RANDOM() * 4)::int
    WHEN 0 THEN 'Great idea! This could really transform the industry.'
    WHEN 1 THEN 'Interesting concept. Have you considered integrating with existing systems?'
    WHEN 2 THEN 'I can see a lot of potential applications for this.'
    ELSE 'Would love to collaborate on this project!'
  END,
  NOW() - (RANDOM() * 30 * INTERVAL '1 day')
FROM idea_comments;

-- Add some initial favorites
WITH idea_favorites AS (
  SELECT i.id as idea_id, u.id as user_id
  FROM ideas i
  CROSS JOIN users u
  WHERE RANDOM() < 0.4
)
INSERT INTO favorites (idea_id, user_id)
SELECT 
  idea_id,
  user_id
FROM idea_favorites;