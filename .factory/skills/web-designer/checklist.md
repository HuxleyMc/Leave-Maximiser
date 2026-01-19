# Design Quality Checklist

Before completing any design task, verify the following:

## 1. Visual Design
- [ ] **Responsiveness**: Does the layout work on mobile (< 640px), tablet (md), and desktop (lg)?
- [ ] **Dark Mode**: Are all text/bg colors compatible with the app's dark theme (slate-900 bg)?
- [ ] **Consistency**: Did you use the project's color palette (slate, cyan, blue)?

## 2. Technical Compliance
- [ ] **SolidJS**: Used `createSignal` (not `useState`) and control flow components (`<Show>`, `<For>`)?
- [ ] **Icons**: Used `lucide-solid` icons?
- [ ] **Linting**: Did you run `npm run check` and fix any Biome errors?

## 3. Accessibility
- [ ] **Semantics**: Used proper HTML5 tags (`header`, `main`, `nav`, `button`)?
- [ ] **Interactive Elements**: Do buttons have `aria-label` if they are icon-only?
- [ ] **Contrast**: Is text readable against the background?
