# Neurosantulan - Testing Checklist

## 🎯 Pre-Testing Setup

### 1. Supabase Setup
- [ ] Created Supabase project at [supabase.com](https://supabase.com)
- [ ] Copied `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
- [ ] Copied `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Ran `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verified tables created: `users`, `services`, `appointments`
- [ ] Created admin user (see admin setup below)

### 2. Environment Variables
```bash
# .env.local should contain:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 👤 Admin User Setup

### Method 1: Via Supabase UI (Recommended)
1. Go to **Authentication** → **Users** in Supabase
2. Click **"Add User"**
3. Create user:
   - Email: `admin@neurosantulan.com`
   - Password: `Admin123!` (or your choice)
4. Go to **Table Editor** → **users** table
5. Find your user and edit:
   - Change `role` from `user` to `admin`
   - Set `username` to "Admin"

### Method 2: Via SQL
```sql
-- Run in Supabase SQL Editor
-- Step 1: Create auth user
SELECT auth.admin_create_user(
  'admin@neurosantulan.com',
  'Admin123!',
  'Admin',
  '{}'
);

-- Step 2: Update role to admin
UPDATE public.users 
SET role = 'admin'
WHERE email = 'admin@neurosantulan.com';
```

---

## ✅ Feature Testing Checklist

### 1. Landing Page (`/`)
- [ ] Page loads with colorful gradients
- [ ] Navigation works (Services, Approach, Contact links)
- [ ] "Book an appointment" button navigates to booking page
- [ ] "Explore services" scrolls to services section
- [ ] Service cards have colorful backgrounds (orange, purple, teal)
- [ ] Highlight cards show colors (1:1, Fast, Clear)
- [ ] Mobile menu opens/closes smoothly
- [ ] Scroll progress bar appears at top

### 2. User Registration (`/register`)
- [ ] Form displays with all fields
- [ ] Username field works
- [ ] Email validation works
- [ ] Phone with country code works
- [ ] Date of birth picker works
- [ ] Gender dropdown works
- [ ] Password show/hide toggle works
- [ ] Password confirmation validation works
- [ ] Submit creates user in Supabase Auth
- [ ] User redirected to `/login` after registration
- [ ] User appears in `users` table

### 3. User Login (`/login`)
- [ ] Email/password login works
- [ ] Error shows for invalid credentials
- [ ] "Forgot password" link works
- [ ] Redirects to `/profile` after successful login
- [ ] Session persists on page refresh

### 4. Profile Page (`/profile`)
- [ ] User info displays correctly
- [ ] Email shows
- [ ] Role badge shows
- [ ] Phone number shows (if added)
- [ ] "Book appointment" button works
- [ ] "Edit profile" button navigates to edit page
- [ ] Appointments list displays
- [ ] Appointment status pills show correct colors:
  - Pending: Amber/Orange
  - Confirmed: Blue
  - Completed: Green
  - Cancelled: Red
- [ ] Cancel appointment button works (for pending/confirmed)
- [ ] "Need help?" section shows

### 5. Edit Profile (`/profile/edit`)
- [ ] Form pre-fills with current user data
- [ ] Username can be updated
- [ ] Phone can be updated
- [ ] Country code dropdown works
- [ ] Date of birth can be changed
- [ ] Gender can be updated
- [ ] Password change section works:
  - [ ] Current password required
  - [ ] New password validation (min 6 chars)
  - [ ] Password confirmation match check
- [ ] "Save changes" button works
- [ ] Success message shows after update
- [ ] Changes persist after page refresh

### 6. Book Appointment (`/book-appointment`)
- [ ] Services load from database
- [ ] Service cards display with:
  - [ ] Service name
  - [ ] Description
  - [ ] Duration (minutes)
  - [ ] Colored icon backgrounds
- [ ] Date picker works (future dates only)
- [ ] Time slots available (9:00 AM - 5:00 PM, 30-min intervals)
- [ ] Time slot selection works
- [ ] Notes textarea works
- [ ] Submit creates appointment in database
- [ ] Success page shows after booking
- [ ] "View appointments" links to profile
- [ ] Appointment appears in profile with "Pending" status

### 7. Admin Dashboard (`/admin`)
- [ ] Accessible only by users with `role: admin`
- [ ] Non-admin users redirected to `/profile`
- [ ] Stats display correctly:
  - [ ] Total Users count
  - [ ] Total Appointments count
  - [ ] Pending count
  - [ ] Completed count
  - [ ] Stats have colorful gradients
- [ ] Tabs work (Appointments / Users)
- [ ] Search functionality works
- [ ] Status filter buttons work (All, Pending, Confirmed, etc.)
- [ ] Appointments list displays with:
  - [ ] Service name
  - [ ] Patient name and email
  - [ ] Date and time
  - [ ] Status badge
  - [ ] Action buttons
- [ ] Can confirm pending appointments
- [ ] Can cancel pending appointments
- [ ] Can mark confirmed as completed
- [ ] Bulk selection works (checkboxes)
- [ ] Bulk actions bar appears when items selected
- [ ] Bulk confirm/cancel/complete works
- [ ] Users tab shows all users
- [ ] User role badges display correctly

### 8. Contact Page (`/contact`)
- [ ] Contact form displays
- [ ] Name, email, phone fields work
- [ ] Subject dropdown works
- [ ] Message textarea works
- [ ] Submit shows success message
- [ ] Contact info displays:
  - [ ] Clinic location
  - [ ] Phone number
  - [ ] Email
  - [ ] Clinic hours

### 9. Forgot Password (`/forgot-password`)
- [ ] Email input works
- [ ] Submit sends reset email
- [ ] Success message shows
- [ ] "Back to login" link works

### 10. Reset Password (`/reset-password`)
- [ ] Accessible via email link
- [ ] New password input works
- [ ] Confirm password works
- [ ] Password show/hide toggles work
- [ ] Submit updates password
- [ ] Success page shows
- [ ] Can login with new password

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution:** Check `.env.local` has correct Supabase URL and anon key

### Issue: "Table does not exist"
**Solution:** Re-run `supabase-schema.sql` in Supabase SQL Editor

### Issue: "Cannot read properties of null"
**Solution:** Check if user is logged in, or if profile exists in `users` table

### Issue: "Permission denied"
**Solution:** Check RLS policies are enabled and correct

### Issue: User created but not in `users` table
**Solution:** Check trigger `on_auth_user_created` exists and is active

### Issue: Admin can't access dashboard
**Solution:** Verify `role` column is set to 'admin' in `users` table

---

## 🚀 Production Checklist

- [ ] Replace `.env.local` with environment variables in hosting platform
- [ ] Use `SUPABASE_SERVICE_ROLE_KEY` for server-side operations
- [ ] Enable email confirmation in Supabase
- [ ] Set up custom domain
- [ ] Add error logging (e.g., Sentry)
- [ ] Set up automated backups
- [ ] Configure CORS if needed
- [ ] Test on multiple devices and browsers

---

## 📊 Database Verification Queries

Run these in Supabase SQL Editor to verify data:

```sql
-- Check all users
SELECT * FROM public.users ORDER BY created_at DESC;

-- Check all services
SELECT * FROM public.services WHERE is_active = true;

-- Check all appointments
SELECT * FROM public.appointments ORDER BY appointment_date DESC;

-- Check appointments with user and service info
SELECT 
  a.id,
  a.appointment_date,
  a.appointment_time,
  a.status,
  u.username,
  u.email,
  s.name as service_name
FROM public.appointments a
JOIN public.users u ON a.user_id = u.id
JOIN public.services s ON a.service_id = s.id
ORDER BY a.appointment_date DESC;
```

---

## 🎨 Visual Testing

- [ ] Gradients appear on buttons
- [ ] Cards have subtle shadows
- [ ] Icons have matching colors
- [ ] Status pills have correct colors
- [ ] Hover animations work smoothly
- [ ] Mobile responsive design works
- [ ] No layout shifts or broken elements

---

**Testing Complete!** ✅

Once all items are checked, your Neurosantulan website is ready for production!
