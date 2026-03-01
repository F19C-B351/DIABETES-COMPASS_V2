// Utility for loading spinner and toast notifications
export function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}
export function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}
export function showToast(message, timeout = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => container.removeChild(toast), 400);
    }, timeout);
}

// Example: Fetch all profiles from Supabase and show spinner/toast
import { supabase } from './supabaseClient.js';
export async function fetchProfiles() {
    showSpinner();
    const { data, error } = await supabase.from('profiles').select('*');
    hideSpinner();
    if (error) {
        showToast('Error loading profiles: ' + error.message);
        return [];
    }
    showToast('Loaded ' + data.length + ' profiles!');
    return data;
}
