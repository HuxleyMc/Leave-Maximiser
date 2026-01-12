import { Store } from "@tanstack/store";

export interface AppState {
	countryCode: string;
	stateCode: string;
	annualLeave: number;
	year: number;
}

const currentYear = new Date().getFullYear();

export const store = new Store<AppState>({
	countryCode: "AU",
	stateCode: "QLD",
	annualLeave: 20,
	year: currentYear,
});

export const updateState = (updates: Partial<AppState>) => {
	store.setState((state) => ({
		...state,
		...updates,
	}));
};
