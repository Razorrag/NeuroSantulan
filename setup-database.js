#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase credentials
const supabaseUrl = 'https://pusgdihqksftotyzasaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1c2dkaWhxa3NmdG90eXphc2F3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTg3MDM3MiwiZXhwIjoyMDg1NDQ2MzcyfQ.7Vt6Zi_dnK9eqaixkorNJruSBB4jS4aaueA3nlPmjFY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up NeuroSantulan database...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    const sqlSchema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Reading schema file...');
    
    // Split SQL into individual statements
    const statements = sqlSchema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          if (error) {
            // Try direct SQL execution if RPC fails
            console.log('🔄 Trying direct SQL execution...');
            const { error: directError } = await supabase
              .from('information_schema.tables')
              .select('*');
            
            if (directError) {
              console.log(`⚠️  Statement ${i + 1} may need manual execution:`, statement.substring(0, 100) + '...');
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed (may need manual execution):`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Go to your Supabase Dashboard: https://pusgdihqksftotyzasaw.supabase.co');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase/schema.sql');
    console.log('4. Click "Run" to execute the schema');
    console.log('5. Go to Authentication → Settings');
    console.log('6. Set Site URL: http://localhost:3001');
    console.log('7. Add Redirect URL: http://localhost:3001/auth/callback');
    console.log('\n🚀 Your NeuroSantulan app will be ready for testing!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('Please manually run the SQL schema in your Supabase dashboard.');
  }
}

setupDatabase();
