# Agent Guidelines for Leave Maximiser

Welcome, agent. This project is a Solid.js application built with TanStack Start, styled with Tailwind CSS, and managed with Biome.

## 🛠 Commands

| Task | Command |
| :--- | :--- |
| **Dev Server** | `npm run dev` (starts on port 3000) |
| **Build** | `npm run build` |
| **Lint** | `npm run lint` |
| **Format** | `npm run format` |
| **Comprehensive Check** | `npm run check` (lint + format + organize imports) |
| **Run All Tests** | `npm run test` |
| **Run Single Test** | `npx vitest <path-to-test>` or `npx vitest -t "test name pattern"` |
| **Deploy** | `npm run deploy` (wrangler) |

## 📐 Code Style & Conventions

### ⚛️ Solid.js & JSX
- **Functional Components**: Prefer functional components. Use the `.tsx` extension for files containing JSX.
- **Reactivity**: Use `createSignal()` for local state. Avoid over-using signals if a simple variable suffices for non-reactive data.
- **Control Flow**: Use Solid's built-in components like `<For>`, `<Show>`, and `<Switch>` instead of array mapping or ternary operators in JSX where possible.

### TypeScript
- **Strict Mode**: Strict typing is enforced. Avoid `any`. Use `unknown` if a type is truly unknown.
- **Event Handlers**: Implement proper typing for event handlers (e.g., `JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>`).
- **Context**: Use type-safe context with `createContext<T>()`.
- **Assertions**: Use type assertions (`as`) sparingly and only when necessary.

### 🎨 Styling (Tailwind CSS)
- **Utility-First**: Follow a utility-first CSS approach directly in JSX `class` attributes.
- **Responsiveness**: Use Tailwind's responsive prefixes (e.g., `md:`, `lg:`).
- **Global Styles**: Global styles are located in `src/styles.css`.
- **Custom Styles**: Use `@apply` or Tailwind `@layer` directive in CSS files for reusable styles or custom overrides.
- **Dark Mode**: Implement dark mode using Tailwind's `dark:` variant.

### 🛣 Routing (TanStack Router)
- **File-Based Routing**: Routes are located in `src/routes/`.
- **Route Definition**: Use `createFileRoute` for defining routes in files.
- **Navigation**: Use the `Link` component from `@tanstack/solid-router` for SPA navigation.
- **Data Loading**: Utilize the `loader` function in route definitions for pre-fetching data.

### 📦 State Management (TanStack Store)
- Use `@tanstack/store` for global state.
- Use `Derived` for computed state that depends on the store.

### 🧹 Linting & Formatting (Biome)
- **Indentation**: Use **Tabs** for indentation (configured in `biome.json`).
- **Quotes**: Use **Double Quotes** for JavaScript/TypeScript strings.
- **Imports**: Biome automatically organizes imports. Library imports first, followed by internal/relative imports.
- **Gen Files**: Ignore `src/routeTree.gen.ts` as it is auto-generated.

### 📛 Naming Conventions
- **Files**: Use kebab-case for filenames (e.g., `demo-store.ts`), except for routes which follow TanStack Router conventions.
- **Components**: PascalCase (e.g., `Header`, `FormExample`).
- **Variables/Functions**: camelCase (e.g., `fullName`, `handleSubmit`).
- **Constants**: UPPER_SNAKE_CASE for global constants.

## 🚨 Error Handling
- Use Solid.js `ErrorBoundary` for catching rendering errors.
- Use `Suspense` for handling async loading states.
- For API calls and server functions, use try/catch blocks or TanStack Query's built-in error handling.

## 🧪 Testing
- The project uses **Vitest**.
- Place test files next to the code they test with a `.test.ts` or `.spec.ts` extension, or in a `__tests__` directory.
