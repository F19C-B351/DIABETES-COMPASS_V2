// Simple Supabase initialization (non-module)
// This loads synchronously via direct script tags instead of ES6 imports

(async function initSupabase() {
    console.log('🔄 Starting Supabase initialization...');

    const SUPABASE_URL = 'https://uzwinhyzipndpjxmprns.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d2luaHl6aXBuZHBqeG1wcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODc0MDUsImV4cCI6MjA4Nzc2MzQwNX0.-nDE5lYtJa5qUL06BT-Hh_EJ5d-Xns3nCyRRNfMb7G4';

    // Wait for Supabase library to be available globally
    let supabaseLib = null;
    let attempts = 0;
    const maxAttempts = 150; // 15 seconds max

    while (!supabaseLib && attempts < maxAttempts) {
        // Check if createClient exists in window.supabase
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            supabaseLib = window.supabase;
            console.log(`✓ Supabase library detected after ${attempts * 100}ms`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!supabaseLib) {
        console.error('❌ Supabase.js CDN library did not load. Status:');
        console.error('  - window.supabase exists:', !!window.supabase);
        console.error('  - window.supabase.createClient exists:', !!(window.supabase && window.supabase.createClient));
        console.error('  - Attempts made:', attempts);
        return;
    }

    console.log('✓ Supabase CDN library is ready');

    try {
        // Create client using the global createClient function
        const createClient = supabaseLib.createClient;

        if (typeof createClient !== 'function') {
            throw new Error('createClient is not a function');
        }

        console.log(`Creating client with URL: ${SUPABASE_URL}`);

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        if (!supabase) {
            throw new Error('createClient returned null or undefined');
        }

        window.supabase = supabase;
        console.log('✓ Supabase client created successfully');

        // Test basic connectivity
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            console.log('✓ Auth session check passed');
        } catch (e) {
            console.warn('⚠ Auth check resulted in:', e.message);
        }

        // Profile management functions
        window.getProfiles = async function () {
            try {
                const { data, error } = await supabase.from('profiles').select('*');
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching profiles:', error);
                return [];
            }
        };

        window.getCurrentUserProfile = async function () {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return null;
                const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error fetching current user profile:', error);
                return null;
            }
        };

        window.updateUserProfile = async function (profileData) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not logged in');
                const { data, error } = await supabase.from('profiles').upsert({
                    user_id: user.id,
                    ...profileData
                }, { onConflict: 'user_id' });
                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('Error updating profile:', error);
                return { success: false, error: error.message };
            }
        };

        // Mark as ready
        window.supabaseReady = true;
        window.dispatchEvent(new CustomEvent('supabaseReady'));
        console.log('✓ Supabase initialization complete');

    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error.message);
        console.error('Stack:', error.stack);
    }
})();
