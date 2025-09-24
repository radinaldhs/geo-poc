<script lang="ts">
	import { onMount } from 'svelte';

	let activeTab: 'terms' | 'privacy' = 'terms';

	onMount(() => {
		// Set page title
		document.title = 'Legal - GEO POC';
	});
</script>

<svelte:head>
	<title>Legal - GEO POC</title>
	<meta name="description" content="Terms of Service and Privacy Policy for GEO POC" />
</svelte:head>

<!-- Navigation Header -->
<nav class="border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-black">GEO POC</a>
			</div>
			<div class="flex items-center space-x-4">
				<a href="/" class="text-gray-600 transition-colors duration-200 hover:text-light-blue">
					Home
				</a>
				<a
					href="/dashboard"
					class="text-gray-600 transition-colors duration-200 hover:text-light-blue"
				>
					Dashboard
				</a>
				<span class="font-semibold text-light-blue">Legal</span>
			</div>
		</div>
	</div>
</nav>

<!-- Breadcrumb Navigation -->
<div class="border-b border-gray-100 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center py-3 text-sm">
			<a href="/" class="text-gray-500 transition-colors duration-200 hover:text-gray-700">
				Home
			</a>
			<svg class="mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
			<span class="font-medium text-gray-900">Legal</span>
		</div>
	</div>
</div>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Legal Information</h1>
			<p class="text-gray-600">Terms of Service and Privacy Policy</p>
		</div>

		<!-- Navigation Tabs -->
		<div class="overflow-hidden rounded-2xl bg-white shadow-lg">
			<div class="border-b border-gray-200">
				<nav class="flex">
					<button
						class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 {activeTab ===
						'terms'
							? 'border-b-2 border-light-blue bg-light-blue/10 text-dark-blue'
							: 'text-gray-500 hover:text-gray-700'}"
						on:click={() => (activeTab = 'terms')}
					>
						Terms of Service
					</button>
					<button
						class="flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 {activeTab ===
						'privacy'
							? 'border-b-2 border-light-blue bg-light-blue/10 text-dark-blue'
							: 'text-gray-500 hover:text-gray-700'}"
						on:click={() => (activeTab = 'privacy')}
					>
						Privacy Policy
					</button>
				</nav>
			</div>

			<div class="p-8">
				{#if activeTab === 'terms'}
					<!-- Terms of Service Content -->
					<div class="prose max-w-none">
						<h2 class="mb-6 text-2xl font-bold text-gray-900">Terms of Service</h2>

						<div class="space-y-6 text-gray-700">
							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">1. Acceptance of Terms</h3>
								<p>
									By accessing and using the GEO POC dashboard ("Service"), you accept and agree to
									be bound by the terms and provision of this agreement.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">2. Description of Service</h3>
								<p>
									GEO POC is a demonstration application that provides simulated website analysis
									for search engine optimization insights. This is a proof-of-concept tool that uses
									mock data for demonstration purposes only.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">3. User Responsibilities</h3>
								<p>
									Users are responsible for providing accurate information and using the service in
									accordance with applicable laws and regulations. Users must not attempt to reverse
									engineer or exploit the demonstration system.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">4. Payment and Refunds</h3>
								<p>
									Payment processing is handled through Stripe in test mode. This is a demonstration
									application and no actual charges will be processed. All transactions are
									simulated for proof-of-concept purposes.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">5. Limitation of Liability</h3>
								<p>
									This is a demonstration application. The service is provided "as is" without
									warranties of any kind. The developers shall not be liable for any damages arising
									from the use of this demonstration tool.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">6. Modifications</h3>
								<p>
									We reserve the right to modify these terms at any time. Changes will be effective
									immediately upon posting to this page.
								</p>
							</section>
						</div>
					</div>
				{:else}
					<!-- Privacy Policy Content -->
					<div class="prose max-w-none">
						<h2 class="mb-6 text-2xl font-bold text-gray-900">Privacy Policy</h2>

						<div class="space-y-6 text-gray-700">
							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">1. Information We Collect</h3>
								<p>
									GEO POC is a demonstration application that operates entirely in your browser. We
									collect minimal information necessary for the demonstration:
								</p>
								<ul class="mt-2 list-inside list-disc space-y-1">
									<li>URLs you enter for analysis (processed locally, not stored)</li>
									<li>Payment status (stored locally in your browser)</li>
									<li>Basic usage analytics (if implemented)</li>
								</ul>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">2. How We Use Information</h3>
								<p>Information is used solely for demonstration purposes:</p>
								<ul class="mt-2 list-inside list-disc space-y-1">
									<li>Generate mock analysis results based on your input</li>
									<li>Maintain your paid status across browser sessions</li>
									<li>Provide personalized demonstration experience</li>
								</ul>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">3. Data Storage</h3>
								<p>
									All data is stored locally in your browser using localStorage. No personal
									information is transmitted to external servers except for payment processing
									through Stripe's secure platform.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">4. Third-Party Services</h3>
								<p>
									We use Stripe for payment processing in test mode. Stripe's privacy policy governs
									the handling of payment information. No actual charges are processed in this
									demonstration.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">5. Data Security</h3>
								<p>
									Since this is a client-side demonstration application, your data remains on your
									device. We implement standard web security practices to protect the demonstration
									experience.
								</p>
							</section>

							<section>
								<h3 class="mb-3 text-lg font-semibold text-gray-900">6. Contact Information</h3>
								<p>
									For questions about this privacy policy or the demonstration application, please
									contact the development team through the project repository.
								</p>
							</section>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Navigation Links -->
		<div class="mt-8 space-x-4 text-center">
			<a
				href="/"
				class="inline-flex items-center rounded-lg bg-light-blue px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-dark-blue"
			>
				← Back to Home
			</a>
			<a
				href="/dashboard"
				class="inline-flex items-center rounded-lg border border-light-blue px-6 py-3 font-medium text-light-blue transition-colors duration-200 hover:bg-light-blue hover:text-white"
			>
				Go to Dashboard →
			</a>
		</div>
	</div>
</div>

<style>
	.prose {
		color: inherit;
	}
	.prose h2,
	.prose h3 {
		color: inherit;
	}
</style>
