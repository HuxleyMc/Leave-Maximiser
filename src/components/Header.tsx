import { Link } from "@tanstack/solid-router";
import { Home, Menu, X } from "lucide-solid";
import { createSignal, Show } from "solid-js";

export default function Header() {
	const [isOpen, setIsOpen] = createSignal(false);

	return (
		<>
			<header class="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-lg transition-all duration-300">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setIsOpen(true)}
							class="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
							aria-label="Open menu"
						>
							<Menu size={24} />
						</button>
						<h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
							<Link to="/">Leave Maximiser</Link>
						</h1>
					</div>

					<div class="flex items-center gap-4"></div>
				</div>
			</header>

			<div class="h-16" />

			<aside
				class={`fixed inset-y-0 left-0 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
					isOpen() ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div class="flex items-center justify-between p-5 border-b border-slate-700/50">
					<h2 class="text-xl font-bold text-white">Menu</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav class="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						class="flex items-center gap-4 p-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
						activeProps={{
							class:
								"flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30",
						}}
					>
						<Home
							size={20}
							class="group-hover:text-cyan-400 transition-colors"
						/>
						<span class="font-medium">Home</span>
					</Link>
				</nav>
			</aside>

			<Show when={isOpen()}>
				<div
					class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
					onClick={() => setIsOpen(false)}
				/>
			</Show>
		</>
	);
}
