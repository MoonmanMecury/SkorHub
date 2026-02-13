# SkorHub Supporter Program - Implementation Guide

## 🎯 Overview

This guide will help you implement the realistic, achievable supporter program for SkorHub. The program has three tiers:

1. **Supporter** - K15/month
2. **VIP Supporter** - K30/month  
3. **One-Time Donation** - K10-100 (gives 7-day trial)

---

## 📋 Pre-Launch Checklist

### Step 1: Database Setup

**Run the SQL migration:**

```bash
# Connect to your Supabase database and run:
psql $DATABASE_URL -f scripts/setup-supporter-schema.sql
```

**Or manually in Supabase SQL Editor:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/setup-supporter-schema.sql`
3. Run the script
4. Verify tables were created

**Verify the schema:**

```sql
-- Check users table has new columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('supporter_tier', 'supporter_since', 'total_donated', 'supporter_expires_at');

-- Check watch_history table exists
SELECT * FROM watch_history LIMIT 1;

-- Check supporter_acknowledgments table exists
SELECT * FROM supporter_acknowledgments LIMIT 1;
```

---

### Step 2: Environment Variables

Ensure your `.env.local` has:

```env
# Already configured
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
LENCO_API_KEY=your_lenco_api_key
LENCO_API_BASE_URL=https://api.lenco.co/access/v2
NEXT_PUBLIC_LENCO_PUBLIC_KEY=your_lenco_public_key
LENCO_WEBHOOK_HASH_KEY=your_webhook_hash
```

---

### Step 3: Test the Payment Flow

**Manual Testing Steps:**

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Create a test account:**
   - Go to http://localhost:3000/sign-up
   - Create account with test email

3. **Test Supporter Donation (K15):**
   - Go to http://localhost:3000/support
   - Click "Become a Supporter"
   - Complete payment with Lenco test card
   - Verify redirect to /account?status=supporter&tier=supporter

4. **Verify in database:**
   ```sql
   SELECT 
     email, 
     supporter_tier, 
     supporter_since, 
     total_donated,
     supporter_expires_at
   FROM users 
   WHERE email = 'your-test-email@example.com';
   ```

5. **Test VIP Donation (K30):**
   - Repeat with VIP tier
   - Verify VIP features are accessible

6. **Test One-Time Donation:**
   - Test with K20
   - Verify 7-day trial is granted

---

### Step 4: Verify Features Work

**Supporter Features (K15/month):**

✅ **Website ads hidden:**
- Navigate to homepage
- Verify AdPlaceholder components don't render
- Check browser console: no ad-related elements

✅ **Supporter badge displays:**
- Go to /account
- Verify badge shows next to username
- Check supporters page lists you

✅ **Thank you page listing:**
- Go to /supporters
- Verify your name appears
- Test hiding from list in account settings

**VIP Features (K30/month):**

✅ **Watch history tracking:**
- Watch a match
- Check watch history in account
- Verify match appears in history

✅ **Favorites work:**
- Add teams to favorites
- Verify they appear in favorites page
- Test removing favorites

✅ **HD stream priority:**
- View match with multiple streams
- Verify HD streams appear first

---

## 🚀 Launch Strategy

### Week 1: Soft Launch (Internal Testing)

**Day 1-2: Self-Testing**
- [ ] Donate yourself (K15 Supporter tier)
- [ ] Test all supporter features
- [ ] Verify database updates correctly
- [ ] Check email confirmations (if implemented)

**Day 3-5: Friends & Family**
- [ ] Invite 3-5 close friends to test
- [ ] Ask them to try each tier
- [ ] Collect feedback on UX
- [ ] Fix any bugs discovered

**Day 6-7: Refinement**
- [ ] Address feedback
- [ ] Polish messaging
- [ ] Test edge cases
- [ ] Prepare launch announcement

### Week 2: Public Launch

**Day 1: Announce**
- [ ] Add banner to homepage
- [ ] Post on social media (if any)
- [ ] Email existing users (if you have list)
- [ ] Update navbar to include "Support" link

**Day 2-7: Monitor & Optimize**
- [ ] Track conversion rates
- [ ] Monitor for errors
- [ ] Respond to supporter questions
- [ ] Thank new supporters publicly

---

## 🔗 Adding Support Link to Navigation

**Update Navbar component:**

```typescript
// components/layout/Navbar.tsx
<nav className="...">
  <Link href="/">Home</Link>
  <Link href="/sports">Sports</Link>
  <Link href="/support" className="text-primary">
    ❤️ Support
  </Link>
  <Link href="/account">Account</Link>
</nav>
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

**Daily:**
- New supporters count
- Total revenue
- Conversion rate (visitors → supporters)
- Churn rate

**Weekly:**
- Progress toward K1,000 goal
- Supporter tier distribution
- Most common donation amount
- Feature usage (VIP features)

### Database Queries for Monitoring

