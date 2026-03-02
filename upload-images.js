/**
 * Image Upload Script for Supabase Storage
 * 
 * Prerequisites:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Set your admin credentials below
 * 3. Run: node upload-images.js
 */

const fs = require('fs');
const path = require('path');

// Configuration - UPDATE THESE VALUES
const SUPABASE_URL = 'https://uzwinhyzipndpjxmprns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6d2luaHl6aXBuZHBqeG1wcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxODc0MDUsImV4cCI6MjA4Nzc2MzQwNX0.-nDE5lYtJa5qUL06BT-Hh_EJ9d-Xns3nCyRRNfMb7G4';
const ADMIN_EMAIL = 'denitsa.rylands@dxc.com'; // Your admin email
const ADMIN_PASSWORD = ''; // Set your admin password here

// Image directories to upload
const IMAGE_DIRS = ['images', 'icons'];

// Content type mapping
const CONTENT_TYPES = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

async function main() {
    if (!ADMIN_PASSWORD) {
        console.error('❌ Please set ADMIN_PASSWORD in this script before running.');
        process.exit(1);
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Sign in as admin
    console.log('🔐 Signing in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
    });

    if (authError) {
        console.error('❌ Authentication failed:', authError.message);
        process.exit(1);
    }

    console.log('✓ Signed in as:', authData.user.email);

    // Collect all images
    const imagesToUpload = [];

    for (const dir of IMAGE_DIRS) {
        const dirPath = path.join(__dirname, dir);
        if (!fs.existsSync(dirPath)) {
            console.log(`⚠️ Directory not found: ${dir}`);
            continue;
        }

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (CONTENT_TYPES[ext]) {
                imagesToUpload.push({
                    localPath: path.join(dirPath, file),
                    storagePath: `${dir}/${file}`,
                    contentType: CONTENT_TYPES[ext]
                });
            }
        }
    }

    console.log(`\n📁 Found ${imagesToUpload.length} images to upload\n`);

    // Upload each image
    let successCount = 0;
    let failCount = 0;

    for (const img of imagesToUpload) {
        try {
            const fileBuffer = fs.readFileSync(img.localPath);

            const { data, error } = await supabase.storage
                .from('images')
                .upload(img.storagePath, fileBuffer, {
                    contentType: img.contentType,
                    upsert: true
                });

            if (error) {
                console.log(`❌ Failed: ${img.storagePath} - ${error.message}`);
                failCount++;
            } else {
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(img.storagePath);
                console.log(`✓ Uploaded: ${img.storagePath}`);
                console.log(`  URL: ${publicUrl}`);
                successCount++;
            }
        } catch (err) {
            console.log(`❌ Error: ${img.storagePath} - ${err.message}`);
            failCount++;
        }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`   ✓ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`\n🌐 Base URL: ${SUPABASE_URL}/storage/v1/object/public/images/`);

    // Sign out
    await supabase.auth.signOut();
}

main().catch(console.error);
