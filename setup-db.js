const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read credentials
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

// Use service role key for admin operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1].trim();

const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

async function setupDatabase() {
  console.log('🔧 Setting up database tables...\n');
  
  // Read and run schema
  const schema = fs.readFileSync('supabase-schema.sql', 'utf8');
  
  // Split by semicolons and run each statement
  const statements = schema.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
  
  console.log(`Found ${statements.length} SQL statements to execute\n`);
  
  // We need to use the Supabase REST API or SQL endpoint
  // For now, let's create tables one by one
  
  // Create users table
  console.log('Creating users table...');
  const { error: usersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        phone TEXT,
        country_code TEXT DEFAULT '+91',
        date_of_birth DATE,
        gender TEXT CHECK (gender IN ('male', 'female', 'other')),
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    `
  });
  
  if (usersError) {
    console.log('Note: Direct SQL execution not available via REST API');
    console.log('You need to run the schema in Supabase Dashboard SQL Editor\n');
  } else {
    console.log('✅ Users table created\n');
  }
  
  console.log('Instructions:');
  console.log('1. Go to: https://supabase.com/dashboard/project/ntbxsagygjtobuqnzikj/sql/new');
  console.log('2. Copy the content of supabase-schema.sql');
  console.log('3. Paste and click "Run"');
  console.log('4. Then run this test again\n');
}

setupDatabase();
