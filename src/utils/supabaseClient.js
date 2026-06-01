import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhrsvayffgvisddbsmfb.supabase.co';
const supabaseAnonKey = 'sb_publishable_HEIIAkSFjQfXliSPWvp65g_E1eq_FdL';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
