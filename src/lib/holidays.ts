import Holidays from "date-holidays";
import type { PublicHoliday } from "./types";

export function getHolidays(
	countryCode: string,
	year: number,
	state?: string,
): PublicHoliday[] {
	const hd = new Holidays();

	if (state) {
		hd.init(countryCode, state);
	} else {
		hd.init(countryCode);
	}

	const holidays = hd.getHolidays(year).filter((h) => h.type === "public");

	return holidays.map((h) => ({
		date: h.date.split(" ")[0],
		name: h.name,
		localName: h.name,
		countryCode: countryCode,
		fixed: h.type === "public",
		global: !state,
		counties: state ? [state] : null,
		launchYear: null,
		types: [h.type],
	}));
}

export function getSupportedCountries() {
	const hd = new Holidays();
	return hd.getCountries();
}

export function getSupportedStates(countryCode: string) {
	const hd = new Holidays();
	return hd.getStates(countryCode);
}
