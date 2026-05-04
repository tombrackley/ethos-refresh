# Frontend Workflow

End-to-end workflow for implementing frontend features — from raw user requirements through product spec, implementation, and commit-ready code. This workflow orchestrates the **product manager agent** and **frontend engineer agent** in sequence.

## Inputs

The user will provide requirements — these may come as a description, a list of features, a screenshot/mockup, or a reference to an existing page to modify.

## Steps

### Phase 1: Product Manager — Requirements → PRD → Tasks

Run the **product manager agent** (`@.claude/agents/product-manager.md`) to handle this phase.

#### 1.1 Gather Requirements

- Ask the user clarifying questions to fill gaps in the requirements.
- Focus on: what the user sees and does, where it lives in the app, what data is displayed, key interactions, and any tenant differences.
- Don't ask everything at once — prioritise the most important unknowns.

#### 1.2 Write the PRD

- Produce a concise PRD covering: overview, user story, pages/views, data model (mock data fields), interactions, and tenant considerations.
- **Present the PRD to the user and wait for approval before continuing.**

#### 1.3 Split into Tasks

- Break the approved PRD into ordered, dependency-aware tasks for the frontend engineer.
- Each task should name specific files to create/modify, components to use, and data to add.
- Aim for 3–7 tasks per feature.
- **Present the task list to the user and wait for approval before continuing.**

---

### Phase 2: Frontend Engineer — Tasks → Implementation

Run the **frontend engineer agent** (`@.claude/agents/frontend-engineer.md`) to handle this phase, passing it the approved PRD and task list.

#### 2.1 Explore the Codebase

- Read the relevant existing pages and components to understand current patterns.
- Check `src/config/tenant.js` for existing data shapes.
- Identify reusable components in `src/components/ui/`, `src/components/shared/`, and `src/components/layout/`.

#### 2.2 Implement

- Work through the tasks in order.
- Config and mock data first, then components, then navigation wiring.
- Follow existing patterns — use shadcn/ui components, Tailwind utilities, `cn()`, `lucide-react` icons.
- Wire up navigation in `App.jsx` and `AppSidebar.jsx` if new pages are added.
- Keep components focused — no unnecessary abstractions.

#### 2.3 Run Style Check

- Run the `/style-check` skill to verify all changes comply with `.claude/rules/styling-rules.md`.
- Fix any violations.

#### 2.4 Verify

- Run `npm run lint` and fix any errors.
- Run `npm run dev` and confirm the page renders without console errors.

---

### Phase 3: Review & Commit

#### 3.1 Present to User

- Summarise what was built: files created, files modified, key decisions made.
- Ask the user to review and request any changes.
- Iterate on feedback until the user is satisfied.

#### 3.2 Commit

- Only commit when the user explicitly confirms.
- Stage only the relevant files (not unrelated changes).
- Write a concise commit message that describes what was added or changed.