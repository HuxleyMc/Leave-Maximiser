import { Link } from "@tanstack/solid-router";

export default function Header() {
	return (
		<header class="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center sm:justify-between">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center text-white font-bold text-lg">
						L
					</div>
					<h1 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-100 to-blue-100 tracking-tight">
						<Link to="/">Leave Maximiser</Link>
					</h1>
				</div>
			</div>
		</header>
	);
}
