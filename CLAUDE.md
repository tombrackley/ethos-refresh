# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run lint     # ESLint (flat config, JS/JSX only)
npm run preview  # Preview production build
```

## Architecture

**Frontend-only prototype** — React 19 + Vite 7, no backend, no TypeScript, single-tenant. All mock/demo data is hardcoded in `src/config/tenant.js` and page components.

### Navigation / Routing

Uses `react-router-dom`. Path-to-page mapping lives in `src/lib/routes.js` (`PATH_TO_PAGE` / `PAGE_TO_PATH`). The `AppSidebar` calls `navigate(path)`; admin routes are under `/admin/*`.

### Tenant config

`src/config/tenant.js` holds the single tenant's config object (`configs.default`) and exports it as the default `tenant` import. It defines: app name, logos, terminology (matter vs. case), nav labels, and page-specific data (KPIs, mock records, briefing items, etc.). **All mock/demo data lives in this file** — pages read from `tenant.pages.*`.

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
