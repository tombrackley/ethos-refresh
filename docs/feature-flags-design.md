# Design: Feature Flags for a Static SPA (Vite + Amplify)

**Status:** Implemented
**Owner:** leon@ethikagroup.com.au
**Last updated:** 2026-04-23

## 1. Goals

- Give every feature an on/off switch without a backend, a flag service, or new infra.
- Model envs as a single namespace of named deployment targets. Current envs: `prototype`, `development`, `production`, `blackmores`, `migration`, `fshd`, `cooperip`, `gallagherbassett`. White-label brands, dev, staging, prod all sit in the same table.
- **Flags follow the active tenant at runtime.** When a user logs in as Blackmores, the Blackmores env overrides apply — even on a shared build where the compile-time `MODE` is `production`. This is why the login page does a full reload: `tenantId` re-resolves and the flag singleton re-initialises with the right overrides.
- Keep flag checks readable: `if (flags.communityTab) …`.
- Keep the flag table in **a single JSON file** committed to the repo — easy to scan, easy to diff at review.
- Expose a **read-only management UI at `/flags`** so non-engineers can see what's on where, without needing to read JSON.
- Let disabled code tree-shake when the env is fixed at build time.
- Support a narrow **dev-time override** so a developer can flip a flag locally without editing the JSON.

## 2. Non-goals

- **No runtime flag service** (LaunchDarkly, GrowthBook, Unleash). No backend, no auth.
- **No remote fetch of a flag file.** JSON is imported at build time. Changing a flag requires a redeploy. Kill-switch extension sketched in §7, deferred.
- **No A/B testing, percentage rollouts, or user-targeted flags.** Boolean, evaluated once at load.
- **No 2D tenant × env matrix.** Earlier drafts had tenant and env as separate axes — collapsed. If a brand in preview ever genuinely diverges from the same brand in prod, name it as its own env (e.g. `blackmores-preview`) rather than reintroducing a matrix.
- **No interactive toggles in the `/flags` UI.** The JSON is the source of truth; the page is a viewer, not an editor.

## 3. Options considered

| # | Approach | Dynamic? | Tree-shakeable? | Infra cost | Fit |
| - | -------- | -------- | --------------- | ---------- | --- |
| A | **Static `src/config/flags.json` keyed by environment (single axis)** | Compile | Partial¹ | None | **Chosen, implemented** |
| B | Separate tenant × env matrix | Compile | Partial¹ | None | Rejected — two axes for one concept |
| C | `features` object on each tenant config in `tenant.js` | Compile | Partial¹ | None | Rejected — flags buried in a 4700-line file |
| D | Runtime `flags.json` fetched from CDN | Runtime | No | None | Deferred (§7) |
| E | Hosted flag service | Runtime | No | $$ + SDK | Rejected |

¹ Flags tree-shake only when the environment is fixed at build time (`vite build --mode <env>`). A shared multi-env build ships every env's overrides.

**Recommendation:** **A, with `VITE_FLAG_*` as a narrow dev override.** One JSON file, one axis, one resolver.

## 4. How the environment is selected

There are two axes, merged in a fixed precedence (§5.2):

- **Build mode** — `import.meta.env.MODE`, set by Vite's `--mode` flag at build time. Fixed for the life of the deployed bundle.
- **Active tenant** — `tenantId` from `src/config/tenant.js`, resolved per page load from URL pathname, sessionStorage (set at login), or `VITE_TENANT`. Can change across sessions on the same deployed bundle.

The tenant axis is the one that lets a single shared build serve multiple brands: log in as Blackmores → `tenantId` becomes `'blackmores'` → the `blackmores` block in `flags.json` applies on top of whatever MODE set.

Build-mode mapping (what `MODE` becomes for each common command):

| Situation | Command | `MODE` |
| --------- | ------- | ------ |
| Local dev | `npm run dev` | `development` (auto) |
| Local dev, tenant branding | `npm run dev:gallagherbassett` | `gallagherbassett` |
| Production build, generic | `npm run build` | `production` (auto) |
| Production build, brand | `npm run build:blackmores` | `blackmores` |
| Preview / staging | `vite build --mode staging` | `staging` |

