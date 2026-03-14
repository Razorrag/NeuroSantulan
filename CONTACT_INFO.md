# Contact Information - Update Guide

## 📞 Current Contact Details

The following contact information is currently displayed on the website:

### WhatsApp
- **Number**: +91 98765 43210
- **Link**: `https://wa.me/919876543210`
- **Location**: Founder section + Footer

### Email
- **General**: info@neurosantulan.com
- **Dr. Sachin Goyal**: drsachingoyal@neurosantulan.com
- **Location**: Footer + Founder section

### Instagram
- **Handle**: @neurosantulan
- **Link**: `https://instagram.com/neurosantulan`
- **Location**: Founder section + Footer

---

## 🔧 How to Update Contact Information

### Option 1: Update in Landing Page
Edit `src/app/page.tsx`:

**WhatsApp Number** (2 locations):
```tsx
// Line ~547 - Founder section
href="https://wa.me/919876543210"

// Line ~616 - Footer
href="https://wa.me/919876543210"
```

**Email Addresses**:
```tsx
// Line ~553 - Founder email
href="mailto:drsachingoyal@neurosantulan.com"

// Line ~625 - General email
href="mailto:info@neurosantulan.com"
```

**Instagram**:
```tsx
// Line ~559 - Founder section
href="https://instagram.com/neurosantulan"

// Line ~634 - Footer
href="https://instagram.com/neurosantulan"
```

### Option 2: Create a Config File (Recommended)

Create `src/lib/contact-info.ts`:

```typescript
export const contactInfo = {
  whatsapp: {
    number: '+91 98765 43210',
    link: 'https://wa.me/919876543210',
  },
  email: {
    general: 'info@neurosantulan.com',
    founder: 'drsachingoyal@neurosantulan.com',
  },
  instagram: {
    handle: '@neurosantulan',
    link: 'https://instagram.com/neurosantulan',
  },
  phone: '+91 98765 43210',
};
```

Then import in `page.tsx`:
```tsx
import { contactInfo } from '@/lib/contact-info';
```

---

## 📍 Additional Contact Options to Consider

### Clinic Address
Add to footer:
```tsx
<div className="flex items-start gap-3">
  <MapPin className="h-4 w-4 text-slate-600" />
  <span>123 Wellness Street, Health District<br />Mumbai, Maharashtra 400001</span>
</div>
```

### Clinic Hours
Add to footer:
```tsx
<div>
  <h4 className="font-semibold text-slate-950">Clinic Hours</h4>
  <p className="text-sm text-slate-700">Mon-Sat: 9:00 AM - 7:00 PM</p>
  <p className="text-sm text-slate-700">Sun: By appointment</p>
</div>
```

### Other Social Media
- **Facebook**: `https://facebook.com/neurosantulan`
- **Twitter/X**: `https://twitter.com/neurosantulan`
- **LinkedIn**: `https://linkedin.com/in/drsachingoyal`
- **YouTube**: `https://youtube.com/@neurosantulan`

---

## 🎨 Color Scheme for Contact Buttons

Current colors match brand identity:
- **WhatsApp**: Emerald green (`bg-emerald-500`)
- **Email**: Sky blue (`bg-sky-500`)
- **Instagram**: Purple-pink gradient (`from-purple-500 to-pink-500`)

---

## ✅ Testing After Updates

After updating contact information:
1. Run `npm run build` to check for errors
2. Test all links work correctly
3. Verify mobile responsiveness
4. Check that WhatsApp opens in app
5. Test email client opens

---

## 📱 WhatsApp Business Features

Consider upgrading to WhatsApp Business for:
- Automated greeting messages
- Quick replies for FAQs
- Business profile with address
- Catalog of services
- Labels for organizing chats

Setup: `https://wa.me/919876543210?text=I%20want%20to%20book%20an%20appointment`

This creates a pre-filled message when users click the link.

---

**Last Updated**: 2025-03-14
**Founded by**: Dr. Sachin Goyal
