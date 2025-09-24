import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import {
	appStore,
	initializeStore,
	startScan,
	completeScan,
	errorScan,
	resetScan,
	setPaidState,
	upgradeToPaid,
	improveScore,
	type AppState
} from './app.js';
import type { GeoResult } from '../types.js';

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

// Mock window object for Node.js environment
Object.defineProperty(globalThis, 'window', {
	value: {
		localStorage: localStorageMock
	},
	writable: true
});

describe('App Store', () => {
	beforeEach(() => {
		// Reset store to initial state
		appStore.set({
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
		});

		// Clear localStorage mock
		vi.clearAllMocks();
	});

	describe('Initial State', () => {
		it('should have correct initial state', () => {
			const state = get(appStore);
			expect(state.paid).toBe(false);
			expect(state.scan.status).toBe('idle');
			expect(state.scan.url).toBe('');
		});
	});

	describe('localStorage Integration', () => {
		it('should initialize paid state from localStorage when paid=1', () => {
			localStorageMock.getItem.mockReturnValue('1');

			initializeStore();

			const state = get(appStore);
			expect(state.paid).toBe(true);
			expect(localStorageMock.getItem).toHaveBeenCalledWith('paid');
		});

		it('should initialize paid state as false when localStorage is empty', () => {
			localStorageMock.getItem.mockReturnValue(null);

			initializeStore();

			const state = get(appStore);
			expect(state.paid).toBe(false);
		});

		it('should handle localStorage unavailable gracefully', () => {
			localStorageMock.getItem.mockImplementation(() => {
				throw new Error('localStorage unavailable');
			});

			// Should not throw
			expect(() => initializeStore()).not.toThrow();

			const state = get(appStore);
			expect(state.paid).toBe(false);
		});

		it('should persist paid state to localStorage', () => {
			setPaidState(true);

			expect(localStorageMock.setItem).toHaveBeenCalledWith('paid', '1');

			const state = get(appStore);
			expect(state.paid).toBe(true);
		});

		it('should handle localStorage setItem errors gracefully', () => {
			localStorageMock.setItem.mockImplementation(() => {
				throw new Error('localStorage unavailable');
			});

			// Should not throw
			expect(() => setPaidState(true)).not.toThrow();

			const state = get(appStore);
			expect(state.paid).toBe(true);
		});
	});

	describe('Scan Lifecycle', () => {
		it('should start scan correctly', () => {
			const testUrl = 'https://example.com';

			startScan(testUrl);

			const state = get(appStore);
			expect(state.scan.url).toBe(testUrl);
			expect(state.scan.status).toBe('loading');
			expect(state.scan.result).toBeUndefined();
			expect(state.scan.error).toBeUndefined();
		});

		it('should complete scan with result', () => {
			const testUrl = 'https://example.com';
			const mockResult: GeoResult = {
				url: testUrl,
				overallScore: 75,
				testedQueries: [],
				citations: [],
				recommendations: {
					headline: 'Test',
					faqs: [],
					jsonldType: 'FAQPage',
					jsonldSnippet: ''
				}
			};

			startScan(testUrl);
			completeScan(mockResult);

			const state = get(appStore);
			expect(state.scan.status).toBe('done');
			expect(state.scan.result).toEqual(mockResult);
			expect(state.scan.error).toBeUndefined();
		});

		it('should handle scan error', () => {
			const testUrl = 'https://example.com';
			const errorMessage = 'Network error';

			startScan(testUrl);
			errorScan(errorMessage);

			const state = get(appStore);
			expect(state.scan.status).toBe('error');
			expect(state.scan.error).toBe(errorMessage);
			expect(state.scan.result).toBeUndefined();
		});

		it('should reset scan state', () => {
			const testUrl = 'https://example.com';

			startScan(testUrl);
			resetScan();

			const state = get(appStore);
			expect(state.scan.url).toBe('');
			expect(state.scan.status).toBe('idle');
			expect(state.scan.result).toBeUndefined();
			expect(state.scan.error).toBeUndefined();
		});
	});

	describe('Paid State Management', () => {
		it('should set paid state to true', () => {
			setPaidState(true);

			const state = get(appStore);
			expect(state.paid).toBe(true);
		});

		it('should set paid state to false', () => {
			setPaidState(true);
			setPaidState(false);

			const state = get(appStore);
			expect(state.paid).toBe(false);
		});

		it('should upgrade to paid using convenience function', () => {
			upgradeToPaid();

			const state = get(appStore);
			expect(state.paid).toBe(true);
			expect(localStorageMock.setItem).toHaveBeenCalledWith('paid', '1');
		});
	});

	describe('State Persistence', () => {
		it('should maintain scan state when updating paid state', () => {
			const testUrl = 'https://example.com';

			startScan(testUrl);
			setPaidState(true);

			const state = get(appStore);
			expect(state.paid).toBe(true);
			expect(state.scan.url).toBe(testUrl);
			expect(state.scan.status).toBe('loading');
		});
	});

	describe('Score Improvement', () => {
		it('should improve score by 10 points when called', () => {
			const mockResult: GeoResult = {
				url: 'https://example.com',
				overallScore: 50,
				testedQueries: [
					{ query: 'test query 1', score: 80, cited: false },
					{ query: 'test query 2', score: 60, cited: true }
				],
				citations: [],
				recommendations: {
					headline: 'Test',
					faqs: [],
					jsonldType: 'FAQPage',
					jsonldSnippet: ''
				}
			};

			completeScan(mockResult);
			improveScore();

			const state = get(appStore);
			expect(state.scan.result?.overallScore).toBe(60);
		});

		it('should cap score improvement at 100', () => {
			const mockResult: GeoResult = {
				url: 'https://example.com',
				overallScore: 95,
				testedQueries: [{ query: 'test query 1', score: 80, cited: false }],
				citations: [],
				recommendations: {
					headline: 'Test',
					faqs: [],
					jsonldType: 'FAQPage',
					jsonldSnippet: ''
				}
			};

			completeScan(mockResult);
			improveScore();

			const state = get(appStore);
			expect(state.scan.result?.overallScore).toBe(100);
		});

		it('should flip first uncited query to cited', () => {
			const mockResult: GeoResult = {
				url: 'https://example.com',
				overallScore: 50,
				testedQueries: [
					{ query: 'test query 1', score: 80, cited: true },
					{ query: 'test query 2', score: 60, cited: false },
					{ query: 'test query 3', score: 70, cited: false }
				],
				citations: [],
				recommendations: {
					headline: 'Test',
					faqs: [],
					jsonldType: 'FAQPage',
					jsonldSnippet: ''
				}
			};

			completeScan(mockResult);
			improveScore();

			const state = get(appStore);
			expect(state.scan.result?.testedQueries[0].cited).toBe(true); // unchanged
			expect(state.scan.result?.testedQueries[1].cited).toBe(true); // flipped
			expect(state.scan.result?.testedQueries[2].cited).toBe(false); // unchanged
		});

		it('should handle case with no uncited queries', () => {
			const mockResult: GeoResult = {
				url: 'https://example.com',
				overallScore: 50,
				testedQueries: [
					{ query: 'test query 1', score: 80, cited: true },
					{ query: 'test query 2', score: 60, cited: true }
				],
				citations: [],
				recommendations: {
					headline: 'Test',
					faqs: [],
					jsonldType: 'FAQPage',
					jsonldSnippet: ''
				}
			};

			completeScan(mockResult);
			improveScore();

			const state = get(appStore);
			expect(state.scan.result?.overallScore).toBe(60); // still improved
			expect(state.scan.result?.testedQueries[0].cited).toBe(true);
			expect(state.scan.result?.testedQueries[1].cited).toBe(true);
		});

		it('should do nothing if no scan result exists', () => {
			resetScan();
			improveScore();

			const state = get(appStore);
			expect(state.scan.result).toBeUndefined();
		});
	});
});
