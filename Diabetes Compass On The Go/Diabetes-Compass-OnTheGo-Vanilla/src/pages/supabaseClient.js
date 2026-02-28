// supabaseClient.js
// Initializes Supabase client for use in the app

const SUPABASE_URL = "<YOUR_SUPABASE_URL>";
const SUPABASE_ANON_KEY = "<YOUR_SUPABASE_ANON_KEY>";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.supabaseClient = supabase;
