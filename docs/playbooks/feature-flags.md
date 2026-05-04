# Configure feature flags

Runbook for adding, editing, and retiring flags. Full design: [`../feature-flags-design.md`](../feature-flags-design.md).

All flag values live in `src/config/flags.json`. The resolver in `src/config/flags.js` merges them in order: **default → build mode (`MODE`) → active tenant (`tenantId`) → `VITE_FLAG_*` dev overrides**. Tenant wins over mode, so a Blackmores login on a shared production build still gets Blackmores flags. The `/flags` page shows the current state — open `http://localhost:5174/flags` (any tenant port) to see what's on where.

## TL;DR

- **See current state:** open `/flags`.
- **Change a value:** edit `src/config/flags.json`.
- **Redeploy** — values are compiled in; no live toggles.
- **Flag to a specific brand:** put overrides under the brand's **tenant id** block (e.g. `blackmores`, `migration` — note `playfair` login uses `migration`), not the brand name.

## The shape of `flags.json`

```jsonc
{
  "_meta": {
    "sections":     { "PAGE_COMMUNITY": "You", … },   // row grouping in /flags
    "sectionOrder": [ "Core Pages", "Learn", … ],      // group order
    "envOrder":     [ "prototype", "development", "production",
                      "blackmores", "migration",
                      "fshd", "cooperip", "gallagherbassett" ]
  },
  "default":      { "PAGE_COMMUNITY": true, … },       // canonical, every flag here
  "prototype":    {},                                  // sparse override; {} = same as default
  "development":  {},
  "production":   {},
  "blackmores":   { "PAGE_COMMUNITY": false },
  "migration":    { "PAGE_INSIGHTS":  false },         // Playfair brand
  "fshd":         {},
  "cooperip":     {},
  "gallagherbassett": {}
}
```

Rules, in one line each:

- **`default` is the canonical list** — every flag appears here.
- **Every other env is sparse** — list only what differs.
- **Env blocks may only use keys from `default`** — stray keys throw at import time (validation in `src/config/flags.js`).
- **`_meta` is reserved.** The resolver ignores it.

## Scenarios

### Add a new flag

1. **Pick a name.** New flags use `camelCase` (`communityTab`). Legacy `PAGE_*` / `FEATURE_*` keys remain in the file for now — don't invent new ones in that style.

