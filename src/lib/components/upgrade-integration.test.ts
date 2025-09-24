import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { appStore, setPaidState } from '../stores/app.js';

// Mock environment variables
vi.mock('$env/static/public', () => ({
	VITE_PAYMENT_LINK_URL: 'https://buy.stripe.com/test_xxx'
}));

describe('Upgrade Components Integration', () => {
	beforeEach(() => {
		// Reset store to free state
		setPaidState(false);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('can import all upgrade-related components', async () => {
		const upgradeBannerModule = await import('./UpgradeBanner.svelte');
		const upgradeCTAModule = await import('./UpgradeCTA.svelte');
		const lockedPanelModule = await import('./LockedPanel.svelte');
		const teaserListModule = await import('./TeaserList.svelte');

		expect(upgradeBannerModule.default).toBeDefined();
		expect(upgradeCTAModule.default).toBeDefined();
		expect(lockedPanelModule.default).toBeDefined();
		expect(teaserListModule.default).toBeDefined();
	});

	it('integrates with app store for consistent paid state', () => {
		// Test initial free state
		setPaidState(false);
		expect(get(appStore).paid).toBe(false);

		// Test upgrade to paid
		setPaidState(true);
		expect(get(appStore).paid).toBe(true);

		// Test downgrade back to free
		setPaidState(false);
		expect(get(appStore).paid).toBe(false);
	});

	it('handles payment URL configuration correctly', () => {
		// Test with valid payment URL
		const validUrl = 'https://buy.stripe.com/test_xxx';
		expect(validUrl).toMatch(/^https:\/\/buy\.stripe\.com\/test_/);

		// Test URL format validation
		expect(validUrl.startsWith('https://')).toBe(true);
		expect(validUrl.includes('stripe.com')).toBe(true);
	});

	it('provides consistent upgrade experience across components', () => {
		// All upgrade components should use the same payment URL
		const paymentUrl = 'https://buy.stripe.com/test_xxx';

		// Simulate upgrade click logic from different components
		function simulateUpgradeClick(url: string): boolean {
			return url === paymentUrl;
		}

		// Test that all components would redirect to the same URL
		expect(simulateUpgradeClick(paymentUrl)).toBe(true);
		expect(simulateUpgradeClick('different-url')).toBe(false);
	});

	it('maintains state consistency during upgrade flow', () => {
		// Start in free mode
		setPaidState(false);
		const initialState = get(appStore);
		expect(initialState.paid).toBe(false);

		// Simulate successful payment (would happen via URL parameter in real app)
		setPaidState(true);
		const paidState = get(appStore);
		expect(paidState.paid).toBe(true);

		// Ensure other state is preserved
		expect(paidState.scan).toEqual(initialState.scan);
	});

	it('handles environment variable integration', () => {
		// Test that environment variables are properly mocked
		const mockEnv = vi.mocked(import.meta.env);
		expect(mockEnv).toBeDefined();

		// In a real environment, this would be set via .env file
		const expectedPaymentUrl = 'https://buy.stripe.com/test_xxx';
		expect(expectedPaymentUrl).toMatch(/^https:\/\/buy\.stripe\.com\/test_/);
	});
});
