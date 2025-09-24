import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { appStore, initializeStore } from './app';

// Mock window and localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn()
};

const mockHistory = {
	replaceState: vi.fn()
};

const mockLocation = {
	href: 'http://localhost:5173/',
	search: ''
};

Object.defineProperty(window, 'localStorage', {
	value: mockLocalStorage,
	writable: true
});

Object.defineProperty(window, 'history', {
	value: mockHistory,
	writable: true
});

Object.defineProperty(window, 'location', {
	value: mockLocation,
	writable: true
});

describe('Payment Return Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks();
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
		mockLocation.search = '';
		mockLocation.href = 'http://localhost:5173/';
	});

	it('should detect payment confirmation from URL parameter', () => {
		// Mock URL with paid=1 parameter
		mockLocation.search = '?paid=1';
		mockLocation.href = 'http://localhost:5173/?paid=1';

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true);
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paid', '1');
		expect(mockHistory.replaceState).toHaveBeenCalled();
	});

	it('should handle multiple payment confirmations gracefully', () => {
		// First payment confirmation
		mockLocation.search = '?paid=1';
		mockLocation.href = 'http://localhost:5173/?paid=1';

		initializeStore();

		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paid', '1');

		// Second payment confirmation (should not cause issues)
		vi.clearAllMocks();
		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true);
	});

	it('should use localStorage state when no payment parameter present', () => {
		mockLocalStorage.getItem.mockReturnValue('1');

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true);
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('paid');
	});

	it('should default to free mode when localStorage returns null', () => {
		mockLocalStorage.getItem.mockReturnValue(null);

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(false);
	});

	it('should handle localStorage unavailable gracefully', () => {
		// Mock localStorage to throw error
		mockLocalStorage.getItem.mockImplementation(() => {
			throw new Error('localStorage unavailable');
		});

		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(false);
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('localStorage unavailable'),
			expect.any(Error)
		);

		consoleSpy.mockRestore();
	});

	it('should remove paid parameter from URL after processing', () => {
		mockLocation.search = '?paid=1&other=value';
		mockLocation.href = 'http://localhost:5173/?paid=1&other=value';

		// Mock URL constructor
		(global as any).URL = vi.fn().mockImplementation((url) => {
			const mockUrl = {
				searchParams: {
					has: vi.fn().mockReturnValue(true),
					delete: vi.fn(),
					get: vi.fn().mockReturnValue('1')
				},
				toString: vi.fn().mockReturnValue('http://localhost:5173/?other=value')
			};
			return mockUrl;
		});

		initializeStore();

		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{},
			'',
			'http://localhost:5173/?other=value'
		);
	});

	it('should handle URL parameter parsing errors gracefully', () => {
		// Mock URLSearchParams to throw error
		global.URLSearchParams = vi.fn().mockImplementation(() => {
			throw new Error('URLSearchParams error');
		});

		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(false);
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('Unable to check URL parameters'),
			expect.any(Error)
		);

		consoleSpy.mockRestore();
	});

	it('should handle history.replaceState unavailable gracefully', () => {
		mockLocation.search = '?paid=1';
		mockLocation.href = 'http://localhost:5173/?paid=1';

		// Mock URL constructor to work properly for payment detection
		global.URLSearchParams = vi.fn().mockImplementation((search) => ({
			get: vi.fn().mockReturnValue('1')
		}));

		// Mock history to exist but replaceState to throw error
		Object.defineProperty(window, 'history', {
			value: {
				replaceState: vi.fn().mockImplementation(() => {
					throw new Error('replaceState unavailable');
				})
			},
			writable: true
		});

		// Mock URL constructor to work for URL cleaning
		(global as any).URL = vi.fn().mockImplementation((url) => {
			const mockUrl = {
				searchParams: {
					has: vi.fn().mockReturnValue(true),
					delete: vi.fn()
				},
				toString: vi.fn().mockReturnValue('http://localhost:5173/')
			};
			return mockUrl;
		});

		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true); // Should still set paid state
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('Unable to clean URL parameters'),
			expect.any(Error)
		);

		consoleSpy.mockRestore();
	});
});
