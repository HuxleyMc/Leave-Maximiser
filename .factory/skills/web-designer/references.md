# Design References & Constraints

## Tech Stack
- **Framework**: SolidJS (Signals, `<Show>`, `<For>`, `<Switch>`)
- **Styling**: Tailwind CSS v4 (Utility-first, `@apply`)
- **Icons**: `lucide-solid`
- **Linting/Formatting**: Biome (Tabs, Double Quotes, Strict Types)
- **State**: `@tanstack/store` or `createSignal`

## Component Reference (Gold Standard)

Use this structure for all new UI components:

```tsx
import { Link } from "@tanstack/solid-router";
import { Home, Menu, X } from "lucide-solid";
import { createSignal } from "solid-js";

export default function Header() {
	const [isOpen, setIsOpen] = createSignal(false);

	return (
		<header class="p-4 flex items-center bg-gray-800 text-white shadow-lg">
			{/* Accessibility: Always use semantic HTML (header, nav, button) */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
				aria-label="Open menu"
			>
				<Menu size={24} />
			</button>
            
            {/* Dark Mode: Ensure colors work in dark mode (default in this app) */}
            {/* Responsive: Use mobile-first prefixes (e.g., md:flex) */}
			<nav class="hidden md:flex gap-4">
				<Link to="/" class="hover:text-cyan-400">Home</Link>
			</nav>
		</header>
	);
}
```
