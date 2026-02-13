# 💰 Logging & Webhooks Guide

## 1. Audit Trail: How we track everything
Every donation is recorded as a permanent line item in your database. This ensures you never lose track of who paid and when.

| Table | What it records | Why it matters |
|-------|----------------|----------------|
| `payments` | Reference, Amount, Tier, Status, UI Metadata | **The Ledger**: This is your proof of payment. Every transaction has a unique row. |
| `users` | Current Tier, Total Donated, Expiration Date | **The Identity**: Controls what the user sees on their dashboard *right now*. |
| `public_supporters_view` | Name, Tier, Cumulative Donation | **The Community**: Auto-calculates your leaderboards/thank-you page. |

---

## 2. Setting up Webhooks on Localhost
Webhooks are essential because they work even if a user closes their tab during payment.

### Step A: Use `ngrok` to expose Localhost
External services (like Lenco) cannot see `localhost`. You need a tunnel:

1. Download **ngrok** from [ngrok.com](https://ngrok.com/).
2. Run this in your terminal:
   ```bash
   ngrok http 3000
   ```
3. Copy the **Forwarding URL** (e.g., `https://a1b2-c3d4.ngrok-free.app`).

### Step B: Configure Lenco Dashboard
1. Go to your **Lenco Settings** -> **Webhook URL**.
2. Paste your ngrok URL + the path we just created:
   `https://[YOUR-NGROK-ID].ngrok-free.app/api/webhooks/lenco`
3. Save.

### Step C: Test it
Now, when you complete a payment in your dev environment, you will see the logs in your terminal showing `[Webhook] Successfully processed payment...`.

---

## 3. Why this is superior
- **Redundancy**: If the user's browser crashes, the Webhook still updates their account.
- **Security**: The Webhook double-checks the payment with Lenco's servers before promoting the user.
- **History**: You can see every failed and successful attempt in the `payments` table.
