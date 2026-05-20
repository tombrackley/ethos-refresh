# Ethika Ethos — Styling Rules

## Stack
- React 19 + Vite 7 (JSX, no TypeScript)
- Tailwind CSS v4 (imported via `@import "tailwindcss"` in index.css)
- shadcn/ui components in `src/components/ui/`
- Motion (framer-motion successor) for animations
- Radix UI primitives under the hood
- `cn()` utility from `@/lib/utils` for merging classes
- CVA (`class-variance-authority`) for component variants

## Color System
- **Brand palette**: `brand-50` through `brand-950` defined in `@theme` using oklch
- **Primary color**: `#153E40` (brand-800) — used for buttons, focus rings, active nav
- **CSS variables**: Use semantic tokens (`primary`, `muted`, `accent`, `destructive`, etc.) not raw hex/oklch values
- **Dark mode**: Supported via `.dark` class — always respect both light and dark tokens
- **Background**: `#F9FAFB` (light), sidebar uses `#F3F4F6`
- Muted foreground: `#64748B` (slate-500)

## Typography
- Font: Inter (via `--font-sans`)
- Antialiased rendering enabled globally
- Use Tailwind text utilities (`text-sm`, `text-xs`, `text-base`, etc.)
- Muted/secondary text uses `text-muted-foreground`

## Component Patterns
- shadcn/ui components use `data-slot` attributes for styling hooks
- Components use `React.forwardRef` with `displayName` (ui primitives)
- Page components are plain function components (no forwardRef needed)
- Button variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Button sizes: `default` (h-9), `sm` (h-8), `lg` (h-10), `icon` (h-9 w-9)
- Cards use `rounded-lg border shadow-xs` pattern
- Card padding: `p-4` for header, `px-4 pb-4` for content

## Layout
- App uses sidebar layout: `flex h-screen w-full bg-sidebar`
- Main content area: `flex flex-1 flex-col overflow-hidden p-2`
- Page content wraps in: `rounded-lg bg-background border border-[#E2E8F0]`
- Sidebar is collapsible via `SidebarProvider`
- Shared components live in `src/components/shared/`
- Layout components (AppSidebar, TopBar, AiSummaryBar) in `src/components/layout/`

## File Organization
- `src/pages/` — Page-level components (one per page)
- `src/components/ui/` — shadcn/ui primitives (do not manually edit unless extending)
- `src/components/layout/` — App shell and navigation
- `src/components/shared/` — Reusable non-ui components
- `src/config/` — Tenant and environment config
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities (cn, etc.)

## Styling Do's
- Always use Tailwind utility classes — no inline styles
- Use `cn()` to merge conditional classes
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) not raw values
- Use `brand-*` scale for custom brand-colored elements
- Respect the existing border radius system (`--radius` based)
- Use `shadow-sm`, `shadow-md`, `shadow-xs` from existing patterns
- Keep spacing consistent with Tailwind defaults (p-2, p-4, p-6, gap-2, gap-4)

## Styling Don'ts
- Do not use CSS modules or styled-components
- Do not add new CSS files — extend index.css if truly needed
- Do not use arbitrary color values — use the defined tokens/brand scale
- Do not override shadcn/ui component internals unless creating a variant
- Do not use `!important`
- Do not mix rem/px — use Tailwind's spacing scale

## shadcn/ui Component Usage

Always use the project's shadcn/ui components instead of raw HTML equivalents. These components are pre-styled to match the design system and ensure visual consistency across the prototype.

**Available components → use instead of raw HTML:**
- `<Button>` (`@/components/ui/button`) → not raw `<button>` (exception: minimal icon-only click targets where Button semantics don't fit)
- `<Input>` (`@/components/ui/input`) → not raw `<input type="text">`
- `<Checkbox>` (`@/components/ui/checkbox`) → not raw `<input type="checkbox">`
- `<Switch>` (`@/components/ui/switch`) → not raw toggle/checkbox switches
- `<Badge>` (`@/components/ui/badge`) → not hand-styled `<span>` badge patterns
- `<Card>`, `<CardHeader>`, `<CardContent>` (`@/components/ui/card`) → not manually recreated card wrappers
- `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` (`@/components/ui/table`) → not raw `<table>` elements
- `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` (`@/components/ui/tabs`) → not custom tab implementations
- `<Separator>` (`@/components/ui/separator`) → not `<hr>` or border-based dividers
- `<Skeleton>` (`@/components/ui/skeleton`) → not custom loading placeholders
- `<Progress>` (`@/components/ui/progress`) → not custom progress bars
- `<DropdownMenu>` (`@/components/ui/dropdown-menu`) → not custom dropdown implementations
- `<Sheet>` (`@/components/ui/sheet`) → not custom slide-over panels
- `<Tooltip>` (`@/components/ui/tooltip`) → not custom tooltip implementations
- `<Accordion>` (`@/components/ui/accordion`) → not custom collapsible sections

**Customisation is expected** — shadcn components accept `className` for one-off overrides via `cn()`. For recurring custom styles, add new CVA variants to the component file (e.g., `status-published` variant on Badge). Do not duplicate shadcn base styles in raw elements.

## Tenant Config
- Single-tenant prototype. Config lives in `src/config/tenant.js`
- Pages read mock data from `tenant.pages.*`