Note: env names and tenant ids share a namespace in `flags.json`. A top-level key like `blackmores` acts as an env override regardless of whether it was selected via `--mode blackmores` (build) or via `tenantId === 'blackmores'` (login / URL). A brand can have a tenant config but no env entry (flags fall through to `default`), or an env entry but no tenant config (useful for `staging` / `production` that don't rebrand).

One caveat: login usernames don't always match tenant ids. For example, the `playfair` login maps to `tenant: 'migration'` in `src/pages/LoginPage.jsx` — so Playfair-branded flag overrides live in the `migration` block, not `playfair`. Keep `flags.json` keyed by tenant id, not brand name.

All tenant-specific `package.json` scripts now pass both `VITE_TENANT=<id>` and `--mode <id>`, so the tenant and flag layers see the same name:

```jsonc
"dev:gallagherbassett":   "VITE_TENANT=gallagherbassett vite --mode gallagherbassett --port 5178",
"build:gallagherbassett": "VITE_TENANT=gallagherbassett vite build --mode gallagherbassett",
```

Build shapes and what tree-shakes:

| Build | Mode fixed? | Tree-shakes? |
| ----- | ----------- | ------------ |
| `npm run build:gallagherbassett` (with `--mode`) | Yes | Yes — only that env's overrides survive |
| `npm run build` | Yes (`production`) | Yes |
| `npm run dev` | Yes (`development`) | N/A |

Every deployment command pins one mode, so tree-shaking is the norm, not the exception.

## 5. Design

### 5.1 File and schema

File: **`src/config/flags.json`** (exists). Flat, keyed by environment name. `default` holds the canonical flag set; every other environment is a **sparse** override. Display metadata (sections, ordering) lives under a reserved `_meta` key.

Current shape (trimmed):

```jsonc
{
  "_meta": {
    "sections": {
      "PAGE_COMMUNITY": "You",
      "FEATURE_AI_PANEL": "Cross-cutting Features",
      // …one entry per flag
    },
    "sectionOrder": [
      "Cross-cutting Features", "Core Pages", "Compliance & Governance",
      "Learn", "Knowledge", "You", "Footer", "Admin"
    ],
    "envOrder": ["prototype", "development", "production", "blackmores", "migration", "fshd", "cooperip", "gallagherbassett"]
  },

  "default": {
    "PAGE_COMMUNITY": true,
    "FEATURE_AI_PANEL": true,
    // …every canonical flag
  },

  "prototype":   {},
  "development": {},
  "production":  {},
  "blackmores": {
    "PAGE_COMMUNITY": false,
    "PAGE_TALENT": false,
    "FEATURE_TOPIC_QUIZ": false
  },
  "migration": {
    "PAGE_INSIGHTS": false,
    "FEATURE_TALENT_ENQUIRY": false
  },
  "fshd":             {},
  "cooperip":         {},
  "gallagherbassett": {}
}
```

Rules:

- **`default` is the canonical flag list.** Every flag appears there with its baseline value. Adding a flag means adding it to `default` first.
- **Every other env is sparse.** List only the keys that differ from `default`. Empty `{}` = same as default.
- **Env blocks may only contain keys that exist in `default`.** Stray keys fail validation (§5.4).
- **Unknown envs fall through to `default`** with a console warn at boot, not fatal.
- **`_meta` is reserved.** The resolver and validation filter it out. Any other underscore-prefixed top-level key is reserved for future metadata.
- **Boolean only.** No strings, no enums. Feature variants belong in `tenant.js`, not `flags.json`.
- **Name flags after the feature, not the state.** `communityTab`, not `hideCommunityTab`. (The current file still uses the legacy `PAGE_*` / `FEATURE_*` names — they'll be renamed during the §10 migration.)

### 5.2 Resolver

Lives in `src/config/flags.js`. Runs validation (§5.4) at import time, then exports:

- `flags` — merged singleton (default + mode + tenant + `VITE_FLAG_*`)
- `isEnabled(key)` — back-compat helper for string-keyed consumers
- `getBuildMode()` — `import.meta.env.MODE`
- `getActiveEnv()` — `tenantId` (what drives flags at runtime)

```js
import flagsJson from './flags.json'
import { tenantId } from './tenant'

const buildMode       = import.meta.env.MODE
const modeOverrides   = flagsJson[buildMode] ?? {}
const tenantOverrides = flagsJson[tenantId]  ?? {}

const devOverrides = /* read VITE_FLAG_* env vars */

export const flags = {
  ...flagsJson.default,
  ...modeOverrides,
  ...tenantOverrides,
  ...devOverrides,
}
```

Precedence, lowest → highest: `default` → **build mode overrides** → **tenant overrides** → `VITE_FLAG_*`.

The order is deliberate. Build-mode comes first because it's the deployment-wide baseline. Tenant comes *after* mode because it's the user-scoped layer — a Blackmores login should override whatever the default/production flags say. Dev overrides stay on top so a developer can force-flip anything locally.

Worked examples:

| Build | Login as | `MODE` | `tenantId` | Applied |
| ----- | -------- | ------ | ---------- | ------- |
| `npm run build` | default | `production` | `default` | default + production({}) + default({}) = default |
| `npm run build` | blackmores | `production` | `blackmores` | default + production({}) + blackmores(overrides) = **Blackmores flags** |
| `npm run build:blackmores` | anyone | `blackmores` | per URL/session | default + blackmores(overrides) + tenant(overrides) = **Blackmores flags** |
| `npm run dev` | blackmores | `development` | `blackmores` | default + development({}) + blackmores(overrides) = **Blackmores flags** |

Consumer patterns (both supported):

```jsx
import { flags, isEnabled } from '@/config/flags'

{flags.PAGE_COMMUNITY && <NavItem to="community" />}
{isEnabled('PAGE_COMMUNITY') && <NavItem to="community" />}
```

Module-level singletons, no hook, no context.

### 5.3 Dev overrides

```bash
# one-off
VITE_FLAG_PAGE_COMMUNITY=true npm run dev

# or in .env.local (gitignored)
VITE_FLAG_PAGE_COMMUNITY=true
```

Flag key after the `VITE_FLAG_` prefix must match the key in `flags.json` exactly (case-preserved). Only `"true"` / `"false"` are recognised; other values are ignored. Changing an override mid-session requires a dev-server restart.

### 5.4 Validation

```js
const RESERVED = new Set(['_meta', 'default'])
const canonicalFlags = Object.keys(flagsJson.default)

for (const [env, overrides] of Object.entries(flagsJson)) {
  if (RESERVED.has(env)) continue
  const stray = Object.keys(overrides).filter(k => !canonicalFlags.includes(k))
  if (stray.length) {
    throw new Error(`flags.json: env "${env}" has unknown flags: ${stray.join(', ')}`)
  }
}
```

Fails loud at app boot and during CI `npm run build`. A flag added only to one env (without landing in `default`) never ships.

What this doesn't validate: env block presence. If you forget to add `"blackmores": {}`, the app boots fine on the `blackmores` build — `default` values apply, console warns. Intentional.

### 5.5 Consumers and retirement

- **One flag per feature, not per component.** When the flag retires, there's one name to grep.
- **Retire flags fast.** Once a feature ships across all envs, delete the flag and inline the feature.
- **No nested flags.** One flag per shipping decision.

## 6. Management UI at `/flags`

Implemented at `src/pages/FeatureFlagManagerPage.jsx`, route `/flags` in `App.jsx`. **Read-only viewer**, no in-UI toggling — the JSON is the source of truth.

Shape of the page:

- Header: title + current active env (from `import.meta.env.MODE`), rendered as a badge.
- Grid: rows = flags, columns = envs. Columns come from `_meta.envOrder`; any extras are appended in declaration order.
- Section sub-headers group flags by `_meta.sections`, ordered by `_meta.sectionOrder`.
- Each cell shows a colored status dot + `On` / `Off` pill. The active env column gets an `active` badge in its header.
- Search filter matches both flag keys and section names.
- Footer: one-line hint that values are compile-time and require a redeploy to change.

Access:

- Route is **always mounted** — accessible by typing `/flags` in the URL.
- No floating trigger button on the chrome (removed 2026-04-23). If non-engineers need to find it, we'll document the URL; adding a link in the Admin sidebar is the next step if that proves insufficient.

## 7. Deferred: remote / runtime flags

Out of scope. If a kill-switch need arises:

- Publish `public/flags.json` alongside the build (or host separately on S3/CloudFront).
- Fetch on boot, merge with highest precedence, block first paint.
- Tradeoffs: no tree-shaking, network on critical path, cache-invalidation to own.

The resolver in §5.2 gains a fourth merge step without restructuring.

## 8. Phases

Legend: ✅ = done, ⬜ = not started.

### Phase 1 — Core plumbing ✅

- ✅ `src/config/flags.json` — `_meta`, `default`, and eight env blocks (`prototype`, `development`, `production`, `blackmores`, `migration`, `fshd`, `cooperip`, `gallagherbassett`).
- ✅ `src/config/flags.js` — shared resolver with validation, `flags` singleton, `isEnabled()` compat helper.
- ✅ `/flags` management UI reads the JSON directly; all nine envs as columns, section grouping, horizontal scroll when viewport is narrow.
- ✅ Floating `FeatureFlagTrigger` button removed; `/flags` is URL-only.

### Phase 2 — Adoption ✅

- ✅ All consumers migrated from `@/config/featureFlags` → `@/config/flags`: `App.jsx`, `components/Feature.jsx`, `components/layout/AppSidebar.jsx`, `pages/ResourceLibraryPage.jsx`. Every `<Feature flag="…">` call-site inherits the migration via the wrapper.
- ✅ `src/config/featureFlags.js` deleted.
- ✅ Per-tenant `package.json` scripts updated to pass `--mode <tenant>`. Tenant + flag layer now see the same env name.

### Phase 3 — Env-specific CI (deferred)

- ⬜ Extend `.github/workflows/deploy-amplify.yml` to pass `--mode` per branch (§4). Only needed when we want a non-`main` branch to deploy with a different flag set.
- ⬜ Add an env-specific override driven from CI to prove the axis end-to-end.

### Phase 4 — Cleanup discipline (ongoing)

- ⬜ Retire flags the moment a feature ships across all envs. The flag names in `flags.json` still use legacy `PAGE_*` / `FEATURE_*` — retiring or renaming to feature-named camelCase happens flag-by-flag as each is touched.
- ⬜ Periodic grep — no flag past a quarter without a reason.

## 9. Open questions

- **Flag rename vs. keep legacy names.** `flags.json` still uses `PAGE_*` / `FEATURE_*` keys. Bulk-rename to feature-named camelCase, or rename opportunistically as flags are touched?
- **Sidebar link to `/flags`.** Route-only access is fine for engineers. If product / design need it, add a subtle link under Admin.
- **Runtime / remote flags (§7).** Revisit only when a kill-switch need arises.

## 10. Migration from `src/config/featureFlags.js` — complete

The legacy system has been fully replaced. Historical mapping kept here for anyone reading old commits or PRs:

| Before | After |
| ------ | ----- |
| `src/config/featureFlags.js` (`FLAGS`, `isEnabled`, `getBuildMode`, `isManagerVisible`) | `src/config/flags.js` (`flags`, `isEnabled`, `getBuildMode`) |
| `VITE_BUILD_MODE=client-prototype` | `MODE=prototype` (Vite `--mode`) |
| `VITE_BUILD_MODE=stage1/2/3` | Named envs in `flags.json` (none needed today) |
| `stages: []` (hidden in staged builds) | Per-env override `"<env>": { "PAGE_X": false }` |
| `stages: ['stage1','stage2','stage3']` | Present in `default: true`, no overrides |
| `localStorage.ff_<KEY>=true` | `VITE_FLAG_<KEY>=true` at build time (§5.3) |
| Floating flag-trigger button | Direct `/flags` URL only |
| `isManagerVisible()` gate on `/flags` route | Route is always mounted |

Lost behaviour (by design):

- Runtime localStorage toggle while the app is running. Replaced by build-time `VITE_FLAG_*`.
- Multi-stage progressive rollout. If staged rollouts come back, name them as envs (`stage1`, `stage2`) in `flags.json`.
