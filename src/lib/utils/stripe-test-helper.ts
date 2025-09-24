/**
 * Stripe Test Helper Utilities
 *
 * This module provides utilities for testing Stripe integration
 * including test card numbers and payment scenarios.
 */

export interface StripeTestCard {
	number: string;
	brand: string;
	description: string;
	expectedOutcome: 'success' | 'decline' | 'error';
}

/**
 * Standard Stripe test card numbers for different scenarios
 */
export const STRIPE_TEST_CARDS: Record<string, StripeTestCard> = {
	// Successful payments
	visa: {
		number: '4242424242424242',
		brand: 'Visa',
		description: 'Succeeds and immediately processes the payment',
		expectedOutcome: 'success'
	},
	visaDebit: {
		number: '4000056655665556',
		brand: 'Visa',
		description: 'Debit card that succeeds',
		expectedOutcome: 'success'
	},
	mastercard: {
		number: '5555555555554444',
		brand: 'Mastercard',
		description: 'Succeeds and immediately processes the payment',
		expectedOutcome: 'success'
	},
	amex: {
		number: '378282246310005',
		brand: 'American Express',
		description: 'Succeeds and immediately processes the payment',
		expectedOutcome: 'success'
	},

	// Declined payments
	declinedCard: {
		number: '4000000000000002',
		brand: 'Visa',
		description: 'Declined with generic decline code',
		expectedOutcome: 'decline'
	},
	insufficientFunds: {
		number: '4000000000009995',
		brand: 'Visa',
		description: 'Declined with insufficient_funds code',
		expectedOutcome: 'decline'
	},
	lostCard: {
		number: '4000000000009987',
		brand: 'Visa',
		description: 'Declined with lost_card code',
		expectedOutcome: 'decline'
	},
	stolenCard: {
		number: '4000000000009979',
		brand: 'Visa',
		description: 'Declined with stolen_card code',
		expectedOutcome: 'decline'
	},

	// Error scenarios
	expiredCard: {
		number: '4000000000000069',
		brand: 'Visa',
		description: 'Declined with expired_card code',
		expectedOutcome: 'decline'
	},
	incorrectCvc: {
		number: '4000000000000127',
		brand: 'Visa',
		description: 'Declined with incorrect_cvc code',
		expectedOutcome: 'decline'
	},
	processingError: {
		number: '4000000000000119',
		brand: 'Visa',
		description: 'Declined with processing_error code',
		expectedOutcome: 'error'
	}
};

/**
 * Test payment scenarios for different outcomes
 */
export interface PaymentTestScenario {
	name: string;
	description: string;
	urlParams: string;
	expectedPaidState: boolean;
	expectedLocalStorage: string | null;
}

export const PAYMENT_TEST_SCENARIOS: PaymentTestScenario[] = [
	{
		name: 'successful_payment',
		description: 'User completes payment successfully',
		urlParams: '?paid=1',
		expectedPaidState: true,
		expectedLocalStorage: '1'
	},
	{
		name: 'successful_payment_with_session',
		description: 'User completes payment with Stripe session ID',
		urlParams: '?paid=1&session_id=cs_test_1234567890',
		expectedPaidState: true,
		expectedLocalStorage: '1'
	},
	{
		name: 'successful_payment_with_intent',
		description: 'User completes payment with payment intent',
		urlParams: '?paid=1&payment_intent=pi_test_1234567890',
		expectedPaidState: true,
		expectedLocalStorage: '1'
	},
	{
		name: 'cancelled_payment',
		description: 'User cancels payment at Stripe checkout',
		urlParams: '?cancelled=1',
		expectedPaidState: false,
		expectedLocalStorage: null
	},
	{
		name: 'failed_payment',
		description: 'Payment fails due to card decline',
		urlParams: '?paid=0',
		expectedPaidState: false,
		expectedLocalStorage: null
	},
	{
		name: 'error_payment',
		description: 'Payment encounters an error',
		urlParams: '?error=payment_failed',
		expectedPaidState: false,
		expectedLocalStorage: null
	}
];

/**
 * Validate that a URL is a proper Stripe Payment Link
 */
