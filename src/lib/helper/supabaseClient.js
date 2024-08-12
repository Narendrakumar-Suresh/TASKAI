import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY; // Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
