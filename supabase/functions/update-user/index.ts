// Update user Edge Function
// Updates auth user via admin API and updates profile + role rows.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uzwinhyzipndpjxmprns.supabase.co';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export default async (req: Request) => {
    try {
        const payload = await req.json();
        const headers = {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`
        };

        if (!payload.user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
        const userId = payload.user_id;

        // Update auth user (email/password)
        const authBody: any = {};
        if (payload.email) authBody.email = payload.email;
        if (payload.password) authBody.password = payload.password;

        if (Object.keys(authBody).length > 0) {
            const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(authBody)
            });
            if (!authRes.ok) {
                const text = await authRes.text();
                return new Response(text, { status: authRes.status });
            }
        }

        // Update profile
        const profileBody = {
            name: payload.name || null,
            diabetes_type: payload.diabetes_type || null,
            glucose_unit: payload.glucose_unit || null,
            insulin_user: payload.insulin_user || null,
            phone_number: payload.phone_number || null
        };

        const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}`, {
            method: 'PATCH',
            headers: { ...headers, Prefer: 'return=representation' },
            body: JSON.stringify(profileBody)
        });

        if (!profileRes.ok) {
            const text = await profileRes.text();
            return new Response(text, { status: profileRes.status });
        }

        // Update or insert role
        if (payload.role) {
            // check existing
            const rolesRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${userId}`, { headers });
            const roles = await rolesRes.json();
            if (roles && roles.length > 0) {
                const updateRoleRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${userId}`, {
                    method: 'PATCH',
                    headers: { ...headers, Prefer: 'return=representation' },
                    body: JSON.stringify({ user_role: payload.role })
                });
                if (!updateRoleRes.ok) {
                    const text = await updateRoleRes.text();
                    return new Response(text, { status: updateRoleRes.status });
                }
            } else {
                const insertRoleRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
                    method: 'POST',
                    headers: { ...headers, Prefer: 'return=representation' },
                    body: JSON.stringify({ user_id: userId, user_role: payload.role })
                });
                if (!insertRoleRes.ok) {
                    const text = await insertRoleRes.text();
                    return new Response(text, { status: insertRoleRes.status });
                }
            }
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
    }
};
