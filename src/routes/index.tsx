import { createFileRoute } from "@tanstack/solid-router";
import { useStore } from "@tanstack/solid-store";
import { Calendar, ChevronDown, ChevronUp, List } from "lucide-solid";
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
	const [isConfigOpen, setIsConfigOpen] = createSignal(true);

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
			setIsConfigOpen(false);
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
		<div class="min-h-screen bg-slate-900 text-slate-100 font-sans pb-24 md:pb-12">
			<div class="max-w-3xl mx-auto px-4 py-6 sm:px-6">
				<div class="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl mb-6 transition-all duration-300">
					<button
						type="button"
						onClick={() => setIsConfigOpen(!isConfigOpen())}
						class="w-full flex items-center justify-between p-4 md:p-6 text-left"
					>
						<h2 class="text-xl font-bold text-white flex items-center gap-2">
							<span class="w-1.5 h-6 bg-cyan-500 rounded-full" />
							Configuration
						</h2>
						<div class="text-slate-400">
							{isConfigOpen() ? (
								<ChevronUp size={20} />
							) : (
								<ChevronDown size={20} />
							)}
						</div>
					</button>

					<Show when={isConfigOpen()}>
						<div class="px-4 pb-6 md:px-6 md:pb-6 space-y-5 animate-fade-in">
							<div>
								<label
									for="country"
									class="block text-sm font-medium text-slate-400 mb-1.5"
								>
									Country
								</label>
								<div class="relative">
									<select
										id="country"
										value={country()}
										onChange={(e) => setCountry(e.target.value)}
										class="w-full h-12 bg-slate-900/50 border border-slate-600 rounded-xl px-4 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all appearance-none"
									>
										<For each={COUNTRIES}>
											{(c) => <option value={c.code}>{c.name}</option>}
										</For>
										<option value="OTHER">Other (Enter Code)</option>
									</select>
									<div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
										<ChevronDown size={18} />
									</div>
								</div>
								<Show when={country() === "OTHER"}>
									<input
										type="text"
										placeholder="e.g. BR"
										class="mt-3 w-full h-12 bg-slate-900/50 border border-slate-600 rounded-xl px-4 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
										onInput={(e) => setCountry(e.target.value.toUpperCase())}
									/>
								</Show>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<label
										for="state"
										class="block text-sm font-medium text-slate-400 mb-1.5"
									>
										Region <span class="text-slate-600">(Opt)</span>
									</label>
									<input
										id="state"
										type="text"
										value={region()}
										placeholder="e.g. NY"
										onInput={(e) => setRegion(e.target.value.toUpperCase())}
										class="w-full h-12 bg-slate-900/50 border border-slate-600 rounded-xl px-4 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
									/>
								</div>
								<div>
									<label
										for="year"
										class="block text-sm font-medium text-slate-400 mb-1.5"
									>
										Year
									</label>
									<input
										id="year"
										type="number"
										value={year()}
										min={new Date().getFullYear()}
										onInput={(e) => setYear(Number(e.target.value))}
										class="w-full h-12 bg-slate-900/50 border border-slate-600 rounded-xl px-4 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
									/>
								</div>
							</div>

							<div>
								<label
									for="allowance"
									class="block text-sm font-medium text-slate-400 mb-1.5"
								>
									Annual Leave Days
								</label>
								<div class="relative">
									<input
										id="allowance"
										type="number"
										value={allowance()}
										onInput={(e) => setAllowance(Number(e.target.value))}
										class="w-full h-12 bg-slate-900/50 border border-slate-600 rounded-xl px-4 text-white text-base focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
									/>
									<span class="absolute right-4 top-3 text-slate-500 text-sm font-medium">
										DAYS
									</span>
								</div>
							</div>
						</div>
					</Show>
				</div>

				<Show when={error()}>
					<div class="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
						<div class="mt-0.5">⚠️</div>
						<div>{error()}</div>
					</div>
				</Show>

				<Show when={results()}>
					{(res) => (
						<div class="space-y-6 animate-slide-up">
							<div class="grid grid-cols-2 gap-3">
								<div class="col-span-2 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 p-5 rounded-2xl text-center">
									<div class="text-sm text-cyan-200/80 uppercase tracking-wider font-semibold mb-1">
										Total Days Off
									</div>
									<div class="text-5xl font-bold text-white tracking-tight">
										{res().totalDaysOff}
									</div>
									<div class="text-sm text-cyan-300/60 mt-2">
										Using {res().totalLeaveDaysUsed} leave days
									</div>
								</div>

								<div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-center flex flex-col justify-center">
									<div class="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
										Efficiency
									</div>
									<div class="text-2xl font-bold text-cyan-400">
										{(
											res().totalDaysOff / (res().totalLeaveDaysUsed || 1)
										).toFixed(1)}
										x
									</div>
								</div>

								<div class="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl text-center flex flex-col justify-center">
									<div class="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
										Longest Break
									</div>
									<div class="text-2xl font-bold text-white">
										{Math.max(...res().leavePeriods.map((p) => p.daysOff), 0)}
										<span class="text-sm text-slate-500 font-normal ml-1">
											days
										</span>
									</div>
								</div>
							</div>

							<div class="bg-slate-800/80 p-1 rounded-xl flex border border-slate-700/50">
								<button
									type="button"
									onClick={() => setViewMode("list")}
									class={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
										viewMode() === "list"
											? "bg-slate-700 text-white shadow-sm"
											: "text-slate-400 hover:text-slate-200"
									}`}
								>
									<List size={16} />
									List
								</button>
								<button
									type="button"
									onClick={() => setViewMode("calendar")}
									class={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
										viewMode() === "calendar"
											? "bg-slate-700 text-white shadow-sm"
											: "text-slate-400 hover:text-slate-200"
									}`}
								>
									<Calendar size={16} />
									Calendar
								</button>
							</div>

							<Show when={viewMode() === "list"}>
								<div class="space-y-4">
									<For each={res().leavePeriods}>
										{(period) => (
											<div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 relative overflow-hidden group">
												<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-600" />

												<div class="flex justify-between items-start mb-4">
													<div>
														<div class="text-sm text-slate-400 mb-1">
															{dateFormatter.format(new Date(period.start))} -{" "}
															{dateFormatter.format(new Date(period.end))}
														</div>
														<div class="text-2xl font-bold text-white">
															{period.daysOff} Days Off
														</div>
													</div>
													<div class="bg-slate-700/50 px-3 py-1 rounded-lg text-xs font-mono text-cyan-300 border border-slate-600/50">
														-{period.leaveDaysRequired} Leave
													</div>
												</div>

												<div class="flex flex-wrap gap-2">
													<For each={period.holidays}>
														{(h) => (
															<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
																{h.name}
															</span>
														)}
													</For>
												</div>
											</div>
										)}
									</For>
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

			<div class="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 p-4 z-40">
				<div class="max-w-3xl mx-auto">
					<button
						onClick={handleMaximize}
						type="button"
						class="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg h-12 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
					>
						Maximize Leave
					</button>
				</div>
			</div>
		</div>
	);
}
