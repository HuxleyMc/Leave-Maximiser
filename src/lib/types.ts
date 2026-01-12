export interface PublicHoliday {
	date: string;
	name: string;
	localName: string;
	countryCode: string;
	fixed: boolean;
	global: boolean;
	counties: string[] | null;
	launchYear: number | null;
	types: string[];
}

export interface LeavePeriod {
	start: Date;
	end: Date;
	daysOff: number;
	leaveDaysRequired: number;
	holidays: PublicHoliday[];
}

export interface MaximizationResult {
	leavePeriods: LeavePeriod[];
	totalDaysOff: number;
	totalLeaveDaysUsed: number;
}
