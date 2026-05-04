# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (default tenant, port 5173)
npm run dev:migration    # Start dev server for "migration" tenant (port 5174)
npm run dev:fshd         # Start dev server for "fshd" tenant (port 5175)
npm run dev:cooperip     # Start dev server for "cooperip" tenant (port 5177)
npm run dev:gallagherbassett  # Start dev server for "gallagherbassett" tenant (port 5178)
npm run build            # Production build (default tenant)
npm run build:migration  # Production build (migration tenant)
npm run build:fshd       # Production build (fshd tenant)
npm run build:cooperip   # Production build (cooperip tenant)
npm run build:gallagherbassett  # Production build (gallagherbassett tenant)
npm run lint             # ESLint (flat config, JS/JSX only)
npm run preview          # Preview production build
```

To run a specific tenant inline: `VITE_TENANT=migration npm run dev`

For Vercel deployments, set `VITE_TENANT` in Environment Variables.

## Architecture

**Frontend-only prototype** — React 19 + Vite 7, no backend, no router, no TypeScript. All data is hardcoded in tenant config and page components.

### Navigation / Routing

There is no React Router. Navigation is state-driven via `activePage` string in `App.jsx`. The `AppSidebar` calls `onNavigate(pageName)` and `App` conditionally renders the matching page component. Admin pages use the `Admin:` prefix (e.g., `Admin:Team Overview`).

### Multi-Tenant System

`src/config/tenant.js` holds all tenant variants (default, migration, fshd). Each tenant config defines: app name, logos, terminology (matter vs. case), nav labels, page-specific data (KPIs, mock records), and comply sub-items. The active tenant is selected via `VITE_TENANT` env var. **All mock/demo data lives in this file** — pages read from `tenant.pages.*`.

### Component Hierarchy

- `App.jsx` → `SidebarProvider` + `TooltipProvider` wrapper, renders `AppSidebar` + active page
- Pages are self-contained components in `src/pages/` — each manages its own tabs, modals, and local state
- `EthosAIPanel` — reusable AI assistant side panel, used across multiple pages
- `DutiesHandbook` — overlay component for regulatory duties reference

### Key Patterns

- Path alias: `@/` maps to `src/` (configured in vite.config.js)
- Icons: `lucide-react` throughout
- Animations: `motion` library (framer-motion successor)
- shadcn/ui installed via `shadcn` CLI — components in `src/components/ui/` are generated, avoid manual edits unless extending

### ESLint

Uses flat config (`eslint.config.js`). The `no-unused-vars` rule ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`). React Hooks and React Refresh plugins are active.

## Styling

Detailed rules are in `.claude/rules/styling-rules.md`. Key points:

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin — no tailwind.config.js
- Color system uses semantic CSS variables (`bg-primary`, `text-muted-foreground`) + custom `brand-50`–`brand-950` scale in oklch
- Use `cn()` from `@/lib/utils` for conditional class merging
- No inline styles, no CSS modules, no new CSS files, no arbitrary color values, no `!important`
