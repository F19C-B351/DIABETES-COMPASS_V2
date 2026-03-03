// Non-module loader for Supabase client to support file:// pages
// This script creates a blob module that imports the ESM client from the CDN
// and assigns `window.supabase` so non-module pages can access it.

const moduleSrc = `
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://uzwinhyzipndpjxmprns.supabase.co';
// Public anon key used by client-side (safe to include for frontend usage)
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d2luaHl6aXBuZHBqeG1wcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODc0MDUsImV4cCI6MjA4Nzc2MzQwNX0.-nDE5lYtJa5qUL06BT-Hh_EJ5d-Xns3nCyRRNfMb7G4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabase;
console.log('Supabase client created (blob module)');
`;

try {
    const blob = new Blob([moduleSrc], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const s = document.createElement('script');
    s.type = 'module';
    s.src = url;
    s.onload = () => { URL.revokeObjectURL(url); };
    document.head.appendChild(s);
    console.log('Injected blob module to initialize Supabase');
} catch (err) {
    console.error('Failed to inject Supabase blob module:', err);
}