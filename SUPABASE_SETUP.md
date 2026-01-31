# Supabase Setup Guide for NeuroSantulan

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login with GitHub
4. Create a new project named "neurosantulan"
5. Choose a database password (save it securely)
6. Select a region closest to your users

### 2. Get Your Credentials
1. In your Supabase project, go to Settings → API
2. Copy the **Project URL** and **anon public key**
3. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set Up Database Schema
1. Go to the SQL Editor in your Supabase project
2. Copy and paste the contents of `supabase/schema.sql`
3. Click "Run" to execute the schema

### 4. Configure Authentication
1. Go to Authentication → Settings
2. Under "Site URL", add: `http://localhost:3000`
3. Under "Redirect URLs", add: `http://localhost:3000/auth/callback`
4. Enable email authentication (default is enabled)

### 5. Test Credentials for Development

#### Doctor Account:
- **Email:** `doctor@neurosantulan.com`
- **Password:** `doctor123`
- **Role:** Doctor

#### Patient Account:
- **Email:** `patient@example.com`
- **Password:** `patient123`
- **Role:** Patient

## 🔧 Advanced Configuration

### Row Level Security (RLS)
The schema includes RLS policies for:
- Users can only view/edit their own profiles
- Doctors can view patient profiles they have access to
- Patients can only see their own appointments and assessments

### Database Tables Created:
- `users` - Basic user information and roles
- `doctors` - Extended doctor profiles
- `patients` - Extended patient profiles
- `appointments` - Appointment scheduling
- `assessments` - Cognitive assessments
- `treatment_plans` - Patient treatment plans
- `messages` - Doctor-patient communication
- And more...

## 🚀 Deploy to Production

### 1. Update Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

### 2. Update Redirect URLs
In Supabase → Authentication → Settings:
- Site URL: `https://your-domain.com`
- Redirect URLs: `https://your-domain.com/auth/callback`

### 3. Enable Additional Providers (Optional)
- Google OAuth
- GitHub OAuth
- Phone authentication

## 🛠 Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Check if user exists in `users` table
   - Verify email is confirmed

2. **"Permission denied"**
   - Check RLS policies
   - Ensure user has correct role

3. **"Database connection failed"**
   - Verify Supabase URL and keys
   - Check network connectivity

### Reset Admin Access:
```sql
-- Reset password for test doctor
UPDATE auth.users 
SET encrypted_password = crypt('doctor123', gen_salt('bf'))
WHERE email = 'doctor@neurosantulan.com';
```

## 📚 Next Steps

1. Implement real-time features with Supabase Realtime
2. Add file storage for medical documents
3. Set up database functions for complex queries
4. Configure database backups
5. Set up monitoring and logging

## 🆘 Support

- Supabase Documentation: [docs.supabase.com](https://docs.supabase.com)
- NeuroSantulan GitHub: [github.com/Razorrag/NeuroSantulan](https://github.com/Razorrag/NeuroSantulan)
- Issues: Create an issue on GitHub for bugs or feature requests
