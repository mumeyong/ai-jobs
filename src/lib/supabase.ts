import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl !== 'your_supabase_url_here' && 
                     supabaseAnonKey !== 'your_supabase_anon_key_here';

if (!isConfigured) {
  console.warn('Supabase is not configured. Please add your real URL and Key to the .env file.');
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder-url.supabase.co', 
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);
