const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read credentials
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const serviceKeyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const serviceRoleKey = serviceKeyMatch?.[1].trim() || supabaseKey;

console.log('🔍 Quick Database Status Check\n');

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function quickCheck() {
  // Check tables
  console.log('Checking tables...\n');
  
  const tables = ['users', 'services', 'appointments'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count || 0} records`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
  
  console.log('\n\n📋 IMPORTANT: Run the Fixed SQL Schema');
  console.log('='.repeat(50));
  console.log('1. Go to: https://supabase.com/dashboard/project/ntbxsagygjtobuqnzikj/sql/new');
  console.log('2. Copy content from: supabase-schema-fixed.sql');
  console.log('3. Paste and click "Run"');
  console.log('4. This will fix the RLS recursion issue\n');
  
  // Check if admin exists
  console.log('Checking for admin user...');
  const { data: admin } = await supabase
    .from('users')
    .select('email, role')
    .eq('email', 'admin@neurosantulan.com')
    .single();
  
  if (admin) {
    console.log(`✅ Admin user exists: ${admin.email} (role: ${admin.role})\n`);
  } else {
    console.log('❌ Admin user not found\n');
    console.log('Create admin user:');
    console.log('1. Go to Authentication → Users');
    console.log('2. Add user: admin@neurosantulan.com / Admin@2026');
    console.log('3. Go to Table Editor → users');
    console.log('4. Find the user and change role to "admin"\n');
  }
}

quickCheck();
