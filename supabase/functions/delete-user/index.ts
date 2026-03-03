// Delete user Edge Function
// Deletes auth user and removes profile and role rows.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uzwinhyzipndpjxmprns.supabase.co';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export default async (req: Request) => {
    try {
        const payload = await req.json();
        if (!payload.user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
        const userId = payload.user_id;

        const headers = {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
        };

        // Delete auth user
        const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
            method: 'DELETE',
            headers
        });
        if (!authRes.ok) {
            const text = await authRes.text();
            return new Response(text, { status: authRes.status });
        }

        // Delete profile
        await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}`, { method: 'DELETE', headers });

        // Delete roles
        await fetch(`${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${userId}`, { method: 'DELETE', headers });

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
    }
};
