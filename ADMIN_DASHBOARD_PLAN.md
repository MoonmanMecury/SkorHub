# SkorHub Admin Dashboard Plan

## 🎯 Objective
Create a centralized Admin Dashboard for SkorHub to manage users, payments, feedback, and website content without touching code or external services.

## 🛠️ Tech Stack & Architecture
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Supabase)
- **Styling:** Tailwind CSS + Radix UI (for accessible components)
- **Auth:** JWT-based session with Role-Based Access Control (RBAC)
- **State Management:** Server Actions + React Server Components (RSC) for data fetching

---

## 🗄️ Database Schema Updates

### 1. Users Table Updates
Add administrative fields to the existing `users` table:
```sql
ALTER TABLE users 
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN notes TEXT; -- Internal notes about the user
```

### 2. Payments Table (New)
Store all transaction records locally for manual verification and history.
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZMW',
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'successful', 'failed'
  reference VARCHAR(100) UNIQUE NOT NULL, -- Lenco Transaction Reference
  provider VARCHAR(50) DEFAULT 'lenco',
  donation_tier VARCHAR(20), -- 'supporter', 'vip', 'one-time'
  is_recurring BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- Store full provider response
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### 3. Feedback / Inquiries Table (New)
Centralize user communication.
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) CHECK (type IN ('bug', 'feature', 'support', 'other')),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'ignored')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Site Content Config Table (New)
Store dynamic text for the website to allow editing without deployment.
```sql
CREATE TABLE site_content (
  key VARCHAR(50) PRIMARY KEY, -- e.g., 'home_hero_title', 'support_goal_text'
  content TEXT NOT NULL,
  description VARCHAR(255), -- Helper text for admin to know where this appears
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);
```

### 5. Admin Audit Log (New)
Track critical actions for accountability.
```sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL, -- 'manual_upgrade', 'ban_user', 'edit_content'
  target_id UUID, -- ID of the user or record affected
  details JSONB, -- Previous values or specific notes
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🖥️ Application Structure (Next.js App Router)

### Route Structure
```
app/
  (admin)/
    layout.tsx        # Admin-specific layout (Sidebar, Auth Check)
    admin/
      page.tsx        # Dashboard Overview (KPIs)
      users/
        page.tsx      # User List & Search
        [id]/page.tsx # User Detail & Actions
      payments/
        page.tsx      # Transaction history
      feedback/
        page.tsx      # Inbox
      content/
        page.tsx      # Editor interface
      settings/
        page.tsx      # Admin settings
```

---

## ✨ key Features & Implementation Details

### 1. User Management
- **Interface:** Data table with server-side pagination and search.
- **Filters:** Tier (VIP/Supporter), Status (Active/Banned).
- **Actions:**
  - `Manual Override`: Button to open a modal. inputs: Tier, Duration. Calls `adminManualActivate(userId, tier, notes)`.
  - `Ban/Unban`: Toggles `is_active` status.

### 2. Payments & Manual Activation
- **Manual Entry Form:**
  - Identify User (Search by email).
  - Select Tier (Supporter/VIP).
  - Enter Reference (if external check/cash).
  - Submit -> Updates `users` table + inserts into `payments` + logs to `admin_audit_logs`.

### 3. Feedback System
- **Inbox View:** List of unread feedback.
- **Detail View:** Read full message, see user info (Tier/Join Date).
- **Reply Action:** Opens email client (`mailto:`) or internal messaging if built.

### 4. Content Editor (CMS Lite)
- **View:** List of all editable keys.
- **Edit:** Click to edit text inline or in a modal.
- **Usage:** In the main app, fetch content via a helper: `getContent('home_hero_title', 'Default Title')`.

### 5. System Health & Analytics
- **KPI Cards:**
  - Total Revenue (Sum of `payments` where status='completed').
  - Active Subscribers (Count `users` where `supporter_expires_at` > NOW).
- **Health Check:** Simple ping to Lenco API and Database to ensure connectivity.

---

## 🛡️ Security & Access Control
- **Middleware:** Create `/middleware.ts` to intercept `/admin` routes.
  - Verify JWT presence.
  - specific check: `user.is_admin === true`.
  - Redirect unauthorized users to `/sign-in`.
- **Server Actions:** All admin server actions must re-validate `is_admin` before executing database mutations.

---

## 📅 Phased Execution Plan

### Phase 1: Foundation
1. Create `admin` layout and sidebar.
2. Implement schema changes (`users`, `admin_audit_logs`).
3. Set up `middleware` for admin route protection.

### Phase 2: Core Administration
1. Build **User Management** (List, Search, Detail).
2. Build **Manual Activation** server actions.
3. Log actions to audit table.

### Phase 3: Financials & Content
1. Create `payments` table and view.
2. Implement **Content Editor** and replace hardcoded strings in the main app.

### Phase 4: Polish
1. Add **Dashboard Overview** charts.
2. Refine UI with loading states and error handling.
