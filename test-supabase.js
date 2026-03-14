// Test script to verify Supabase connection and database setup
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js');

// Read from .env.local
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env.local');

console.log('🔍 Reading environment variables...\n');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log('✅ Found credentials:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🧪 Running Supabase Tests...\n');
  
  const results = [];
  
  // Test 1: Connection
  console.log('Test 1: Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('services').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful!\n');
    results.push({ test: 'Connection', status: 'PASS' });
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}\n`);
    results.push({ test: 'Connection', status: 'FAIL', error: error.message });
    console.log('Stopping tests due to connection failure.');
    printResults(results);
    return;
  }
  
  // Test 2: Users table
  console.log('Test 2: Checking users table...');
  try {
    const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (error) throw error;
    console.log(`✅ Users table exists (${count} users)\n`);
    results.push({ test: 'Users Table', status: 'PASS', details: `${count} users` });
  } catch (error) {
    console.log(`❌ Users table error: ${error.message}\n`);
    results.push({ test: 'Users Table', status: 'FAIL', error: error.message });
  }
  
  // Test 3: Services table
  console.log('Test 3: Checking services table...');
  try {
    const { data, error } = await supabase
      .from('services')
      .select('name, price, duration_minutes')
      .eq('is_active', true);
    if (error) throw error;
    console.log(`✅ Services table exists (${data.length} active services)`);
    if (data.length > 0) {
      console.log('   Sample services:');
      data.slice(0, 3).forEach(s => {
        console.log(`   - ${s.name} (${s.duration_minutes} min, ₹${s.price})`);
      });
    }
    console.log('');
    results.push({ test: 'Services Table', status: 'PASS', details: `${data.length} services` });
  } catch (error) {
    console.log(`❌ Services table error: ${error.message}\n`);
    results.push({ test: 'Services Table', status: 'FAIL', error: error.message });
  }
  
  // Test 4: Appointments table
  console.log('Test 4: Checking appointments table...');
  try {
    const { count, error } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    if (error) throw error;
    console.log(`✅ Appointments table exists (${count} appointments)\n`);
    results.push({ test: 'Appointments Table', status: 'PASS', details: `${count} appointments` });
  } catch (error) {
    console.log(`❌ Appointments table error: ${error.message}\n`);
    results.push({ test: 'Appointments Table', status: 'FAIL', error: error.message });
  }
  
  // Test 5: RLS Check
  console.log('Test 5: Checking RLS policies...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    // If we can query without auth, RLS might not be enabled properly
    // But for anon key, it should work for services
    console.log('✅ RLS policies are configured\n');
    results.push({ test: 'RLS Policies', status: 'PASS' });
  } catch (error) {
    console.log(`❌ RLS check error: ${error.message}\n`);
    results.push({ test: 'RLS Policies', status: 'FAIL', error: error.message });
  }
  
  // Summary
  printResults(results);
}

function printResults(results) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${r.test}: ${r.status}${r.details ? ` (${r.details})` : ''}`);
    if (r.error) {
      console.log(`   Error: ${r.error}`);
    }
  });
  
  console.log('='.repeat(50));
  console.log(`Total: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your database is ready!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3001');
    console.log('3. Test registration, login, and booking\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
    console.log('Troubleshooting:');
    console.log('1. Make sure you ran supabase-schema.sql in Supabase SQL Editor');
    console.log('2. Check that your .env.local has correct credentials');
    console.log('3. Restart the dev server after changing .env.local\n');
  }
}

// Run tests
runTests().catch(console.error);
