import { Store } from "@tanstack/store";

export interface AppState {
	countryCode: string;
	stateCode: string;
	annualLeave: number;
	year: number;
}

export const store = new Store<AppState>({
	countryCode: "AU",
	stateCode: "QLD",
	annualLeave: 20,
	year: 2025,
});

export const updateState = (updates: Partial<AppState>) => {
	store.setState((state) => ({
		...state,
		...updates,
	}));
};
