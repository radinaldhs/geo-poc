<script lang="ts">
	import { getPaymentLinkUrl } from '$lib/utils/env.js';
	import { generateAnalyticsData } from '../mock/analytics-data.js';

	export let score = 0;
	export let summary = '';
	export let loading = false;
	export let error = undefined;
	export let onRetry = undefined;
	export let url = '';
	export let isPaid = false;

	let analyticsData = null;

	// Calculate the stroke-dasharray for the circular progress
	$: circumference = 2 * Math.PI * 45; // radius = 45
	$: strokeDasharray = circumference;
	$: strokeDashoffset = circumference - (score / 100) * circumference;

	// Generate summary text based on score if not provided
	$: defaultSummary =
		score >= 80
			? 'Excellent GEO performance with strong AI visibility'
			: score >= 60
				? 'Good GEO performance with optimization opportunities'
				: score >= 40
					? 'Fair GEO performance requiring strategic improvements'
					: 'Poor GEO performance needing comprehensive optimization';

	$: displaySummary = summary || defaultSummary;

	// Generate analytics data when score changes
	$: if (score > 0 && url) {
		analyticsData = generateAnalyticsData(score, url);
	}

	// Get score color based on performance
	$: scoreColor =
		score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

	// Get performance level
	$: performanceLevel =
		score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';

	let isRedirecting = false;

	function handleUpgradeClick() {
		if (isRedirecting) return; // Prevent double-clicks

		try {
			isRedirecting = true;

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

<div class="space-y-6">
	{#if error}
		<!-- Error State -->
		<div class="rounded-2xl bg-white p-8 shadow-lg text-center">
			<div class="space-y-4">
				<div class="text-red-600">
					<svg class="mb-4 h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-900">Analysis Failed</h3>
				<p class="text-gray-600">{error}</p>
				{#if onRetry}
					<button
						onclick={onRetry}
						class="rounded-lg bg-light-blue px-6 py-2 font-medium text-white hover:bg-dark-blue transition-colors"
					>
						Try Again
					</button>
				{/if}
			</div>
		</div>
	{:else if loading}
		<!-- Loading State -->
		<div class="rounded-2xl bg-white p-8 shadow-lg text-center">
			<div class="animate-fade-in space-y-6">
				<div class="h-32 w-32 relative mx-auto">
					<div class="inset-0 animate-pulse border-gray-200 absolute rounded-full border-8"></div>
					<div
						class="animate-spin-slow inset-0 border-t-light-blue/30 absolute rounded-full border-8"
					></div>
					<div class="inset-0 absolute flex items-center justify-center">
						<div class="shimmer h-8 w-16 rounded bg-gray-200"></div>
					</div>
				</div>
				<div class="space-y-2">
					<div class="shimmer h-4 rounded bg-gray-200 mx-auto w-3/4"></div>
					<div class="shimmer h-4 rounded bg-gray-200 mx-auto w-1/2"></div>
				</div>
				<div class="text-center">
					<p class="animate-pulse text-sm text-gray-500">Analyzing your website...</p>
				</div>
			</div>
		</div>
	{:else if analyticsData}
		<!-- Analytics Dashboard -->
		<div class="animate-fade-in space-y-6">
			<!-- Main Score Card -->
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<div class="gap-8 lg:grid-cols-3 grid grid-cols-1">
					<!-- Score Display -->
					<div class="text-center">
						<div class="mb-4 h-32 w-32 relative mx-auto">
							<svg class="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
								<circle cx="50" cy="50" r="45" stroke="#e5e7eb" stroke-width="8" fill="none" />
								<circle
									cx="50"
									cy="50"
									r="45"
									stroke={scoreColor}
									stroke-width="8"
									fill="none"
									stroke-dasharray={strokeDasharray}
									stroke-dashoffset={strokeDashoffset}
									stroke-linecap="round"
									class="ease-out transition-all duration-2000"
								/>
							</svg>
							<div class="inset-0 absolute flex items-center justify-center">
								<span class="text-4xl font-bold text-gray-900">{score}</span>
							</div>
						</div>
						<h3 class="mb-2 text-xl font-semibold text-gray-900">GEO Score</h3>
						<p class="mb-4 text-gray-600">{displaySummary}</p>
						<div
							class="px-3 py-1 text-sm font-medium inline-flex items-center rounded-full"
							style="background-color: {scoreColor}20; color: {scoreColor}"
						>
							{performanceLevel} Performance
						</div>
						{#if !isPaid}
							<div class="mt-4 text-xs text-gray-500">
								<p>🔒 Unlock detailed scoring breakdown for $4.99/month</p>
							</div>
						{/if}
					</div>
					<!-- Key Metrics -->
					<div class="space-y-4">
						<h4 class="text-lg font-semibold text-gray-900">Key Metrics</h4>
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Total Queries</span>
								<span class="font-semibold">{analyticsData.metrics.totalQueries}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Cited Queries</span>
								<span class="font-semibold text-green-600"
									>{analyticsData.metrics.citedQueries}</span
								>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Authority Score</span>
								<span class="font-semibold">{analyticsData.metrics.authorityScore}/100</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">Visibility Trend</span>
								<span
									class="font-semibold {analyticsData.metrics.visibilityTrend >= 0
										? 'text-green-600'
										: 'text-red-600'}"
								>
									{analyticsData.metrics.visibilityTrend >= 0 ? '+' : ''}{analyticsData.metrics
										.visibilityTrend}%
								</span>
							</div>

							{#if !isPaid}
								<!-- Blurred Premium Metrics -->
								<div class="mt-4 border-gray-200 pt-4 relative border-t">
									<div class="blur-sm pointer-events-none">
										<div class="mb-2 flex items-center justify-between">
											<span class="text-sm text-gray-600">AI Citation Rate</span>
											<span class="font-semibold text-light-blue">87%</span>
										</div>
										<div class="mb-2 flex items-center justify-between">
											<span class="text-sm text-gray-600">Competitor Gap</span>
											<span class="font-semibold text-purple-600">+23 pts</span>
										</div>
										<div class="flex items-center justify-between">
											<span class="text-sm text-gray-600">Growth Velocity</span>
											<span class="font-semibold text-emerald-600">+15%/mo</span>
										</div>
									</div>
									<div
										class="inset-0 rounded-lg bg-white/80 absolute flex items-center justify-center"
									>
										<div class="text-center">
											<div class="mb-1 text-xs font-medium text-gray-700">🚀 Premium Metrics</div>
											<div class="text-xs text-gray-500">$4.99/month</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					</div>
					<!-- Score History -->
					<div class="relative">
						<h4 class="mb-4 text-lg font-semibold text-gray-900">30-Day Trend</h4>
						<div class="px-2 relative flex h-[200px] items-end justify-between">
							{#each analyticsData.scoreHistory.slice(-7) as item, i}
								<div class="space-y-1 flex flex-col items-center">
									<div
										class="animate-fade-in w-6 rounded-t ease-out transition-all duration-500"
										style="height: {(item.score / 100) *
											160}px; background-color: {scoreColor}; animation-delay: {i * 100}ms"
									></div>
									<span class="text-xs text-gray-500">
										{new Date(item.date).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric'
										})}
									</span>
								</div>
							{/each}
						</div>
						{#if !isPaid}
							<div
								class="top-8 right-2 w-20 from-white via-white/90 pr-2 absolute flex h-full items-center justify-end bg-gradient-to-l to-transparent"
							>
								<div class="text-center">
									<div class="mb-1 text-xs font-medium text-gray-600">📊</div>
									<div class="text-xs leading-tight text-gray-500">
										Full<br />History<br />$4.99/mo
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<!-- Performance Breakdown -->
			<div class="gap-6 lg:grid-cols-2 grid grid-cols-1">
				<!-- Category Performance -->
				<div class="rounded-2xl bg-white p-6 shadow-lg relative">
					<h4 class="mb-4 text-lg font-semibold text-gray-900">Performance Categories</h4>
					<div class="space-y-4">
						{#each analyticsData.categoryScores as category, i}
							<div class="animate-fade-in space-y-2" style="animation-delay: {i * 100}ms">
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium text-gray-700">{category.category}</span>
									<span
										class="text-sm font-bold"
										style="color: {category.score >= 70
											? '#10b981'
											: category.score >= 40
												? '#f59e0b'
												: '#ef4444'}">{category.score}</span
									>
								</div>
								<div class="h-2 bg-gray-200 w-full rounded-full">
									<div
										class="h-2 ease-out rounded-full transition-all duration-1000"
										style="width: {category.score}%; background-color: {category.score >= 70
											? '#10b981'
											: category.score >= 40
												? '#f59e0b'
												: '#ef4444'}; animation-delay: {i * 200}ms"
									></div>
								</div>
							</div>
						{/each}

						{#if !isPaid}
							<!-- Blurred Additional Categories -->
							<div class="mt-4 border-gray-200 pt-4 relative border-t">
								<div class="space-y-2 blur-sm pointer-events-none">
									<div class="animate-fade-in space-y-2">
										<div class="flex items-center justify-between">
											<span class="text-sm font-medium text-gray-700">AI Readiness</span>
											<span class="text-sm font-bold text-light-blue">92</span>
										</div>
										<div class="h-2 bg-gray-200 w-full rounded-full">
											<div class="h-2 bg-light-blue rounded-full" style="width: 92%"></div>
										</div>
									</div>
									<div class="animate-fade-in space-y-2">
										<div class="flex items-center justify-between">
											<span class="text-sm font-medium text-gray-700">Voice Search Opt.</span>
											<span class="text-sm font-bold text-purple-600">78</span>
										</div>
										<div class="h-2 bg-gray-200 w-full rounded-full">
											<div class="h-2 bg-purple-500 rounded-full" style="width: 78%"></div>
										</div>
									</div>
								</div>
								<div
									class="inset-0 rounded-lg bg-white/85 absolute flex items-center justify-center"
								>
									<div class="text-center">
										<div class="mb-1 text-sm font-medium text-gray-700">🎯 Advanced Categories</div>
										<div class="text-xs text-gray-500">Unlock 12+ metrics for $4.99/month</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
				<!-- Query Distribution -->
				<div class="rounded-2xl bg-white p-6 shadow-lg">
					<h4 class="mb-4 text-lg font-semibold text-gray-900">Query Score Distribution</h4>
					<div class="space-y-4">
						{#if analyticsData}
							{@const queryScores = analyticsData.queryPerformance.map((q) => q.score)}
							{@const distributionData = [
								{
									range: '0-25',
									count: queryScores.filter((s) => s <= 25).length,
									color: '#ef4444'
								},
								{
									range: '26-50',
									count: queryScores.filter((s) => s > 25 && s <= 50).length,
									color: '#f97316'
								},
								{
									range: '51-75',
									count: queryScores.filter((s) => s > 50 && s <= 75).length,
									color: '#f59e0b'
								},
								{
									range: '76-100',
									count: queryScores.filter((s) => s > 75).length,
									color: '#10b981'
								}
							]}
							{@const total = distributionData.reduce((sum, d) => sum + d.count, 0)}

							{#each distributionData as item, i}
								{#if item.count > 0}
									<div
										class="animate-fade-in flex items-center justify-between"
										style="animation-delay: {i * 150}ms"
									>
										<div class="space-x-3 flex items-center">
											<div class="h-4 w-4 rounded" style="background-color: {item.color}"></div>
											<span class="text-sm font-medium text-gray-700">{item.range} points</span>
										</div>
										<div class="space-x-2 flex items-center">
											<div class="h-2 w-20 bg-gray-200 rounded-full">
												<div
													class="h-2 ease-out rounded-full transition-all duration-1000"
													style="width: {total > 0
														? (item.count / total) * 100
														: 0}%; background-color: {item.color}; animation-delay: {i * 200}ms"
												></div>
											</div>
											<span class="w-8 text-sm font-bold text-gray-900 text-right"
												>{item.count}</span
											>
										</div>
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- Competitor Analysis -->
			<div class="rounded-2xl bg-white shadow-lg {!isPaid ? 'relative' : ''}">
				{#if !isPaid}
					<div
						class="inset-0 from-orange-500/10 to-red-600/10 backdrop-blur-sm absolute z-10 flex items-center justify-center bg-gradient-to-br"
					>
						<div class="mx-4 max-w-sm rounded-xl bg-white/90 p-6 shadow-lg text-center">
							<div class="mb-3">
								<svg
									class="h-10 w-10 text-orange-600 mx-auto"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 class="mb-2 text-lg font-bold text-gray-900">🎯 Spy on Competitors</h3>
							<p class="mb-3 text-sm text-gray-600">
								See exactly how you stack up against competitors in AI search results. Discover
								their winning strategies!
							</p>
							<div class="mb-3 rounded-lg border-orange-200 bg-orange-50 p-2 border">
								<div class="text-sm flex items-center justify-between">
									<span class="font-medium text-gray-700">Competitor Intelligence</span>
									<span class="font-bold text-orange-600">$4.99/mo</span>
								</div>
							</div>
							<button
								class="rounded-lg from-orange-600 to-red-600 px-5 py-2 text-sm font-semibold text-white hover:from-orange-700 hover:to-red-700 w-full bg-gradient-to-r transition-all"
								>🔓 Start Free Trial</button
							>
						</div>
					</div>
				{/if}
				<div class="{!isPaid ? 'blur-sm' : ''} p-6">
					<h4 class="mb-4 text-lg font-semibold text-gray-900">Competitive Landscape</h4>
					<div class="space-y-3">
						{#each analyticsData.competitorComparison as competitor, i}
							<div
								class="animate-fade-in flex items-center justify-between"
								style="animation-delay: {i * 100}ms"
							>
								<span class="text-sm font-medium text-gray-700 flex-1">{competitor.name}</span>
								<div class="space-x-2 flex flex-1 items-center">
									<div class="h-3 bg-gray-200 w-full rounded-full">
										<div
											class="h-3 ease-out rounded-full transition-all duration-1000"
											style="width: {competitor.score}%; background-color: {i === 0
												? scoreColor
												: '#94a3b8'}; animation-delay: {i * 200}ms"
										></div>
									</div>
									<span class="w-8 text-sm font-bold text-gray-900 text-right"
										>{competitor.score}</span
									>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Final Premium CTA -->
			{#if !isPaid}
				<div
					class="rounded-2xl border-indigo-200 from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-lg border bg-gradient-to-br"
				>
					<div class="text-center">
						<div class="mb-4">
							<div
								class="mb-4 h-16 w-16 from-indigo-500 to-purple-600 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br"
							>
								<svg
									class="h-8 w-8 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
						</div>
						<h3 class="mb-3 text-2xl font-bold text-gray-900">Ready to Dominate AI Search?</h3>
						<p class="mb-6 max-w-2xl text-gray-600 mx-auto">
							Join thousands of marketers who've increased their AI visibility by 300%+ with our
							premium insights. Get the complete GEO toolkit for less than a coffee per week.
						</p>

						<div class="mb-6 max-w-3xl gap-4 md:grid-cols-3 mx-auto grid grid-cols-1">
							<div class="rounded-lg border-indigo-200 bg-white/70 p-4 border">
								<div class="mb-2 text-2xl">🎯</div>
								<div class="mb-1 font-semibold text-gray-900">25+ GEO Factors</div>
								<div class="text-sm text-gray-600">Complete optimization matrix</div>
							</div>
							<div class="rounded-lg border-purple-200 bg-white/70 p-4 border">
								<div class="mb-2 text-2xl">🤖</div>
								<div class="mb-1 font-semibold text-gray-900">AI Recommendations</div>
								<div class="text-sm text-gray-600">Personalized action plans</div>
							</div>
							<div class="rounded-lg border-pink-200 bg-white/70 p-4 border">
								<div class="mb-2 text-2xl">📊</div>
								<div class="mb-1 font-semibold text-gray-900">Competitor Intel</div>
								<div class="text-sm text-gray-600">Spy on top performers</div>
							</div>
						</div>

						<div class="mb-6 max-w-sm rounded-xl border-indigo-300 bg-white/80 p-4 mx-auto border">
							<div class="flex items-center justify-between">
								<div class="text-left">
									<div class="text-lg font-bold text-gray-900">Complete GEO Suite</div>
									<div class="text-sm text-gray-600">Everything you need to win</div>
								</div>
								<div class="text-right">
									<div class="text-3xl font-bold text-indigo-600">$4.99</div>
									<div class="text-sm text-gray-500">/month</div>
								</div>
							</div>
						</div>

						<button
							class="mb-4 max-w-md rounded-xl from-indigo-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white hover:shadow-xl mx-auto block w-full cursor-pointer bg-gradient-to-r transition-all duration-300 hover:scale-105"
							onclick={handleUpgradeClick}
						>
							🚀 Start Your Free Trial Now
						</button>

						<div class="space-x-6 text-sm text-gray-500 flex items-center justify-center">
							<div class="flex items-center">
								<svg class="mr-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								7-day free trial
							</div>
							<div class="flex items-center">
								<svg class="mr-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								Cancel anytime
							</div>
							<div class="flex items-center">
								<svg class="mr-1 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								No setup fees
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes shimmer {
		0% {
			background-position: -200px 0;
		}
		100% {
			background-position: calc(200px + 100%) 0;
		}
	}

	.shimmer {
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200px 100%;
		animation: shimmer 1.5s infinite;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: translateY(10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out;
	}

	@keyframes spin-slow {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.animate-spin-slow {
		animation: spin-slow 2s linear infinite;
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
