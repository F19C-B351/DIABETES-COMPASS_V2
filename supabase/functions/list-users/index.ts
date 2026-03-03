// List users Edge Function
// Returns combined profiles with role information using the service role key.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://uzwinhyzipndpjxmprns.supabase.co';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

export default async (req: Request) => {
  try {
    const incomingAuth = req.headers.get('authorization') || '';
    const headersService = {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    };

    // If caller provided a user JWT, try to identify the user server-side and return only that user's profile+role
    if (incomingAuth && !incomingAuth.includes(SERVICE_KEY)) {
      // Validate token by calling Supabase auth user endpoint
      const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { 'Authorization': incomingAuth } });
      if (!userRes.ok) {
        const txt = await userRes.text();
        return new Response(txt, { status: userRes.status, headers: { 'Content-Type': 'application/json' } });
      }
      const userObj = await userRes.json();
      const userId = userObj?.id || userObj?.user?.id;

      if (!userId) {
        return new Response(JSON.stringify({ error: 'Unable to determine user from token' }), { status: 401 });
      }

      // Fetch profile for this user using service role key
      const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}&select=*`, { headers: headersService });
      if (!profileRes.ok) {
        const text = await profileRes.text();
        return new Response(text, { status: profileRes.status });
      }
      const profiles = await profileRes.json();

      // Fetch role for this user
      const rolesRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${userId}&select=*`, { headers: headersService });
      if (!rolesRes.ok) {
        const text = await rolesRes.text();
        return new Response(text, { status: rolesRes.status });
      }
      const roles = await rolesRes.json();

      const p = (profiles || [])[0] || { user_id: userId };
      const r = (roles || [])[0];
      const combined = {
        ...p,
        role: r?.user_role || 'user',
        role_id: r?.id || null
      };

      return new Response(JSON.stringify([combined]), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Default: return full list (service-key authenticated environment)
    const profilesRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, { headers: headersService });
    if (!profilesRes.ok) {
      const text = await profilesRes.text();
      return new Response(text, { status: profilesRes.status });
    }
    const profiles = await profilesRes.json();

    const rolesRes = await fetch(`${SUPABASE_URL}/rest/v1/user_roles?select=*`, { headers: headersService });
    if (!rolesRes.ok) {
      const text = await rolesRes.text();
      return new Response(text, { status: rolesRes.status });
    }
    const roles = await rolesRes.json();

    const combined = (profiles || []).map((p: any) => {
      const r = (roles || []).find((x: any) => x.user_id === p.user_id);
      return {
        ...p,
        role: r?.user_role || 'user',
        role_id: r?.id || null
      };
    });

    return new Response(JSON.stringify(combined), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
