import { For, Show } from "solid-js";
import { isPublicHoliday, isWeekend } from "../lib/maximiser";
import type { LeavePeriod, PublicHoliday } from "../lib/types";

interface CalendarViewProps {
	year: number;
	holidays: PublicHoliday[];
	leavePeriods: LeavePeriod[];
}

export default function CalendarView(props: CalendarViewProps) {
	const months = Array.from({ length: 12 }, (_, i) => i);
	const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

	return (
		<div class="space-y-6">
			<Show when={props.leavePeriods.length > 0}>
				<CalendarLegend />
			</Show>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
				<For each={months}>
					{(monthIndex) => (
						<MonthCard
							monthIndex={monthIndex}
							year={props.year}
							holidays={props.holidays}
							leavePeriods={props.leavePeriods}
							weekDays={weekDays}
						/>
					)}
				</For>
			</div>
		</div>
	);
}

interface MonthCardProps {
	monthIndex: number;
	year: number;
	holidays: PublicHoliday[];
	leavePeriods: LeavePeriod[];
	weekDays: string[];
}

const LEGEND_ITEMS = [
	{
		id: "leave-day",
		label: "Take Leave",
		colorClass: "bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20",
	},
	{
		id: "holiday",
		label: "Public Holiday",
		colorClass: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
	},
];

function CalendarLegend() {
	return (
		<div class="flex flex-wrap gap-4 justify-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
			<For each={LEGEND_ITEMS}>
				{(item) => (
					<div class="flex items-center gap-2">
						<div class={`w-3.5 h-3.5 rounded-md ${item.colorClass}`}>
							&nbsp;
						</div>
						<span class="text-xs font-medium text-slate-300">{item.label}</span>
					</div>
				)}
			</For>
		</div>
	);
}

function MonthCard(props: MonthCardProps) {
	const daysInMonth = () => {
		return new Date(props.year, props.monthIndex + 1, 0).getDate();
	};

	const startOffset = () => {
		const day = new Date(props.year, props.monthIndex, 1).getDay();
		return day === 0 ? 6 : day - 1;
	};

	const monthName = () => {
		return new Date(props.year, props.monthIndex).toLocaleString("default", {
			month: "long",
		});
	};

	const calendarDays = () => {
		const days = [];
		const offset = startOffset();
		const totalDays = daysInMonth();

		for (let i = 0; i < offset; i++) {
			days.push(null);
		}

		for (let i = 1; i <= totalDays; i++) {
			days.push(new Date(Date.UTC(props.year, props.monthIndex, i)));
		}

		return days;
	};

	const getDayStatus = (date: Date) => {
		const activePeriod = props.leavePeriods.find((p) => {
			const start = new Date(p.start);
			const end = new Date(p.end);
			return date >= start && date <= end;
		});

		const isHoliday = isPublicHoliday(date, props.holidays);
		const isWknd = isWeekend(date);

		if (isHoliday) return "holiday";

		if (activePeriod) {
			if (isWknd) return "period-weekend";
			return "leave-day";
		}

		if (isWknd) return "weekend";
		return "normal";
	};

	return (
		<div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col">
			<h3 class="text-slate-200 font-semibold mb-3 text-center text-sm uppercase tracking-wide">
				{monthName()}
			</h3>

			<div class="grid grid-cols-7 gap-1 text-center">
				<For each={props.weekDays}>
					{(day) => (
						<div class="text-[10px] font-bold text-slate-500 py-1">{day}</div>
					)}
				</For>

				<For each={calendarDays()}>
					{(date) => {
						if (!date) return <div class="aspect-square" />;

						const status = getDayStatus(date);
						let dayClass =
							"aspect-square flex items-center justify-center text-xs rounded-md transition-all cursor-default select-none";

						switch (status) {
							case "leave-day":
								dayClass +=
									" bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 z-10";
								break;
							case "period-weekend":
								dayClass += " bg-cyan-500/10 text-cyan-200/70";
								break;
							case "holiday":
								dayClass +=
									" bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold";
								break;
							case "weekend":
								dayClass += " text-slate-600 bg-slate-800/30";
								break;
							default:
								dayClass += " text-slate-400";
						}

						return <div class={dayClass}>{date.getUTCDate()}</div>;
					}}
				</For>
			</div>
		</div>
	);
}
