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
		<>
			<Show when={props.leavePeriods.length > 0}>
				<CalendarLegend />
			</Show>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
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
		</>
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
		label: "Leave Day",
		colorClass: "bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20",
		title: "Day you need to book off",
	},
	{
		id: "period-leave",
		label: "Period Day",
		colorClass: "bg-cyan-500/20 text-cyan-200",
		title: "Weekend within your leave period",
	},
	{
		id: "holiday",
		label: "Public Holiday",
		colorClass: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
		title: "Official public holiday",
	},
	{
		id: "weekend",
		label: "Weekend",
		colorClass: "text-slate-600 bg-slate-800/30",
		title: "Weekend",
	},
];

function CalendarLegend() {
	return (
		<div class="flex flex-wrap gap-4 justify-center">
			<For each={LEGEND_ITEMS}>
				{(item) => (
					<div class="flex items-center gap-2">
						<div
							class={`w-4 h-4 rounded-sm ${item.colorClass}`}
							title={item.title}
						>
							&nbsp;
						</div>
						<span class="text-sm text-slate-300">{item.label}</span>
					</div>
				)}
			</For>
		</div>
	);
}

function MonthCard(props: MonthCardProps) {
	// Helper to get days in month
	const daysInMonth = () => {
		return new Date(props.year, props.monthIndex + 1, 0).getDate();
	};

	// Helper to get the day of the week the month starts on (0 = Mon, 6 = Sun)
	// JS getDay() returns 0 = Sun, 1 = Mon. We want 0 = Mon, 6 = Sun.
	const startOffset = () => {
		const day = new Date(props.year, props.monthIndex, 1).getDay();
		return day === 0 ? 6 : day - 1;
	};

	const monthName = () => {
		return new Date(props.year, props.monthIndex).toLocaleString("default", {
			month: "long",
		});
	};

	// Generate array of days to render including padding
	const calendarDays = () => {
		const days = [];
		const offset = startOffset();
		const totalDays = daysInMonth();

		// Padding for start of month
		for (let i = 0; i < offset; i++) {
			days.push(null);
		}

		// Actual days
		for (let i = 1; i <= totalDays; i++) {
			// Use UTC date to ensure consistency regardless of timezone
			days.push(new Date(Date.UTC(props.year, props.monthIndex, i)));
		}

		return days;
	};

	const getDayStatus = (date: Date) => {
		// Check if inside any leave period
		const activePeriod = props.leavePeriods.find((p) => {
			const start = new Date(p.start);
			const end = new Date(p.end);
			return date >= start && date <= end;
		});

		const isHoliday = isPublicHoliday(date, props.holidays);
		const isWknd = isWeekend(date);

		// If it's a public holiday, we want to show that distinctively,
		// even if it's inside a leave period.
		if (isHoliday) return "holiday";

		if (activePeriod) {
			if (isWknd) return "period-weekend";
			return "leave-day"; // This is a day you take off
		}

		if (isWknd) return "weekend";
		return "normal";
	};

	const getHolidayName = (date: Date) => {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(date.getUTCDate()).padStart(2, "0");
		const dateStr = `${year}-${month}-${day}`;

		const holiday = props.holidays.find((h) => h.date === dateStr);
		return holiday ? holiday.name : "";
	};

	return (
		<div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col">
			<h3 class="text-slate-200 font-semibold mb-3 text-center">
				{monthName()}
			</h3>

			<div class="grid grid-cols-7 gap-1 text-center">
				{/* Weekday Headers */}
				<For each={props.weekDays}>
					{(day) => (
						<div class="text-xs font-bold text-slate-500 py-1">{day}</div>
					)}
				</For>

				{/* Days */}
				<For each={calendarDays()}>
					{(date) => {
						if (!date) return <div class="aspect-square" />;

						const status = getDayStatus(date);
						const holidayName =
							status === "holiday" ? getHolidayName(date) : "";
						let dayClass =
							"aspect-square flex items-center justify-center text-xs rounded-md transition-all";

						switch (status) {
							case "leave-day":
								dayClass +=
									" bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 scale-110 z-10";
								break;
							case "period-weekend":
								dayClass += " bg-cyan-500/20 text-cyan-200";
								break;
							case "holiday":
								dayClass +=
									" bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold";
								break;
							case "weekend":
								dayClass += " text-slate-600 bg-slate-800/30";
								break;
							default:
								dayClass += " text-slate-400 hover:bg-slate-700/50";
						}

						return (
							<div class={dayClass} title={holidayName || status}>
								{date.getUTCDate()}
							</div>
						);
					}}
				</For>
			</div>
		</div>
	);
}
