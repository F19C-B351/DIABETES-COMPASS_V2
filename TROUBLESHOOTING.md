# Supabase Sign-up Error: "Failed to fetch" - Troubleshooting Guide

## 🔍 What This Error Means

"Failed to fetch" typically indicates a network connectivity or CORS issue when trying to communicate with Supabase's authentication API.

## 🧪 Step 1: Run the Diagnostics Test

1. **Open your browser** and go to: `http://127.0.0.1:8080/supabase-test.html`
2. **Click "Run All Tests"** button
3. **Check the results** - each test will show if that step is working

### What Each Test Checks:
- ✅ **Step 1: Supabase SDK** - Can the Supabase library load?
- ✅ **Step 2: Client Creation** - Can we create a Supabase client?
- ✅ **Step 3: API Connection** - Can we reach Supabase's servers?
- ✅ **Step 4: Database Access** - Can we read from the database?
- ✅ **Step 5: Auth Signup** - Can we call the signup function?

## 🐛 Debugging in Browser Console (F12)

1. **Open your browser's Developer Console**: Press `F12`
2. **Go to the Console tab**
3. **Try the signup again** and watch for error messages
4. **Look for these messages**:

### Expected Success Messages:
```
✓ Supabase client ready, calling auth.signUp...
✓ Sign-up request sent, waiting for response...
✓ Sign-up successful, received data:
```

### If You See These Errors:

**Error: "Network error: Cannot reach Supabase"**
- Your internet connection might be down
- The Supabase API might be temporarily unavailable
- There might be a firewall blocking the connection to supabase.com

**Solution:**
1. Check your internet connection
2. Try visiting https://status.supabase.com to see if Supabase is down
3. Check if firewalls are blocking `*.supabase.com`

---

**Error: "undefined is not a function"**
- The Supabase client didn't initialize properly
- The JavaScript module failed to load

**Solution:**
1. Hard refresh the page: `Ctrl+F5` or `Cmd+Shift+R`
2. Wait 3-5 seconds for all scripts to load
3. Run the test page above to verify the client loads

---

**Error: "TypeError: Failed to fetch"**
- The fetch request to Supabase failed
- Network connectivity issue

**Solution:**
1. Run the diagnostics test (Step 1 above)
2. Check Network tab in DevTools (F12 → Network)
3. Look for failed requests to `uzwinhyzipndpjxmprns.supabase.com`

---

**Error: "Invalid API key"**
- The Supabase publishable key is wrong or expired

**Solution:**
1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the publishable key (starting with `sb_pub_...` or `sb_anon_...`)
5. Verify it matches in `supabaseClient.js`

---

## 📋 Browser Console Check List

Copy and paste these commands in the browser console (F12 → Console) to test:

```javascript
// 1. Check if Supabase is loaded
console.log(window.supabase)

// 2. Verify connection
await window.verifySupabaseConnection()

// 3. Test the signup directly
const result = await window.supabase.auth.signUp({
    email: 'test@example.com',
    password: 'TestPassword123!'
})
console.log('Signup result:', result)

// 4. Check network status
console.log('Online:', navigator.onLine)

// 5. Fetch Supabase status
fetch('https://status.supabase.com/api/v2/status.json')
    .then(r => r.json())
    .then(data => console.log('Supabase Status:', data))
    .catch(e => console.log('Status check failed:', e))
```

## 🔧 CORS Issues (Advanced)

If tests show "API Connection" failing:

1. The Supabase API itself might be blocking requests
2. Check your Supabase project settings for:
   - **Authentication Provider Settings**
   - **CORS Configuration**

To fix:
1. Go to Supabase Dashboard → Project Settings → Auth
2. Ensure `http://127.0.0.1:8080` is in the "Authorized URLs" list
3. Or add `http://localhost:8080`

## 📶 Network Tab Analysis

To see exactly what's happening:

1. Open DevTools: `F12`
2. Click **Network** tab
3. Try to sign up again
4. Look for requests to URLs containing:
   - `supabase.com` - your API calls
   - `auth` - authentication requests
5. Click on any failed requests (red) to see details
6. Check the **Response** tab for error messages

## 🚀 Quick Reset Steps

If nothing else works:

1. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Close all tabs** with your app
3. **Open a new tab** and go to `http://127.0.0.1:8080`
4. **Run the test page**: `http://127.0.0.1:8080/supabase-test.html`
5. **Post your results**: Share the test results showing which step fails

## ✅ When It Works

You should see:
1. **Browser Console**: `✓ Sign-up successful, received data:`
2. **Page**: User banner appears with your name
3. **Supabase Dashboard**: New user appears in Auth section

## 📱 Still Having Issues?

Share these details:
1. Screenshot of test page results
2. Screenshot of browser console errors (F12)
3. Which test step fails (1-5?)
4. Your internet speed test result (speedtest.net)
