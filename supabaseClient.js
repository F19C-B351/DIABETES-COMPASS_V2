// supabaseClient.js for Diabetes Compass V2
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://uzwinhyzipndpjxmprns.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d2luaHl6aXBuZHBqeG1wcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODc0MDUsImV4cCI6MjA4Nzc2MzQwNX0.-nDE5lYtJa5qUL06BT-Hh_EJ5d-Xns3nCyRRNfMb7G4';

console.log('Initializing Supabase client with URL:', SUPABASE_URL);

let supabase;
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✓ Supabase client created successfully');
} catch (error) {
    console.error('✗ Failed to create Supabase client:', error);
}

// Expose supabase to window for non-module scripts
window.supabase = supabase;

console.log('Supabase exposed to window.supabase');

// Verify connection on load
window.verifySupabaseConnection = async () => {
    try {
        console.log('Verifying Supabase connection...');

        if (!supabase) {
            console.error('✗ Supabase client is not initialized');
            return { connected: false, error: 'Client not initialized' };
        }

        console.log('✓ Supabase client exists');

        // Try to get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.warn('Session error (may be expected):', sessionError.message);
        } else {
            console.log('✓ Can query session');
        }

        // Try to fetch from profiles table
        const { data, error } = await supabase
            .from('profiles')
            .select('count', { count: 'exact' });

        if (error) {
            console.error('✗ Error accessing profiles table:', error.message);
            return { connected: false, error: error.message };
        }

        console.log('✓ Supabase connection verified - profiles table accessible');
        return { connected: true, message: 'Connection successful' };
    } catch (error) {
        console.error('✗ Verification failed:', error);
        return { connected: false, error: error.message };
    }
};

// Run initial verification
window.verifySupabaseConnection().then(result => {
    console.log('Initial connection check:', result);
});

// Test Supabase connection
window.testSupabaseConnection = async () => {
    try {
        console.log('Testing Supabase connection...');

        // Test 1: Check if client is initialized
        if (!supabase) {
            console.error('Supabase client not initialized');
            return { success: false, error: 'Client not initialized' };
        }
        console.log('✓ Supabase client initialized');

        // Test 2: Try to fetch from profiles table
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (error) {
            console.error('✗ Error fetching from profiles:', error);
            return { success: false, error: error.message };
        }

        console.log('✓ Supabase profiles table accessible');
        console.log('Sample data:', data);

        return { success: true, message: 'Supabase connection working!' };
    } catch (error) {
        console.error('✗ Connection test failed:', error);
        return { success: false, error: error.message };
    }
};

// Fetch all user profiles
window.fetchAllProfiles = async () => {
    try {
        console.log('Fetching all profiles...');
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.error('Error fetching profiles:', error);
            return null;
        }

        console.log('Profiles fetched:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Insert test data
window.insertTestProfile = async (email, name) => {
    try {
        console.log('Inserting test profile...');
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                email,
                name,
                diabetes_type: 'Type 1',
                glucose_unit: 'mg/dL',
                insulin_user: 'Yes'
            }]);

        if (error) {
            console.error('Error inserting profile:', error);
            return { success: false, error };
        }

        console.log('Profile inserted:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
};