import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { appStore, initializeStore } from './app';

// Mock window and localStorage for integration testing
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

describe('Payment Return Integration', () => {
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

	it('should handle complete payment flow from Stripe return', () => {
		// Simulate user returning from Stripe with payment confirmation
		mockLocation.search = '?paid=1';
		mockLocation.href = 'http://localhost:5173/?paid=1';

		// Mock URL constructor for URL cleaning
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

		// Initialize store (this would happen on app load)
		initializeStore();

		// Verify payment was confirmed
		const state = get(appStore);
		expect(state.paid).toBe(true);

		// Verify localStorage was updated
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paid', '1');

		// Verify URL was cleaned
		expect(mockHistory.replaceState).toHaveBeenCalledWith({}, '', 'http://localhost:5173/');
	});

	it('should handle subsequent app loads after payment', () => {
		// Simulate localStorage already has paid state
		mockLocalStorage.getItem.mockReturnValue('1');

		// No payment parameter in URL (user has already returned from payment)
		mockLocation.search = '';
		mockLocation.href = 'http://localhost:5173/';

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true);

		// Should read from localStorage
		expect(mockLocalStorage.getItem).toHaveBeenCalledWith('paid');

		// Should not try to clean URL or set localStorage again
		expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
		expect(mockHistory.replaceState).not.toHaveBeenCalled();
	});

	it('should handle payment return with additional URL parameters', () => {
		// Simulate return URL with other parameters
		mockLocation.search = '?paid=1&utm_source=stripe&session_id=cs_123';
		mockLocation.href = 'http://localhost:5173/?paid=1&utm_source=stripe&session_id=cs_123';

		// Mock URL constructor to preserve other parameters
		(global as any).URL = vi.fn().mockImplementation((url) => {
			const mockUrl = {
				searchParams: {
					has: vi.fn().mockReturnValue(true),
					delete: vi.fn()
				},
				toString: vi
					.fn()
					.mockReturnValue('http://localhost:5173/?utm_source=stripe&session_id=cs_123')
			};
			return mockUrl;
		});

		initializeStore();

		const state = get(appStore);
		expect(state.paid).toBe(true);

		// Should clean URL but preserve other parameters
		expect(mockHistory.replaceState).toHaveBeenCalledWith(
			{},
			'',
			'http://localhost:5173/?utm_source=stripe&session_id=cs_123'
		);
	});

	it('should handle multiple payment confirmations without issues', () => {
		// First payment confirmation
		mockLocation.search = '?paid=1';
		mockLocation.href = 'http://localhost:5173/?paid=1';

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

		initializeStore();

		expect(get(appStore).paid).toBe(true);
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paid', '1');

		// Reset mocks for second confirmation
		vi.clearAllMocks();
		mockLocalStorage.getItem.mockReturnValue('1'); // localStorage now has paid state

		// Second payment confirmation (user somehow got the URL again)
		initializeStore();

		// Should still be paid
		expect(get(appStore).paid).toBe(true);

		// Should set localStorage again (this is expected behavior for safety)
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith('paid', '1');
	});
});
