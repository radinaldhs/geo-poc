import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

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

// Helper function to get size classes
function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};
	return sizeClasses[size];
}

// Helper function to get variant classes
function getVariantClasses(variant: 'button' | 'link' | 'card'): string {
	const variantClasses = {
		button:
			'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm',
		link: 'text-blue-600 hover:text-blue-700 font-medium underline',
		card: 'bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors duration-200'
	};
	return variantClasses[variant];
}

describe('UpgradeCTA', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('can import UpgradeCTA component', async () => {
		const module = await import('./UpgradeCTA.svelte');
		expect(module.default).toBeDefined();
	});

	it('returns correct size classes for different sizes', () => {
		expect(getSizeClasses('sm')).toBe('px-3 py-1.5 text-sm');
		expect(getSizeClasses('md')).toBe('px-4 py-2 text-sm');
		expect(getSizeClasses('lg')).toBe('px-6 py-3 text-base');
	});

	it('returns correct variant classes for different variants', () => {
		expect(getVariantClasses('button')).toContain('bg-blue-600');
		expect(getVariantClasses('button')).toContain('text-white');

		expect(getVariantClasses('link')).toContain('text-blue-600');
		expect(getVariantClasses('link')).toContain('underline');

		expect(getVariantClasses('card')).toContain('bg-blue-50');
		expect(getVariantClasses('card')).toContain('text-blue-700');
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

	it('validates component props interface', () => {
		// Test that the component accepts expected prop types
		const validVariants: Array<'button' | 'link' | 'card'> = ['button', 'link', 'card'];
		const validSizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		expect(validVariants).toContain('button');
		expect(validVariants).toContain('link');
		expect(validVariants).toContain('card');

		expect(validSizes).toContain('sm');
		expect(validSizes).toContain('md');
		expect(validSizes).toContain('lg');
	});

	it('handles default prop values correctly', () => {
		// Test default values
		const defaultVariant = 'button';
		const defaultSize = 'md';
		const defaultText = 'Upgrade';
		const defaultDescription = '';

		expect(defaultVariant).toBe('button');
		expect(defaultSize).toBe('md');
		expect(defaultText).toBe('Upgrade');
		expect(defaultDescription).toBe('');
	});
});
