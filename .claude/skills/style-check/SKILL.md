# Style Check

Review all changed or new code in this session against the project styling rules defined in `.claude/rules/styling-rules.md`.

## Steps

1. Read `.claude/rules/styling-rules.md` to load the current styling rules.
2. Identify all files that have been created or modified in this session.
3. For each file, check for violations of the styling rules:
   - Are Tailwind utility classes used (no inline styles, no CSS modules)?
   - Are semantic color tokens used (`bg-primary`, `text-muted-foreground`) instead of raw hex/oklch values?
   - Is `cn()` used for conditional class merging?
   - Do new components follow the existing patterns (forwardRef for UI primitives, plain functions for pages)?
   - Is the file in the correct directory (`pages/`, `components/ui/`, `components/layout/`, `components/shared/`)?
   - Are spacing, border-radius, and shadow values consistent with existing patterns?
   - No `!important`, no new CSS files, no arbitrary color values?
   - Does it respect both light and dark mode tokens?
   - For multi-tenant concerns, is styling driven by config not conditional CSS?

4. Report findings as a checklist:
   - List each file checked
   - Mark passing rules with a checkmark
   - Flag violations with the specific rule broken and a suggested fix

5. If violations are found, offer to fix them automatically.
