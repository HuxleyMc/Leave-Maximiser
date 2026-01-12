import type { LeavePeriod, MaximizationResult, PublicHoliday } from "./types";

export function isWeekend(date: Date): boolean {
	const day = date.getDay();
	return day === 0 || day === 6;
}

export function isPublicHoliday(
	date: Date,
	holidays: PublicHoliday[],
): boolean {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const dateString = `${year}-${month}-${day}`;

	return holidays.some((h) => h.date === dateString);
}

export function isDayOff(date: Date, holidays: PublicHoliday[]): boolean {
	return isWeekend(date) || isPublicHoliday(date, holidays);
}

export function maximizeLeave(
	year: number,
	annualLeaveDays: number,
	holidays: PublicHoliday[],
): MaximizationResult {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31);

	const allDays: { date: Date; isOff: boolean }[] = [];
	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const current = new Date(d);
		allDays.push({
			date: current,
			isOff: isDayOff(current, holidays),
		});
	}

	const potentialPeriods: LeavePeriod[] = [];

	for (let i = 0; i < allDays.length; i++) {
		if (allDays[i].date < today) continue;

		for (let j = i + 2; j < Math.min(i + 20, allDays.length); j++) {
			const period = allDays.slice(i, j + 1);
			const leaveDaysNeeded = period.filter((d) => !d.isOff).length;

			if (leaveDaysNeeded > 0 && leaveDaysNeeded <= annualLeaveDays) {
				if (allDays[i].isOff && allDays[j].isOff) {
					const holidaysInPeriod = holidays.filter((h) => {
						const hDate = new Date(h.date);
						return hDate >= allDays[i].date && hDate <= allDays[j].date;
					});

					potentialPeriods.push({
						start: allDays[i].date,
						end: allDays[j].date,
						daysOff: period.length,
						leaveDaysRequired: leaveDaysNeeded,
						holidays: holidaysInPeriod,
					});
				}
			}
		}
	}

	potentialPeriods.sort((a, b) => {
		const efficiencyA = a.daysOff / a.leaveDaysRequired;
		const efficiencyB = b.daysOff / b.leaveDaysRequired;
		if (efficiencyB !== efficiencyA) return efficiencyB - efficiencyA;
		return b.daysOff - a.daysOff;
	});

	const selectedPeriods: LeavePeriod[] = [];
	let remainingLeave = annualLeaveDays;
	const usedDays = new Set<string>();

	for (const period of potentialPeriods) {
		if (period.leaveDaysRequired <= remainingLeave) {
			let overlaps = false;
			for (
				let d = new Date(period.start);
				d <= period.end;
				d.setDate(d.getDate() + 1)
			) {
				if (usedDays.has(d.toISOString().split("T")[0])) {
					overlaps = true;
					break;
				}
			}

			if (!overlaps) {
				selectedPeriods.push(period);
				remainingLeave -= period.leaveDaysRequired;
				for (
					let d = new Date(period.start);
					d <= period.end;
					d.setDate(d.getDate() + 1)
				) {
					usedDays.add(d.toISOString().split("T")[0]);
				}
			}
		}
	}

	return {
		leavePeriods: selectedPeriods.sort(
			(a, b) => a.start.getTime() - b.start.getTime(),
		),
		totalDaysOff: selectedPeriods.reduce((sum, p) => sum + p.daysOff, 0),
		totalLeaveDaysUsed: annualLeaveDays - remainingLeave,
	};
}
