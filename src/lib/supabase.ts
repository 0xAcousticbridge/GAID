import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase fetch error:', err);
        throw err;
      });
    }
  },
  db: {
    schema: 'public'
  }
});

// Add error handling for common Supabase operations
export const handleSupabaseError = (error: any) => {
  if (error.code === 'PGRST116') {
    return null; // Record not found
  }
  console.error('Supabase error:', error);
  throw error;
};

// Helper function for safe database queries
export const safeQuery = async <T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T | null> => {
  try {
    const { data, error } = await promise;
    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Database query error:', err);
    return null;
  }
};