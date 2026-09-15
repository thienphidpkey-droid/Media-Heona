import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fktotmzqfbesbidpqbqb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdG90bXpxZmJlc2JpZHBxYnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NDI0ODYsImV4cCI6MjEwNTAxODQ4Nn0.ealuc-W9k7h4ne6LboVHslLYVssZjXWozwYO9lltxQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);