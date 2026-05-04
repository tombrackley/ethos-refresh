# Whitelabel for a new customer

Runbook for adding a tenant variant (Blackmores, Playfair, Cooper IP, Gallagher Bassett, etc.). All tenant config lives in `src/config/tenant.js` — no backend, no router.

A single default build can serve every tenant at `/<tenant-id>/…` (pathname-based resolver). You only need a dedicated per-tenant build when a customer wants their own branded deploy without the path prefix. See **Deploying** below.

## Two patterns — pick one

**Thin override** (e.g. Blackmores). The customer is a rebrand of the default app — same pages, same data shapes, just different branding and a few domain-specific fields. Spread `configs.default` and override only what differs.

**Deep fork** (e.g. Playfair Migration). The customer needs its own pages, KPIs, terminology, comply items, or domain terminology. Build a full `configs.<id>` object from scratch.

Start thin. Escalate to deep when the override list grows past ~10 keys or you need custom `pages.*` data.

## Thin override

1. **Drop assets in `/public/`:**
   - `<id>-logo.svg` — full logo for the sidebar and login page.
   - `<id>-icon.png` — square icon for the collapsed sidebar and browser favicon.

2. **Add the tenant to `src/config/tenant.js`.** Place it near the end, after the existing thin overrides (look for the Blackmores / Cooper IP / Gallagher Bassett blocks):

   ```js
   configs.<id> = {
     ...configs.default,
     appName: 'Customer Name',
     logo: '/<id>-logo.svg',
     icon: '/<id>-icon.png',
     greeting: 'Good morning, <name>',
     // only the fields that differ — leave everything else to the default
   }
   ```

   If the logo's aspect ratio doesn't sit well at the default `h-7` sidebar / `h-10` login sizes, add `logoClassName: 'h-12 w-auto'` (or similar) and the sidebar + login components will pick it up. See `configs.gallagherbassett` for an example.

3. **Add a login credential** in `src/pages/LoginPage.jsx` so the tenant is reachable via the login page:

   ```js
   <id>: { tenant: '<id>', mode: 'user' },
   ```

   Password is the shared `password` string (demo-only).

4. **(Optional) Add npm scripts** in `package.json` for local per-tenant dev with a dedicated port. Existing ports: 5173 default, 5174 migration, 5175 fshd, 5176 blackmores, 5177 cooperip, 5178 gallagherbassett.

   ```json
   "dev:<id>":   "VITE_TENANT=<id> vite --port 517X",
   "build:<id>": "VITE_TENANT=<id> vite build"
   ```

   You can skip this entirely and just use `npm run dev`, then visit `http://localhost:5173/<id>` — the pathname resolver will pick up the tenant. The scripts are only useful when you want a per-tenant port (e.g., running two tenants side-by-side) or a per-tenant production build.

5. **Run it:**

   ```bash
   npm run dev
   # then open http://localhost:5173/<id>
   ```

## Deep fork

Same steps 1, 3, 4, 5. For step 2, write out the full config instead of spreading `configs.default`:

```js
configs.<id> = {
  appName: '…',
  logo: '/<id>-logo.svg',
  icon: '/<id>-icon.png',
  greeting: '…',
  term: { matter: '…', matters: '…', Matter: '…', Matters: '…', firm: '…', Firm: '…' },
  nav: { work: '…' },
  complySubItems: [ … ],
  pages: {
    control: { kpis: [ … ], matters: [ … ], … },
    work:    { … },
    // …
  },
}
```

Reference `configs.migration` (Playfair) for a complete deep-fork example.

## Deploying

Pick a mode based on what the customer gets.

### Mode A — one shared build, path-prefix URLs (default)

One build serves every tenant. Customers reach their app at `https://<shared-host>/<tenant-id>`. This is what Amplify is currently wired to do and is the lowest-effort path for internal demos and multi-tenant previews.

**Requirements:**
- `npm run build` (no `VITE_TENANT` needed). All `configs.*` ship in the bundle.
- SPA rewrite that sends every unknown path to `/index.html` so `/<tenant-id>` loads the app instead of 404'ing. Amplify: already applied (see the Amplify design doc). Vercel: `rewrites: [{ source: "/(.*)", destination: "/index.html" }]`.

**How resolution works at runtime:** `tenant.js` checks, in order: `location.pathname` → `sessionStorage.ethos_auth.tenant` (from login) → `VITE_TENANT` → `default`. Path wins, so bookmarked URLs beat any stale login session.

**Login flow:** LoginPage redirects to `/<tenant-id>` on success so the URL reflects the active session. Default-tenant logins stay at `/`.

### Mode B — one build per tenant (customer-branded standalone deploy)

Use when a customer wants a dedicated hostname and no path prefix — e.g. `blackmores.app.example.com/`. Set `VITE_TENANT=<id>` in the deploy target's environment variables, then build with `npm run build:<id>` (or just `npm run build` since the env var is read at build time). The pathname resolver still works on top, so `/<other-tenant>` would still switch — avoid linking to those paths on customer-branded deploys if you want them to feel single-tenant.

**Vercel:** set `VITE_TENANT=<id>` in the project's Environment Variables.
**Amplify:** split into per-tenant apps, or parameterise the build command in the app's build settings.

## Common scenarios

**Share one `pages.*` block between tenants.** Already done for Playfair inheriting `insights` and `community` from the default — look for the `configs.migration.pages.insights = …` assignments near the bottom of `tenant.js`.

**Tenant switch at runtime.** Precedence at the export block of `tenant.js`: `pathname > sessionStorage > env var > default`. See **Deploying** above for the full story; the short version is that `/<tenant-id>` in the URL or a login session both switch tenants without a rebuild.

**Add a new page or KPI globally.** Add to `configs.default.pages.*`. Thin-override tenants inherit it automatically; deep-fork tenants need the addition made explicitly in their config block.

**Tenant-specific terminology (matter vs. case vs. file).** Use the `term` object. Page components read e.g. `tenant.term.Matter` rather than hardcoding the noun.

## Where NOT to add tenant conditionals

- **Not in page components.** Pages read from `tenant.pages.*` — they don't branch on tenant id.
- **Not in CSS.** Tenant branding flows through `logo` / `icon` / config fields, not conditional class names.
- **Not in a router.** There's no router — navigation is state-driven via `activePage` in `App.jsx`.
