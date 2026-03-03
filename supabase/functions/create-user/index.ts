// Create user Edge Function
// Creates a user via Supabase Auth Admin API and inserts profile + role rows.

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

    // Create auth user (admin)
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        email_confirm: true
      })
    });

    if (!createRes.ok) {
      const text = await createRes.text();
      return new Response(text, { status: createRes.status });
    }

    const created = await createRes.json();
    const userId = created.id;

    // Insert profile
    const profileBody = {
      user_id: userId,
      email: payload.email,
      name: payload.name || null,
      diabetes_type: payload.diabetes_type || null,
      glucose_unit: payload.glucose_unit || null,
      insulin_user: payload.insulin_user || null,
      phone_number: payload.phone_number || null
    };

    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify(profileBody)
    });

    if (!profileRes.ok) {
      const text = await profileRes.text();
      return new Response(text, { status: profileRes.status });
    }

    // Insert role
    if (payload.role) {
      const roleRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=representation' },
        body: JSON.stringify({ user_id: userId, user_role: payload.role })
      });
      if (!roleRes.ok) {
        const text = await roleRes.text();
        return new Response(text, { status: roleRes.status });
      }
    }

    return new Response(JSON.stringify({ success: true, id: userId }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
};
