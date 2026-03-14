const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const serviceRoleKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixRLS() {
  console.log('🔧 Fixing RLS Policies...\n');
  
  // First, disable RLS temporarily to check tables
  console.log('Checking current RLS status...');
  
  // Drop all problematic policies
  const dropPolicies = `
    DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
    DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Admins can update all appointments" ON public.appointments;
  `;

  // Create simple, non-recursive policies
  const createPolicies = `
    -- Simple policies without subqueries
    CREATE POLICY "Users can view own profile" ON public.users
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "Users can update own profile" ON public.users
      FOR UPDATE USING (auth.uid() = id);
    
    CREATE POLICY "Users can view own appointments" ON public.appointments
      FOR SELECT USING (user_id = auth.uid());
    
    CREATE POLICY "Users can create appointments" ON public.appointments
      FOR INSERT WITH CHECK (user_id = auth.uid());
    
    CREATE POLICY "Users can update own appointments" ON public.appointments
      FOR UPDATE USING (user_id = auth.uid());
    
    -- Allow authenticated users to view services
    CREATE POLICY "Anyone can view active services" ON public.services
      FOR SELECT USING (is_active = true);
  `;

  console.log('\n⚠️  Manual Fix Required');
  console.log('='.repeat(50));
  console.log('\nThe SQL policies need to be run in Supabase Dashboard.\n');
  console.log('Copy this SQL and run it:');
  console.log('\n' + dropPolicies + createPolicies);
  console.log('\n' + '='.repeat(50));
  console.log('\nThen test again!\n');
}

fixRLS();
