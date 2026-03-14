# 🚀 Vercel Deployment Guide for Neurosantulan

## ⚠️ Critical: Set Environment Variables in Vercel

Before deploying to Vercel, you MUST add these environment variables:

### Step 1: Go to Vercel Dashboard
1. Go to your project at https://vercel.com/dashboard
2. Select your Neurosantulan project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ntbxsagygjtobuqnzikj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YnhzYWd5Z2p0b2J1cW56aWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODQ1NjcsImV4cCI6MjA4OTA2MDU2N30.Je6_7B8xnwelacoWONwxTUcaaM0tpVLOg09JOPEh0xQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YnhzYWd5Z2p0b2J1cW56aWtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ4NDU2NywiZXhwIjoyMDg5MDYwNTY3fQ.danAcg2C43wn6b_z8cWq50gdDOsg9UFptXHjDLF-GkE
```

**Important:** 
- Add for **Production**, **Preview**, and **Development** environments
- Click **Save** after adding each variable

### Step 3: Redeploy
After adding environment variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** (or push a new commit)

---

## 🔧 Alternative: Use vercel.json

Create a `vercel.json` file (NOT recommended for production as it exposes keys):

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://ntbxsagygjtobuqnzikj.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **WARNING:** Never commit `vercel.json` with real keys to a public repository!

---

## ✅ Pre-Deployment Checklist

### 1. Update Contact Information
Edit `src/app/page.tsx` (lines 540-640):
- [ ] WhatsApp number
- [ ] Email addresses
- [ ] Instagram handle
- [ ] Clinic address (optional)

### 2. Supabase Setup
- [ ] Run `supabase-schema-fixed.sql` in Supabase SQL Editor
- [ ] Create admin user: `admin@neurosantulan.com`
- [ ] Set admin role in users table
- [ ] Enable email auth in Supabase

### 3. Environment Variables
- [ ] Add to Vercel (Production, Preview, Development)
- [ ] Test locally with `.env.local`

### 4. Custom Domain (Optional)
- [ ] Add domain in Vercel
- [ ] Update DNS records
- [ ] Update Supabase auth URLs

---

## 🎯 Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to production
vercel --prod
```

---

## 🐛 Common Issues & Solutions

### Issue: "supabaseUrl is required"
**Solution:** Add environment variables in Vercel (see Step 2 above)

### Issue: Build fails with "Environment variables not loaded"
**Solution:** 
1. Check variables are added in Vercel dashboard
2. Redeploy after adding variables
3. Check variable names match exactly

### Issue: "RLS policy error"
**Solution:** Run `supabase-schema-fixed.sql` in Supabase Dashboard

### Issue: "Cannot read properties of null"
**Solution:** Check if user is logged in, or if Supabase connection is working

---

## 📊 Post-Deployment Testing

After deployment, test these URLs:

1. **Homepage:** `https://your-project.vercel.app/`
2. **Register:** `https://your-project.vercel.app/register`
3. **Login:** `https://your-project.vercel.app/login`
4. **Admin:** `https://your-project.vercel.app/admin`
5. **Test Connection:** `https://your-project.vercel.app/test-connection`

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to git (already in .gitignore ✅)
2. **Use Vercel Environment Variables** (not vercel.json)
3. **Rotate Supabase keys** if accidentally exposed
4. **Enable email confirmation** in Supabase
5. **Set up CORS** if needed for custom domain

---

## 🎨 Performance Tips

1. **Enable Vercel Analytics** (free)
2. **Use Vercel Image Optimization** for images
3. **Enable ISR** for static pages
4. **Use Vercel Edge Functions** for API routes
5. **Monitor Core Web Vitals** in Vercel dashboard

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs  
**Supabase Documentation:** https://supabase.com/docs  
**Next.js Documentation:** https://nextjs.org/docs

---

**Last Updated:** 2025-03-14  
**Status:** ✅ Production Ready
