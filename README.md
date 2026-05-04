# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Feature Flags

The app uses a build-mode-based feature flag system to control which pages and features are visible.

### Mental Model

- **`client-prototype`** (default): The full experience — all features enabled. This is what clients see.
- **`stage1`**, **`stage2`**, **`stage3`**: Dev-ready builds where flags progressively enable features. In `stage1`, only Learn pages and Admin systems are visible.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_BUILD_MODE` | `client-prototype` | Build mode — controls which flags are enabled |
| `VITE_SHOW_FLAG_MANAGER` | `false` | Show the flag manager UI in non-prototype modes |

### Usage

```bash
# Full prototype (default)
npm run dev

# Dev-ready build with only stage1 features
VITE_BUILD_MODE=stage1 npm run dev

# Dev-ready build with flag manager visible
VITE_BUILD_MODE=stage1 VITE_SHOW_FLAG_MANAGER=true npm run dev
```

### Flag Manager

In `client-prototype` mode (or when `VITE_SHOW_FLAG_MANAGER=true`), a flag icon button appears in the bottom-right corner. Click it to open `/flags` where you can toggle individual flags. Overrides are stored in localStorage and persist across reloads. Use "Reset to defaults" to clear all overrides.

### Vercel Config

Set `VITE_BUILD_MODE` in your Vercel project's Environment Variables to control which features are visible in deployed previews.
