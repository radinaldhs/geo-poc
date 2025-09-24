<script lang="ts">
	import { appStore } from '../stores/app.js';
	import { getPaymentLinkUrl } from '../utils/env.js';

	// Reactive subscription to paid state
	$: paid = $appStore.paid;

	let paymentError = '';
	let isRedirecting = false;

	function handleUpgradeClick() {
		if (isRedirecting) return; // Prevent double-clicks

		try {
			isRedirecting = true;
			paymentError = '';

			// Get payment URL with fallback handling
			const paymentUrl = getPaymentLinkUrl();

			// Validate URL before redirecting
			if (!paymentUrl || paymentUrl === 'https://buy.stripe.com/test_xxx') {
				throw new Error('Payment system is not properly configured');
			}

			// Validate that it's a proper Stripe URL
			if (!paymentUrl.startsWith('https://buy.stripe.com/')) {
				throw new Error('Invalid payment URL configuration');
			}

			// Add a small delay to show loading state
			setTimeout(() => {
				window.location.href = paymentUrl;
			}, 100);
		} catch (error) {
			console.error('Failed to redirect to payment page:', error);
			paymentError =
				error instanceof Error ? error.message : 'Payment system temporarily unavailable';
			isRedirecting = false;
		}
	}
</script>

{#if !paid}
	<div class="top-0 from-light-blue to-dark-blue text-white shadow-lg sticky z-50 bg-gradient-to-r">
		<div class="max-w-7xl px-4 py-3 mx-auto">
			<div class="flex items-center justify-between">
				<div class="space-x-3 flex items-center">
					<svg class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-sm font-medium">
						Unlock full analysis insights and advanced features
					</span>
				</div>
				<button
					on:click={handleUpgradeClick}
					disabled={isRedirecting}
					class="space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-dark-blue shadow-sm hover:bg-gray-100 inline-flex items-center transition-colors duration-200 {isRedirecting
						? 'cursor-not-allowed opacity-75'
						: ''}"
				>
					{#if isRedirecting}
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{/if}
					<span>{isRedirecting ? 'Redirecting...' : 'Upgrade Now'}</span>
				</button>
			</div>
		</div>
		{#if paymentError}
			<div class="mt-2 border-red-200 bg-red-100 px-4 py-2 border-t">
				<div class="flex items-center justify-between">
					<p class="text-sm text-red-700">{paymentError}</p>
					<button
						on:click={() => {
							paymentError = '';
						}}
						class="text-sm text-red-600 hover:text-red-800 underline"
					>
						Dismiss
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
