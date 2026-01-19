---
name: web-designer
description: Design and implement modern, clean, and usable UI components for the Leave Maximiser project (SolidJS, Tailwind, Biome).
---

# Web Designer Skill

This skill guides you through creating professional UI components that match the `Leave Maximiser` project's architectural and stylistic constraints.

## Instructions

### 1. Gather Context
- Read `AGENTS.md` to refresh memory on naming conventions and tech stack.
- Read `.factory/skills/web-designer/references.md` to see the "Gold Standard" component structure.
- Read `src/styles.css` to understand global styles.

### 2. Design Phase
- Propose a layout that fits the "modern, clean, and usable" aesthetic (Dark mode default: `bg-slate-900`, `text-slate-100`, accents `cyan-500`/`blue-500`).
- Plan for responsiveness (mobile-first approach).
- Select icons from `lucide-solid`.

### 3. Implementation Phase
- Create/Edit the component file (e.g., `src/components/MyComponent.tsx`).
- **Strictly follow**:
  - **SolidJS**: Use `createSignal`, `<Show>`, `<For>`.
  - **Tailwind**: Use utility classes directly in JSX.
  - **Typography**: Use standard Tailwind sans/mono stacks.
- Ensure `tab` indentation (Biome requirement).

### 4. Verification Phase
- Run `npm run check` to verify linting and formatting. **Fix all errors.**
- Review the code against `.factory/skills/web-designer/checklist.md`.
- Ensure no `any` types are used (Strict TS).

## Example Usage

```bash
# User: "Create a footer component"
# Droid: Invokes web-designer skill
```