export function isValidStripePaymentLink(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return (
			urlObj.protocol === 'https:' &&
			urlObj.hostname === 'buy.stripe.com' &&
			urlObj.pathname.length > 1 &&
			(urlObj.pathname.includes('test_') || urlObj.pathname.includes('live_'))
		);
	} catch {
		return false;
	}
}

/**
 * Check if a Stripe Payment Link is in test mode
 */
export function isTestModePaymentLink(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return urlObj.pathname.startsWith('/test_');
	} catch {
		return false;
	}
}

/**
 * Generate test return URLs for different payment outcomes
 */
export function generateTestReturnUrl(baseUrl: string, scenario: PaymentTestScenario): string {
	return `${baseUrl}${scenario.urlParams}`;
}

/**
 * Simulate payment completion by generating appropriate return URL
 */
export function simulatePaymentCompletion(
	baseUrl: string = 'http://localhost:5173',
	outcome: 'success' | 'cancel' | 'error' = 'success'
): string {
	const scenarios = {
		success: '?paid=1&session_id=cs_test_' + Math.random().toString(36).substr(2, 9),
		cancel: '?cancelled=1',
		error: '?error=payment_failed'
	};

	return `${baseUrl}/${scenarios[outcome]}`;
}

/**
 * Test helper to validate payment link configuration
 */
export function validatePaymentLinkConfig(
	paymentUrl: string,
	returnUrl: string
): {
	isValid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Validate payment URL
	if (!paymentUrl) {
		errors.push('Payment URL is required');
	} else if (!isValidStripePaymentLink(paymentUrl)) {
		errors.push('Payment URL must be a valid Stripe Payment Link');
	} else if (paymentUrl === 'https://buy.stripe.com/test_xxx') {
		errors.push('Payment URL is using placeholder value');
	} else if (isTestModePaymentLink(paymentUrl)) {
		warnings.push('Payment Link is in test mode');
	}

	// Validate return URL
	if (!returnUrl) {
		errors.push('Return URL is required');
	} else {
		try {
			const returnUrlObj = new URL(returnUrl);
			if (returnUrlObj.protocol !== 'http:' && returnUrlObj.protocol !== 'https:') {
				errors.push('Return URL must use HTTP or HTTPS protocol');
			}
			if (!returnUrlObj.searchParams.has('paid')) {
				warnings.push('Return URL should include ?paid=1 parameter for payment confirmation');
			}
		} catch {
			errors.push('Return URL format is invalid');
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings
	};
}

/**
 * Mock Stripe checkout session for testing
 */
export interface MockStripeSession {
	id: string;
	payment_status: 'paid' | 'unpaid';
	payment_intent: string;
	customer_email?: string;
	success_url: string;
	cancel_url: string;
}

export function createMockStripeSession(
	returnUrl: string,
	status: 'paid' | 'unpaid' = 'paid'
): MockStripeSession {
	const sessionId = 'cs_test_' + Math.random().toString(36).substr(2, 9);
	const paymentIntentId = 'pi_test_' + Math.random().toString(36).substr(2, 9);

	return {
		id: sessionId,
		payment_status: status,
		payment_intent: paymentIntentId,
		customer_email: 'test@example.com',
		success_url: returnUrl + (returnUrl.includes('?') ? '&' : '?') + 'paid=1',
		cancel_url: returnUrl + (returnUrl.includes('?') ? '&' : '?') + 'cancelled=1'
	};
}

/**
 * Test data for comprehensive payment flow testing
 */
export const TEST_PAYMENT_AMOUNTS = [
	{ amount: 999, currency: 'usd', description: '$9.99 one-time payment' },
	{ amount: 2999, currency: 'usd', description: '$29.99 monthly subscription' },
	{ amount: 9999, currency: 'usd', description: '$99.99 annual subscription' }
];

/**
 * Common test assertions for payment integration
 */
export const PAYMENT_ASSERTIONS = {
	successfulPayment: {
		paidState: true,
		localStorageValue: '1',
		urlCleaned: true
	},
	failedPayment: {
		paidState: false,
		localStorageValue: null,
		urlCleaned: false
	},
	cancelledPayment: {
		paidState: false,
		localStorageValue: null,
		urlCleaned: false
	}
};