2. **Add it to `default`** in `flags.json` with the baseline value (usually `true` — you're launching something):

   ```json
   "default": {
     …existing flags…,
     "myNewFlag": true
   }
   ```

3. **Add the `_meta.sections` entry** so the `/flags` UI groups it:

   ```json
   "_meta": {
     "sections": {
       …,
       "myNewFlag": "Cross-cutting Features"
     }
   }
   ```

   New section? Add it here and slot it into `_meta.sectionOrder`.

4. **Add per-env overrides** only for envs where the flag should differ from `default`. Leave the rest as `{}`.

5. **Consume it** in a component:

   ```jsx
   import { flags, isEnabled } from '@/config/flags'

   // direct
   {flags.myNewFlag && <MyFeature />}

   // string-keyed (back-compat shape)
   {isEnabled('myNewFlag') && <MyFeature />}

   // cross-cutting wrapper
   <Feature flag="myNewFlag"><MyFeature /></Feature>
   ```

   For a whole-page gate, add a `gatedRoute(...)` call in `src/App.jsx`; for a sidebar entry, add a `PAGE_FLAG_MAP` entry in `src/components/layout/AppSidebar.jsx`.

6. **Verify.** `npm run dev`, open `/flags`, search for your key. Toggle a consumer with `VITE_FLAG_myNewFlag=false npm run dev` to prove the plumbing.

### Flip a flag on or off for one env

1. Open `flags.json`.
2. Find the env block (e.g. `"blackmores"`), add or change the key:

   ```json
   "blackmores": {
     "PAGE_COMMUNITY": false
   }
   ```

3. Remove the entry entirely to fall back to `default`.
4. Build + redeploy (`npm run build:blackmores`). Values are compile-time.

### Add a new environment

An env is just a new top-level key. Add one when a new brand or stage needs a distinct flag set.

1. **Add the env block** with sparse overrides:

   ```json
   "acmecorp": {
     "PAGE_COMMUNITY": false,
     "FEATURE_TOPIC_QUIZ": false
   }
   ```

2. **Add it to `_meta.envOrder`** so the column shows up in the right spot:

   ```json
   "envOrder": [..., "acmecorp"]
   ```

3. **Give it a label/colour** in `src/pages/FeatureFlagManagerPage.jsx`:

   ```js
   const ENV_META = {
     …,
     acmecorp: { label: 'Acme Corp', dot: 'bg-rose-500' },
   }
   ```

   Skip this and the column renders with the raw key and a grey dot — not broken, just ugly.

4. **Wire the build.** Add `--mode acmecorp` to the `package.json` scripts that should build this env:

   ```json
   "dev:acmecorp":   "VITE_TENANT=acmecorp vite --mode acmecorp --port 5179",
   "build:acmecorp": "VITE_TENANT=acmecorp vite build --mode acmecorp"
   ```

5. **Verify.** `npm run build:acmecorp` → `import.meta.env.MODE === 'acmecorp'` → resolver picks up the override block.

### Override a flag locally for dev

Don't edit `flags.json` for a local experiment — use the build-time override layer:

```bash
# one-off
VITE_FLAG_PAGE_COMMUNITY=true npm run dev

# or in .env.local (gitignored)
VITE_FLAG_PAGE_COMMUNITY=true
```

Key after `VITE_FLAG_` must match the JSON key exactly (case-preserved). Only `"true"` / `"false"` are recognised. Changes require a dev-server restart.

### View current state

Open `/flags` at any tenant URL — e.g. `http://localhost:5174/flags`. Always mounted, no trigger button.

Columns come from `flags.json` env blocks (in `_meta.envOrder`); rows come from `default`. "Active env" is `import.meta.env.MODE` — badge appears on the matching column header.

### Retire a flag

Do this the moment a feature ships on every env. Flags are short-lived by design.

1. Delete the key from `default`, every env block, and `_meta.sections` in `flags.json`.
2. Grep the flag key across the codebase and inline the feature (`{flags.X && …}` → just `…`).
3. Remove any `gatedRoute(...)` or `PAGE_FLAG_MAP` entry pointing at it.
4. `npm run build` — usually catches leftover references.

## Gotchas

- **Flag added to an env block but missing from `default`.** Throws at app boot (validation in `src/config/flags.js`). Add to `default` first.
- **Forgot to update `_meta.sections` for a new flag.** It shows under `Other` in `/flags` — harmless but untidy.
- **Forgot `_meta.envOrder` for a new env.** Column appears (unknown envs are appended), but in declaration order instead of where you wanted it.
- **Changed a flag value but the deployed app didn't change.** Values are compile-time — you need a redeploy. The `/flags` page on the existing deploy shows the old values, not your local JSON.
- **Brand name ≠ tenant id.** `flags.json` is keyed by tenant id (what `tenantId` resolves to at login). The `playfair` login maps to tenant `migration` — so Playfair-branded overrides go in the `migration` block. Check `src/pages/LoginPage.jsx` if unsure.
- **Stale assumption: "MODE drives flags".** The resolver is tenant-first. A shared `npm run build` deploy has `MODE=production`, but a Blackmores login flips `tenantId` to `blackmores` and its overrides apply. If you want a setting to apply **everywhere on the deploy regardless of who logs in**, put it in the `MODE` block (`production`, `staging`), not a tenant block.

## Where NOT to put things

- **Not in tenant config.** Feature **variants** (sidebar starts open vs collapsed, specific term for "matter") belong in `src/config/tenant.js`. On/off switches belong in `flags.json`.
- **Not in component state or CSS.** No `const FEATURE_X_ENABLED = true` constants scattered in files — if it's a flag, it's in `flags.json`.
- **Not in environment variables except for dev overrides.** `VITE_FLAG_*` is for one-off local toggles only. Real env-scoped values live in `flags.json` so they're reviewable.
