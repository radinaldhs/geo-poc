import { writable } from 'svelte/store';
import type { GeoResult } from '../types.js';
import { validateEnvironmentConfig } from '../utils/env.js';

export interface AppState {
	paid: boolean;
	scan: {
		url: string;
		status: 'idle' | 'loading' | 'done' | 'error';
		result?: GeoResult;
		error?: string;
	};
	environment: {
		isValid: boolean;
		errors: string[];
		warnings: string[];
	};
}

// Initial state
const initialState: AppState = {
	paid: false,
	scan: {
		url: '',
		status: 'idle'
	},
	environment: {
		isValid: true,
		errors: [],
		warnings: []
	}
};

// Create the main app store
export const appStore = writable<AppState>(initialState);

// Helper function to safely access localStorage
function getStoredPaidState(): boolean {
	try {
		if (typeof window !== 'undefined' && window.localStorage) {
			const stored = window.localStorage.getItem('paid');
			return stored === '1';
		}
	} catch (error) {
		console.warn('localStorage unavailable, defaulting to free mode:', error);
	}
	return false;
}

// Helper function to safely set localStorage
function setStoredPaidState(paid: boolean): void {
	try {
		if (typeof window !== 'undefined' && window.localStorage) {
			window.localStorage.setItem('paid', paid ? '1' : '0');
		}
	} catch (error) {
		console.warn('localStorage unavailable, paid state not persisted:', error);
	}
}

// Helper function to check for payment confirmation URL parameter
function checkPaymentConfirmation(): boolean {
	try {
		if (typeof window !== 'undefined' && window.location) {
			const urlParams = new URLSearchParams(window.location.search);
			return urlParams.get('paid') === '1';
		}
	} catch (error) {
		console.warn('Unable to check URL parameters:', error);
	}
	return false;
}

// Helper function to remove payment parameter from URL
function removePaymentParameter(): void {
	try {
		if (typeof window !== 'undefined' && window.history && window.location) {
			const url = new URL(window.location.href);
			if (url.searchParams.has('paid')) {
				url.searchParams.delete('paid');
				window.history.replaceState({}, '', url.toString());
			}
		}
	} catch (error) {
		console.warn('Unable to clean URL parameters:', error);
	}
}

// Initialize store from localStorage and URL parameters on app start
export function initializeStore(): void {
	// Validate environment configuration
	const envConfig = validateEnvironmentConfig();

	// Check for payment confirmation first
	const paymentConfirmed = checkPaymentConfirmation();

	if (paymentConfirmed) {
		// Set paid state in localStorage
		setStoredPaidState(true);
		// Remove the parameter from URL
		removePaymentParameter();
		// Update store state
		appStore.update((state) => ({
			...state,
			paid: true,
			environment: envConfig
		}));
	} else {
		// Use stored state from localStorage
		const storedPaidState = getStoredPaidState();
		appStore.update((state) => ({
			...state,
			paid: storedPaidState,
			environment: envConfig
		}));
	}

	// Log environment warnings and errors
	if (envConfig.warnings.length > 0) {
		console.warn('Environment configuration warnings:', envConfig.warnings);
	}
	if (envConfig.errors.length > 0) {
		console.error('Environment configuration errors:', envConfig.errors);
	}
}

// Store update functions for scan lifecycle
export function startScan(url: string): void {
	appStore.update((state) => ({
		...state,
		scan: {
			url,
			status: 'loading'
		}
	}));
}

export function completeScan(result: GeoResult): void {
	appStore.update((state) => ({
		...state,
		scan: {
			...state.scan,
			status: 'done',
			result,
			error: undefined
		}
	}));
}

export function errorScan(error: string): void {
	appStore.update((state) => ({
		...state,
		scan: {
			...state.scan,
			status: 'error',
			error,
			result: undefined
		}
	}));
}

export function resetScan(): void {
	appStore.update((state) => ({
		...state,
		scan: {
			url: '',
			status: 'idle'
		}
	}));
}

// Paid state management
export function setPaidState(paid: boolean): void {
	setStoredPaidState(paid);
	appStore.update((state) => ({
		...state,
		paid
	}));
}

// Convenience function to upgrade to paid
export function upgradeToPaid(): void {
	setPaidState(true);
}

// Re-score functionality for paid users
export function improveScore(): void {
	appStore.update((state) => {
		if (!state.scan.result) return state;

		// Increase score by 10, capped at 100
		const newScore = Math.min(state.scan.result.overallScore + 10, 100);

		// Find the first uncited query and flip it to cited
		const updatedQueries = [...state.scan.result.testedQueries];
		const uncitedIndex = updatedQueries.findIndex((q) => !q.cited);
		if (uncitedIndex !== -1) {
			updatedQueries[uncitedIndex] = {
				...updatedQueries[uncitedIndex],
				cited: true
			};
		}

		return {
			...state,
			scan: {
				...state.scan,
				result: {
					...state.scan.result,
					overallScore: newScore,
					testedQueries: updatedQueries
				}
			}
		};
	});
}
