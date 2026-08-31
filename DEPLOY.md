# WITRA — Cloudflare Deployment Guide

## Prerequisites

1. **Node.js** 18+ installed
2. **Cloudflare account** — free plan works fine
3. **Wrangler CLI** — installed via `npm install -g wrangler` or use `npx wrangler`
4. **Your domain on Hostinger** (e.g., `yourdomain.com`)

---

## Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

This opens a browser window — sign in and authorize Wrangler.

---

## Step 2: Create the D1 Database

```bash
npx wrangler d1 create witra-marketing-production
```

**Copy the `database_id`** from the output. You'll need it next.

---

## Step 3: Update wrangler.jsonc

Open `wrangler.jsonc` and replace the existing `database_id` with the one from Step 2:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "witra-marketing-production",
      "database_id": "YOUR-DATABASE-ID-HERE"  // ← paste here
    }
  ]
}
```

---

## Step 4: Run Database Migrations

```bash
# Apply all migrations to the production database
npx wrangler d1 migrations apply witra-marketing-production --remote
```

This creates all tables and seeds the initial data (plans, services, entitlements, and the default Super Admin account).

---

## Step 5: Build & Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

After deployment, Cloudflare will give you a URL like:
`https://witra-marketing.pages.dev`

---

## Step 6: Connect Your Hostinger Domain

### Option A: Change Nameservers (Recommended)

1. **In Cloudflare Dashboard:**
   - Go to **Websites → Add a site**
   - Enter your domain name (e.g., `yourdomain.com`)
   - Select the **Free plan**
   - Cloudflare will show you two nameservers (e.g., `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`)

2. **In Hostinger Panel:**
   - Go to **Domains → yourdomain.com → DNS / Nameservers**
   - Change nameservers to the Cloudflare ones
   - Save changes

3. **Wait for propagation** (usually 15 minutes to 24 hours)

4. **In Cloudflare Dashboard:**
   - Go to **Pages → witra-marketing → Custom domains**
   - Add `yourdomain.com` and `www.yourdomain.com`
   - Cloudflare will automatically set up SSL and routing

### Option B: CNAME Record Only

If you want to keep Hostinger nameservers:

1. **In Cloudflare Pages Dashboard:**
   - Go to your Pages project → **Custom domains** → **Set up a custom domain**
   - Enter `yourdomain.com`
   - Cloudflare will tell you to add a CNAME record

2. **In Hostinger DNS Settings:**
   - Add a CNAME record:
     - **Name:** `@` (or leave blank for root)
     - **Target:** `witra-marketing.pages.dev`
   - Add another CNAME record:
     - **Name:** `www`
     - **Target:** `witra-marketing.pages.dev`

---

## Step 7: Verify Everything Works

1. Visit your domain — you should see the WITRA login page
2. Log in with:
   - **Email:** `admin@witra.agency`
   - **Password:** `WitraAdmin@2026`
3. **Change the default password immediately** in Settings → Password & Security

---

## Troubleshooting

### "Database not found"
Make sure you've:
1. Created the database with `wrangler d1 create`
2. Updated the `database_id` in `wrangler.jsonc`
3. Run migrations with `--remote` flag

### "401 Unauthorized"
The session expired or cookies aren't being set. Make sure:
1. You're accessing via HTTPS (Cloudflare provides this automatically)
2. Your domain's SSL/TLS is set to "Full (strict)" in Cloudflare

### Domain not resolving
DNS propagation can take up to 24 hours. Check progress at [whatsmydns.net](https://www.whatsmydns.net/)

---

## Updating the Platform

To deploy updates:

```bash
npm run build
npm run deploy
```

If you've made database schema changes:

```bash
# Add new migration file to migrations/ folder
npx wrangler d1 migrations apply witra-marketing-production --remote
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Set up a strong portal password for each client
- [ ] Enable "Full (strict)" SSL in Cloudflare
- [ ] Review notification settings
- [ ] Set appropriate session timeout in Settings → Security

---

## Support

For technical support, contact the development team.
