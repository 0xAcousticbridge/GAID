/*
  # Update Example Ideas
  
  1. Changes
    - Remove existing example ideas and their related records
    - Insert new daily life focused ideas
  
  2. Details
    - Safely removes old ideas by first deleting related records
    - Adds new examples focused on practical daily use cases
    - Uses valid UUID format for all IDs
*/

-- First remove related records from favorites
DELETE FROM favorites 
WHERE idea_id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'
);

-- Then remove related records from comments
DELETE FROM comments
WHERE idea_id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'
);

-- Then remove related records from idea_ratings
DELETE FROM idea_ratings
WHERE idea_id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'
);

-- Now we can safely delete the ideas
DELETE FROM ideas 
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  '7c9e6679-7425-40de-944b-e07fc1f90ae7'
);

-- Insert new daily life focused ideas
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
  'Smart Recipe Recommender',
  'An AI system that suggests personalized recipes based on your dietary preferences, available ingredients, cooking skill level, and time constraints. It learns from your feedback and adjusts recommendations to match your taste.',
  'Food & Cooking',
  users.id,
  ARRAY['AI', 'Food', 'Personalization', 'Daily Life'],
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
  'Family Schedule Assistant',
  'A smart calendar that coordinates family activities, manages conflicts, and suggests optimal timing for tasks. It considers each family member''s routines, preferences, and commitments to create balanced schedules.',
  'Home & Family',
  users.id,
  ARRAY['AI', 'Organization', 'Family', 'Productivity'],
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
  'Personal Wellness Coach',
  'An AI companion that creates personalized wellness plans combining exercise, nutrition, and mental health. It adapts to your daily energy levels, schedule, and goals while providing gentle reminders and motivation.',
  'Health & Wellness',
  users.id,
  ARRAY['AI', 'Health', 'Wellness', 'Personal'],
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
  'd290f1ee-6c54-4b01-90e6-d701748f0851'::uuid,
  'Smart Shopping Assistant',
  'An AI that helps you create shopping lists, finds the best deals, and suggests budget-friendly alternatives. It learns your preferences and helps avoid impulse purchases while ensuring you never forget essential items.',
  'Shopping & Finance',
  users.id,
  ARRAY['AI', 'Shopping', 'Budget', 'Daily Life'],
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
  'e7f6c011-2c34-4b01-8c3f-d701748f0852'::uuid,
  'Home Energy Optimizer',
  'An AI system that learns your daily routines and automatically adjusts home settings for optimal comfort and energy savings. It manages lighting, temperature, and appliances while providing easy-to-understand usage insights.',
  'Daily Life',
  users.id,
  ARRAY['AI', 'Smart Home', 'Sustainability', 'Automation'],
  NOW()
FROM users
WHERE users.username = (SELECT MIN(username) FROM users)
ON CONFLICT (id) DO NOTHING;