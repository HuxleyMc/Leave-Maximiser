import { describe, expect, test } from "vitest";
import { isPublicHoliday, isWeekend, maximizeLeave } from "./maximiser";
import type { PublicHoliday } from "./types";

describe("maximiser", () => {
	const mockHolidays: PublicHoliday[] = [
		{
			date: "2025-01-01",
			name: "New Year Day",
			localName: "New Year Day",
			countryCode: "AU",
			fixed: true,
			global: true,
			counties: null,
			launchYear: null,
			types: ["Public"],
		},
		{
			date: "2025-01-26",
			name: "Australia Day",
			localName: "Australia Day",
			countryCode: "AU",
			fixed: true,
			global: true,
			counties: null,
			launchYear: null,
			types: ["Public"],
		},
	];

	test("isWeekend returns true for Saturday and Sunday", () => {
		expect(isWeekend(new Date("2025-01-04"))).toBe(true);
		expect(isWeekend(new Date("2025-01-05"))).toBe(true);
		expect(isWeekend(new Date("2025-01-06"))).toBe(false);
	});

	test("isPublicHoliday identifies holidays correctly", () => {
		expect(isPublicHoliday(new Date("2025-01-01"), mockHolidays)).toBe(true);
		expect(isPublicHoliday(new Date("2025-01-02"), mockHolidays)).toBe(false);
	});

	test("maximizeLeave returns efficient leave periods", () => {
		const result = maximizeLeave(2025, 2, mockHolidays);
		expect(result.leavePeriods.length).toBeGreaterThan(0);
		const period = result.leavePeriods[0];
		expect(period.daysOff).toBe(5);
		expect(period.leaveDaysRequired).toBe(2);
	});
});
