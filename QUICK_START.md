# 🚀 Quick Start Guide - Neurosantulan

## Step-by-Step Setup (5 minutes)

### 1️⃣ Create Supabase Account
1. Go to https://supabase.com
2. Sign up with GitHub/Google/Email
3. Click **"New Project"**

### 2️⃣ Create Project
```
Project name: neurosantulan
Database password: [Create a strong one - SAVE IT!]
Region: Choose closest to you
```
Wait 2 minutes for setup.

### 3️⃣ Get Credentials
1. Go to **Settings** (⚙️) → **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4️⃣ Update .env.local
Open `.env.local` and replace:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 5️⃣ Set Up Database
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase-schema.sql` file from this project
4. Copy ALL content
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`

You should see: ✅ Success. No rows returned

### 6️⃣ Create Admin User
**Option A - Via UI (Easier):**
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Email: `admin@neurosantulan.com`
4. Password: `Admin123!`
5. Click **"Create user"**
6. Go to **Table Editor** → **users** table
7. Find your user (admin@neurosantulan.com)
8. Click edit (pencil icon)
9. Change `role` from `user` to `admin`
10. Set `username` to "Admin"
11. Click **"Save"**

**Option B - Via SQL:**
```sql
-- Run in SQL Editor
UPDATE public.users 
SET role = 'admin', username = 'Admin'
WHERE email = 'admin@neurosantulan.com';
```

### 7️⃣ Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 8️⃣ Test It!
1. Open http://localhost:3001
2. Click **"Get Started"** or **"Login"**
3. Login with:
   - Email: `admin@neurosantulan.com`
   - Password: `Admin123!`
4. You should be redirected to `/profile`
5. Click **"Back to profile"** → Should see admin dashboard link
6. Navigate to `/admin` to see the dashboard

---

## 🎯 Quick Test Flow

### Test User Registration
1. Go to `/register`
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Phone: `1234567890`
   - Country: `+1`
3. Click **"Create account"**
4. Should redirect to `/login`

### Test Login
1. Login with `test@example.com` / `Test123!`
2. Should go to `/profile`
3. See your username and email

### Test Booking
1. From profile, click **"Book appointment"**
2. Select a service (e.g., "Initial Consultation")
3. Pick a future date
4. Pick a time slot
5. Add optional notes
6. Click **"Confirm booking"**
7. Should see success page
8. Click **"View appointments"**
9. See your appointment with "Pending" status

### Test Admin Features
1. Logout
2. Login as admin (`admin@neurosantulan.com`)
3. Go to `/admin`
4. See the appointment you just created
5. Click **"Confirm"** to confirm it
6. Status should change to "Confirmed"

---

## 🔧 Troubleshooting

### "Invalid API key"
→ Check `.env.local` has correct values from Supabase

### "Table does not exist"
→ Re-run the SQL schema in Supabase

### Can't login as admin
→ Check `role` column in `users` table is set to `admin`

### No services showing
→ Run this in SQL Editor:
```sql
SELECT * FROM public.services;
```

### User created but not in users table
→ Check if trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## 📱 Test on Mobile

1. Find your local IP:
   - Windows: `ipconfig` in terminal
   - Usually `192.168.x.x`

2. Access on phone:
   - `http://192.168.x.x:3001`

3. Test:
   - Mobile menu opens
   - All buttons are tappable
   - Forms are usable
   - Colors look good

---

## ✅ You're Done!

Your Neurosantulan clinic management system is ready!

**Next Steps:**
- [ ] Test all features using the checklist
- [ ] Customize clinic info in contact page
- [ ] Add real service prices
- [ ] Deploy to production (Vercel/Netlify)
- [ ] Set up custom domain
- [ ] Enable email notifications

---

**Need Help?**
Check `TESTING_CHECKLIST.md` for detailed testing guide.
