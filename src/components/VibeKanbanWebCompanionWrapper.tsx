import { onCleanup, onMount } from "solid-js";

export default function VibeKanbanWebCompanionWrapper() {
	let containerRef: HTMLDivElement | undefined;
	// biome-ignore lint/suspicious/noExplicitAny: React root type
	let root: any | undefined;

	onMount(async () => {
		if (import.meta.env.DEV && containerRef) {
			try {
				const [
					{ VibeKanbanWebCompanion },
					{ default: React },
					{ default: ReactDOM },
				] = await Promise.all([
					// @ts-expect-error: Package might not have types
					import("vibe-kanban-web-companion"),
					// @ts-expect-error: React might not be installed in types
					import("react"),
					// @ts-expect-error: React DOM might not be installed in types
					import("react-dom/client"),
				]);

				// biome-ignore lint/suspicious/noExplicitAny: React integration
				root = (ReactDOM as any).createRoot(containerRef);
				root.render(React.createElement(VibeKanbanWebCompanion));
			} catch (e) {
				console.error("Failed to load Vibe Kanban Web Companion", e);
			}
		}
	});

	onCleanup(() => {
		root?.unmount();
	});

	// Only render the container in DEV mode
	return import.meta.env.DEV ? <div ref={containerRef} /> : null;
}