```sql
-- Daily supporter signups
SELECT 
  DATE(supporter_since) as date,
  COUNT(*) as new_supporters,
  SUM(total_donated) as revenue
FROM users
WHERE supporter_tier IS NOT NULL
GROUP BY DATE(supporter_since)
ORDER BY date DESC
LIMIT 7;

-- Current active supporters by tier
SELECT 
  supporter_tier,
  COUNT(*) as count,
  SUM(total_donated) as total_revenue
FROM users
WHERE supporter_tier IS NOT NULL
AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW())
GROUP BY supporter_tier;

-- Monthly recurring revenue (MRR)
SELECT 
  COUNT(CASE WHEN supporter_tier = 'supporter' THEN 1 END) * 15 +
  COUNT(CASE WHEN supporter_tier = 'vip' THEN 1 END) * 30 as mrr
FROM users
WHERE supporter_tier IN ('supporter', 'vip')
AND (supporter_expires_at IS NULL OR supporter_expires_at > NOW());
```

---

## 🎨 Customization Options

### Adjust Pricing

Edit `app/api/support/donate/route.ts`:

```typescript
const TIER_PRICES = {
  'one-time': { min: 10, max: 1000 },
  'supporter': 15,  // Change this
  'vip': 30,        // Change this
};
```

### Change Monthly Goal

Edit `app/actions/support.ts`:

```typescript
return {
  // ...
  monthlyGoal: 1000, // Change this
  // ...
};
```

### Modify Supporter Perks

Edit `components/support/SupportPageClient.tsx` to update the feature lists.

---

## 🐛 Troubleshooting

### Payment not verifying

**Check:**
1. Lenco API credentials are correct
2. Reference matches in database
3. Webhook is configured (if using webhooks)
4. Check browser console for errors

**Debug:**
```sql
SELECT * FROM payments 
WHERE reference LIKE 'SK-%' 
ORDER BY initiated_at DESC 
LIMIT 10;
```

### Ads still showing for supporters

**Check:**
1. User has supporter_tier set in database
2. AdPlaceholder component is using useAuth hook
3. Browser cache cleared
4. User is logged in

**Debug:**
```typescript
// Add to AdPlaceholder component
console.log('User:', user);
console.log('Supporter Tier:', user?.supporter_tier);
```

### VIP features not accessible

**Check:**
1. User has supporter_tier = 'vip'
2. supporter_expires_at is in future or NULL
3. isVIPSupporter() function works

**Test:**
```sql
SELECT is_vip_supporter('user-uuid-here');
```

---

## 📧 Email Templates (Optional Future Enhancement)

### Thank You Email (Supporter)

```
Subject: Welcome to SkorHub Supporters! 🌟

Hi [Name],

Thank you for becoming a SkorHub Supporter!

Your support means the world to us. Here's what you now have access to:

✅ Ad-free website browsing
✅ Supporter badge on your profile
✅ Listed on our supporters page
✅ Priority email support

Your support helps us:
- Keep servers running
- Build new features
- Work toward licensed streams

Questions? Just reply to this email.

Thank you for believing in us!

The SkorHub Team
```

### Thank You Email (VIP)

```
Subject: Welcome to VIP! ⭐

Hi [Name],

You're now a VIP Supporter! 

In addition to all Supporter perks, you now have:

⭐ HD stream priority
⭐ Watch history tracking
⭐ Favorite teams feature
⭐ VIP WhatsApp group access

Join our VIP WhatsApp group: [link]

Thank you for your incredible support!

The SkorHub Team
```

---

## 🎯 Success Metrics

### Month 1 Goals
- [ ] 5-10 supporters
- [ ] K75-300 revenue
- [ ] 0 payment errors
- [ ] 100% supporter satisfaction

### Month 3 Goals
- [ ] 25-40 supporters
- [ ] K375-1,200 revenue
- [ ] Break even on costs
- [ ] 5% conversion rate

### Month 6 Goals
- [ ] 75-125 supporters
- [ ] K1,125-3,750 revenue
- [ ] Profitable
- [ ] Plan mobile app development

---

## 📝 Next Steps After Launch

1. **Week 1:** Monitor closely, fix bugs
2. **Week 2:** Gather feedback, iterate
3. **Week 3:** A/B test messaging
4. **Week 4:** Plan next features

**Future Enhancements (Month 2+):**
- Email notifications
- Supporter dashboard
- Referral program
- Annual plans
- Gift subscriptions
- Supporter-only Discord

---

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Review error logs in terminal
3. Check database for data consistency
4. Test with fresh account
5. Verify Lenco API is working

**Common Issues:**
- Payment gateway timeout → Retry
- Database connection error → Check DATABASE_URL
- JWT error → Regenerate JWT_SECRET
- Lenco verification fails → Check API key

---

## ✅ Final Pre-Launch Checklist

- [ ] Database schema created
- [ ] All files created and saved
- [ ] Environment variables configured
- [ ] Test payment completed successfully
- [ ] Supporter features verified
- [ ] VIP features verified
- [ ] Support page looks good
- [ ] Supporters page works
- [ ] Navigation updated
- [ ] Mobile responsive checked
- [ ] Error handling tested
- [ ] Ready to launch! 🚀

---

**Good luck with your launch! Remember: Start small, be honest, deliver on promises.** 💪
