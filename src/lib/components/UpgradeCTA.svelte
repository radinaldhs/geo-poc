<script lang="ts">
	import { getPaymentLinkUrl } from '../utils/env.js';

	export let variant: 'button' | 'link' | 'card' = 'button';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let text: string = 'Upgrade';
	export let description: string = '';

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

	// Size classes
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	// Variant classes
	const variantClasses = {
		button:
			'bg-light-blue hover:bg-dark-blue text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm',
		link: 'text-light-blue hover:text-dark-blue font-medium underline',
		card: 'bg-light-blue/10 hover:bg-light-blue/20 text-dark-blue font-semibold rounded-lg border border-light-blue/30 transition-colors duration-200'
	};
</script>

{#if variant === 'button' || variant === 'card'}
	<button
		on:click={handleUpgradeClick}
		disabled={isRedirecting}
		class="{variantClasses[variant]} {sizeClasses[
			size
		]} space-x-2 inline-flex items-center {isRedirecting ? 'cursor-not-allowed opacity-75' : ''}"
	>
		{#if isRedirecting}
			<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		{:else}
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		{/if}
		<span>{isRedirecting ? 'Redirecting...' : text}</span>
	</button>
{:else}
	<button
		on:click={handleUpgradeClick}
		disabled={isRedirecting}
		class="{variantClasses[variant]} space-x-1 inline-flex items-center {isRedirecting
			? 'cursor-not-allowed opacity-75'
			: ''}"
	>
		{#if isRedirecting}
			<svg class="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		{:else}
			<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		{/if}
		<span>{isRedirecting ? 'Redirecting...' : text}</span>
	</button>
{/if}

{#if description}
	<p class="mt-1 text-xs text-gray-600">{description}</p>
{/if}

{#if paymentError}
	<div class="mt-2 rounded-md border-red-200 bg-red-50 p-2 border">
		<p class="text-xs text-red-600">{paymentError}</p>
		<button
			on:click={() => {
				paymentError = '';
			}}
			class="mt-1 text-xs text-red-500 hover:text-red-700 underline"
		>
			Dismiss
		</button>
	</div>
{/if}
