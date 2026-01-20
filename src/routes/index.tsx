import { createFileRoute } from "@tanstack/solid-router";
import { useStore } from "@tanstack/solid-store";
import { createEffect, createSignal, For, Show } from "solid-js";
import CalendarView from "../components/CalendarView";
import { getHolidays } from "../lib/holidays";
import { maximizeLeave } from "../lib/maximiser";
import { store, updateState } from "../lib/store";
import type { MaximizationResult, PublicHoliday } from "../lib/types";

export const Route = createFileRoute("/")({
	component: Home,
});

const COUNTRIES = [
	{ code: "AU", name: "Australia" },
	{ code: "US", name: "United States" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "CA", name: "Canada" },
	{ code: "NZ", name: "New Zealand" },
	{ code: "DE", name: "Germany" },
	{ code: "FR", name: "France" },
	{ code: "JP", name: "Japan" },
	{ code: "SG", name: "Singapore" },
];

function Home() {
	const appState = useStore(store);

	const [country, setCountry] = createSignal(appState().countryCode);
	const [region, setRegion] = createSignal(appState().stateCode);
	const [year, setYear] = createSignal(appState().year);
	const [allowance, setAllowance] = createSignal(appState().annualLeave);

	const [results, setResults] = createSignal<MaximizationResult | null>(null);
	const [error, setError] = createSignal<string | null>(null);
	const [holidays, setHolidays] = createSignal<PublicHoliday[]>([]);
	const [viewMode, setViewMode] = createSignal<"list" | "calendar">("list");

	const dateFormatter = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		weekday: "short",
	});

	const handleMaximize = () => {
		setError(null);
		try {
			updateState({
				countryCode: country(),
				stateCode: region(),
				year: year(),
				annualLeave: allowance(),
			});

			const fetchedHolidays = getHolidays(country(), year(), region());
			if (!fetchedHolidays || fetchedHolidays.length === 0) {
				setError("No holidays found for this region/year combination.");
				setResults(null);
				setHolidays([]);
				return;
			}
			setHolidays(fetchedHolidays);

			const result = maximizeLeave(year(), allowance(), fetchedHolidays);
			setResults(result);
		} catch (err) {
			console.error(err);
			setError("An error occurred while calculating leave.");
		}
	};

	createEffect(() => {
		if (appState().countryCode && appState().year) {
			handleMaximize();
		}
	});

	return (
		<div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
			<div class="max-w-7xl mx-auto px-4 py-8 md:py-12 sm:px-6 lg:px-8">
				<div class="text-center mb-10 md:mb-16">
					<h1 class="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight mb-4">
						Leave Maximiser
					</h1>
					<p class="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
						Turn your annual leave into extended vacations. We analyze public
						holidays to find the perfect dates to book.
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
					<div class="lg:col-span-4 space-y-6">
						<div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 md:p-6 shadow-xl">
							<h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
								<span class="w-1 h-6 bg-cyan-500 rounded-full" />
								Configuration
							</h2>

							<div class="space-y-5">
								<div>
									<label
										for="country"
										class="block text-sm font-medium text-slate-400 mb-1"
									>
										Country
									</label>
									<select
										id="country"
										value={country()}
										onChange={(e) => setCountry(e.target.value)}
										class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
									>
										<For each={COUNTRIES}>
											{(c) => <option value={c.code}>{c.name}</option>}
										</For>
										<option value="OTHER">Other (Enter Code)</option>
									</select>
									<Show when={country() === "OTHER"}>
										<input
											type="text"
											placeholder="e.g. BR"
											class="mt-2 w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
											onInput={(e) => setCountry(e.target.value.toUpperCase())}
										/>
									</Show>
								</div>

								<div class="grid grid-cols-2 gap-4">
									<div>
										<label
											for="state"
											class="block text-sm font-medium text-slate-400 mb-1"
										>
											State / Region{" "}
											<span class="text-slate-600 text-xs">(Opt)</span>
										</label>
										<input
											id="state"
											type="text"
											value={region()}
											placeholder="e.g. NY"
											onInput={(e) => setRegion(e.target.value.toUpperCase())}
											class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
										/>
									</div>
									<div>
										<label
											for="year"
											class="block text-sm font-medium text-slate-400 mb-1"
										>
											Year
										</label>
										<input
											id="year"
											type="number"
											value={year()}
											min={new Date().getFullYear()}
											onInput={(e) => setYear(Number(e.target.value))}
											class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
										/>
									</div>
								</div>

								<div>
									<label
										for="allowance"
										class="block text-sm font-medium text-slate-400 mb-1"
									>
										Annual Leave Days
									</label>
									<div class="relative">
										<input
											id="allowance"
											type="number"
											value={allowance()}
											onInput={(e) => setAllowance(Number(e.target.value))}
											class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
										/>
										<span class="absolute right-4 top-2.5 text-slate-500">
											days
										</span>
									</div>
								</div>

								<button
									onClick={handleMaximize}
									type="button"
									class="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-cyan-500/20 transform transition-all active:scale-[0.98] flex justify-center items-center gap-2 cursor-pointer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
											clip-rule="evenodd"
										/>
									</svg>
									Maximize My Leave
								</button>
							</div>
						</div>

						<div class="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30 mt-6">
							<h3 class="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
								Public Holidays Found: {holidays().length}
							</h3>
							<div class="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
								<For each={holidays()}>
									{(h) => (
										<div class="flex justify-between text-xs text-slate-300 py-1 border-b border-slate-700/50 last:border-0">
											<span>{h.name}</span>
											<span class="font-mono text-slate-500">
												{h.date.split(" ")[0]}
											</span>
										</div>
									)}
								</For>
								<Show when={holidays().length === 0}>
									<p class="text-xs text-slate-500 italic">
										No holidays loaded yet.
									</p>
								</Show>
							</div>
						</div>
					</div>

					<div class="lg:col-span-8">
						<Show when={error()}>
							<div class="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								{error()}
							</div>
						</Show>

						<Show
							when={results()}
							fallback={
								<div class="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl p-12 bg-slate-900/30">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-16 w-16 mb-4 opacity-20"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<p>
										Select your region and click "Maximize" to see the magic.
									</p>
								</div>
							}
						>
							{(res) => (
								<div class="space-y-8 animate-fade-in">
									<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div class="bg-slate-800/50 p-4 md:p-5 rounded-2xl border border-slate-700/50">
											<div class="text-sm text-slate-400 mb-1">
												Total Days Off
											</div>
											<div class="text-3xl font-bold text-white">
												{res().totalDaysOff}
											</div>
											<div class="text-xs text-green-400 mt-2">
												From {res().totalLeaveDaysUsed} leave days
											</div>
										</div>
										<div class="bg-slate-800/50 p-4 md:p-5 rounded-2xl border border-slate-700/50">
											<div class="text-sm text-slate-400 mb-1">
												Efficiency Score
											</div>
											<div class="text-3xl font-bold text-cyan-400">
												{(
													res().totalDaysOff / (res().totalLeaveDaysUsed || 1)
												).toFixed(1)}
												x
											</div>
											<div class="text-xs text-slate-500 mt-2">
												Avg return on investment
											</div>
										</div>
										<div class="bg-slate-800/50 p-4 md:p-5 rounded-2xl border border-slate-700/50">
											<div class="text-sm text-slate-400 mb-1">
												Longest Break
											</div>
											<div class="text-3xl font-bold text-white">
												{Math.max(
													...res().leavePeriods.map((p) => p.daysOff),
													0,
												)}
											</div>
											<div class="text-xs text-slate-500 mt-2">
												Consecutive days
											</div>
										</div>
									</div>

									<div class="flex justify-center mb-6">
										<div class="bg-slate-800/50 p-1 rounded-lg flex gap-1 border border-slate-700/50">
											<button
												type="button"
												onClick={() => setViewMode("list")}
												class={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
													viewMode() === "list"
														? "bg-slate-700 text-white shadow-sm"
														: "text-slate-400 hover:text-white hover:bg-slate-700/50"
												}`}
											>
												List View
											</button>
											<button
												type="button"
												onClick={() => setViewMode("calendar")}
												class={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
													viewMode() === "calendar"
														? "bg-slate-700 text-white shadow-sm"
														: "text-slate-400 hover:text-white hover:bg-slate-700/50"
												}`}
											>
												Calendar View
											</button>
										</div>
									</div>

									<Show when={viewMode() === "list"}>
										<div>
											<h3 class="text-xl font-semibold text-white mb-4 pl-1">
												Suggested Leave Periods
											</h3>
											<div class="space-y-4">
												<For each={res().leavePeriods}>
													{(period) => (
														<div class="group relative bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl p-4 md:p-6 transition-all hover:shadow-lg hover:shadow-cyan-900/20 hover:border-cyan-500/30 overflow-hidden">
															<div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600"></div>

															<div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
																<div class="flex-1">
																	<div class="flex items-baseline gap-3 mb-2">
																		<span class="text-xl md:text-2xl font-bold text-white">
																			{dateFormatter.format(
																				new Date(period.start),
																			)}
																		</span>
																		<span class="text-slate-500 font-light">
																			to
																		</span>
																		<span class="text-xl md:text-2xl font-bold text-white">
																			{dateFormatter.format(
																				new Date(period.end),
																			)}
																		</span>
																	</div>
																	<div class="flex flex-wrap gap-2">
																		<For each={period.holidays}>
																			{(h) => (
																				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
																					{h.name}
																				</span>
																			)}
																		</For>
																	</div>
																</div>

																<div class="flex items-center gap-4 md:gap-6">
																	<div class="text-center">
																		<div class="text-xs text-slate-400 uppercase tracking-wider mb-1">
																			Take
																		</div>
																		<div class="text-xl font-bold text-slate-200">
																			{period.leaveDaysRequired}
																		</div>
																	</div>
																	<div class="w-px h-8 bg-slate-700"></div>
																	<div class="text-center">
																		<div class="text-xs text-slate-400 uppercase tracking-wider mb-1">
																			Get
																		</div>
																		<div class="text-xl font-bold text-cyan-400">
																			{period.daysOff}
																		</div>
																	</div>
																	<div class="hidden md:block w-px h-8 bg-slate-700"></div>
																	<div class="hidden md:block text-center min-w-[60px]">
																		<div class="text-xs text-slate-400 uppercase tracking-wider mb-1">
																			Eff
																		</div>
																		<div class="text-lg font-bold text-white">
																			{(
																				period.daysOff /
																				(period.leaveDaysRequired || 1)
																			).toFixed(1)}
																			x
																		</div>
																	</div>
																</div>
															</div>
														</div>
													)}
												</For>
											</div>
										</div>
									</Show>

									<Show when={viewMode() === "calendar"}>
										<CalendarView
											year={year()}
											holidays={holidays()}
											leavePeriods={res().leavePeriods}
										/>
									</Show>
								</div>
							)}
						</Show>
					</div>
				</div>
			</div>
		</div>
	);
}
