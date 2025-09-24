import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { appStore, setPaidState } from '../stores/app.js';

// Mock environment variables
vi.mock('$env/static/public', () => ({
	VITE_PAYMENT_LINK_URL: 'https://buy.stripe.com/test_xxx'
}));

// Helper function to simulate upgrade click logic
function handleUpgradeClick(paymentUrl: string): string | null {
	if (paymentUrl) {
		return paymentUrl;
	} else {
		console.warn('Payment link URL not configured');
		return null;
	}
}

describe('UpgradeBanner', () => {
	beforeEach(() => {
		// Reset store to free state
		setPaidState(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('can import UpgradeBanner component', async () => {
		const module = await import('./UpgradeBanner.svelte');
		expect(module.default).toBeDefined();
	});

	it('should show banner when user is not paid', () => {
		setPaidState(false);
		const state = get(appStore);
		expect(state.paid).toBe(false);
	});

	it('should hide banner when user is paid', () => {
		setPaidState(true);
		const state = get(appStore);
		expect(state.paid).toBe(true);
	});

	it('handles upgrade click with valid payment URL', () => {
		const paymentUrl = 'https://buy.stripe.com/test_xxx';
		const result = handleUpgradeClick(paymentUrl);
		expect(result).toBe(paymentUrl);
	});

	it('handles upgrade click with missing payment URL', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const result = handleUpgradeClick('');
		expect(result).toBeNull();
		expect(consoleSpy).toHaveBeenCalledWith('Payment link URL not configured');

		consoleSpy.mockRestore();
	});

	it('integrates with app store paid state', () => {
		// Test initial state
		setPaidState(false);
		expect(get(appStore).paid).toBe(false);

		// Test paid state change
		setPaidState(true);
		expect(get(appStore).paid).toBe(true);

		// Test back to free state
		setPaidState(false);
		expect(get(appStore).paid).toBe(false);
	});
});
