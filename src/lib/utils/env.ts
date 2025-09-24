/**
 * Environment variable utilities with graceful fallbacks
 */

// Development fallback values
const FALLBACK_VALUES = {
	VITE_APP_NAME: 'GEO POC',
	VITE_PAYMENT_LINK_URL: 'https://buy.stripe.com/test_00g5lq9Ej4Qs8Vy6oo',
	VITE_RETURN_URL: 'http://localhost:5173/dashboard?paid=1',
	VITE_STRIPE_SECRET_KEY: ''
} as const;

/**
 * Safely get environment variable with fallback
 */
function getEnvVar(key: keyof typeof FALLBACK_VALUES): string {
	try {
		// Try to get from import.meta.env first
		const value = import.meta.env[key];
		if (value !== undefined && value !== '') {
			return value;
		}

		// Fall back to default value
		const fallback = FALLBACK_VALUES[key];
		if (fallback === '') {
			console.warn(`Environment variable ${key} is not set and has no fallback value`);
		} else {
			console.warn(`Environment variable ${key} is not set, using fallback: ${fallback}`);
		}

		return fallback;
	} catch (error) {
		console.warn(`Error accessing environment variable ${key}, using fallback:`, error);
		return FALLBACK_VALUES[key];
	}
}

/**
 * Get application name
 */
export function getAppName(): string {
	return getEnvVar('VITE_APP_NAME');
}

/**
 * Get Stripe payment link URL
 */
export function getPaymentLinkUrl(): string {
	const url = getEnvVar('VITE_PAYMENT_LINK_URL');

	// Validate URL format
	try {
		new URL(url);
		return url;
	} catch (error) {
		console.error('Invalid payment link URL format:', url, error);
		return FALLBACK_VALUES.VITE_PAYMENT_LINK_URL;
	}
}

/**
 * Get return URL for payment confirmation
 */
export function getReturnUrl(): string {
	const url = getEnvVar('VITE_RETURN_URL');

	// Validate URL format
	try {
		new URL(url);
		return url;
	} catch (error) {
		console.error('Invalid return URL format:', url, error);
		return FALLBACK_VALUES.VITE_RETURN_URL;
	}
}

/**
 * Get Stripe secret key (for development/testing only)
 */
export function getStripeSecretKey(): string {
	return getEnvVar('VITE_STRIPE_SECRET_KEY');
}

/**
 * Check if all required environment variables are properly configured
 */
export function validateEnvironmentConfig(): {
	isValid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Check payment link URL
	const paymentUrl = getEnvVar('VITE_PAYMENT_LINK_URL');
	if (!paymentUrl) {
		errors.push('VITE_PAYMENT_LINK_URL is required for payment functionality');
	} else if (paymentUrl === 'https://buy.stripe.com/test_xxx') {
		errors.push(
			'VITE_PAYMENT_LINK_URL is using placeholder value - update with real Stripe Payment Link'
		);
	} else if (!paymentUrl.startsWith('https://buy.stripe.com/')) {
		errors.push('VITE_PAYMENT_LINK_URL must be a valid Stripe Payment Link URL');
	} else if (paymentUrl.includes('/test_')) {
		warnings.push('Using Stripe test mode - ensure this is intentional for your environment');
	}

	// Check return URL
	const returnUrl = getEnvVar('VITE_RETURN_URL');
	if (!returnUrl) {
		errors.push('VITE_RETURN_URL is required for payment confirmation');
	}

	// Check app name
	const appName = getEnvVar('VITE_APP_NAME');
	if (!appName) {
		warnings.push('VITE_APP_NAME not set, using default');
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}
