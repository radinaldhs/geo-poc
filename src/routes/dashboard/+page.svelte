<script lang="ts">
	import {
		CitationAnalysis,
		DashboardLayout,
		DetailedQueryList,
		ExportOptions,
		LockedPanel,
		QuickEditPanel,
		ScoreCard,
		TeaserList,
		UpgradeBanner,
		UrlInput
	} from '$lib/components';
	import {
		getMockError,
		getProcessingDelay,
		mockResultFor,
		shouldSimulateError
	} from '$lib/mock/data';
	import { appStore, completeScan, errorScan, improveScore, startScan } from '$lib/stores/app';
	import type { ContentEdits } from '$lib/types';
	import { onMount } from 'svelte';

	// Reactive statements for store state
	$: isPaid = $appStore.paid;
	$: scanState = $appStore.scan;
	$: isLoading = scanState.status === 'loading';
	$: hasError = scanState.status === 'error';
	$: hasResult = scanState.status === 'done' && scanState.result;
	$: result = scanState.result;

	function handleSubmit(url: string) {
		startScan(url);

		// Simulate processing delay
		const delay = getProcessingDelay();

		setTimeout(() => {
			// Check if we should simulate an error
			if (shouldSimulateError(url)) {
				const error = getMockError();
				errorScan(error.message);
			} else {
				// Generate mock result
				const mockResult = mockResultFor(url);
				completeScan(mockResult);
			}
		}, delay);
	}

	function handleRetry() {
		if (scanState.url) {
			handleSubmit(scanState.url);
		}
	}

	function handleReScore(edits: ContentEdits) {
		console.log('Re-scoring with edits:', edits);
		improveScore();
	}
</script>

<svelte:head>
	<title>Dashboard - GEO POC</title>
	<meta
		name="description"
		content="Analyze your website's performance in AI-powered search results"
	/>
</svelte:head>

<DashboardLayout currentPage="dashboard">
	<!-- Upgrade Banner (only show if not paid) -->
	{#if !isPaid}
		<UpgradeBanner />
	{/if}

	<!-- For non-paid users, show navigation header -->
	{#if !isPaid}
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
						<span class="font-semibold text-light-blue">Dashboard</span>
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
					<span class="font-medium text-gray-900">Dashboard</span>
				</div>
			</div>
		</div>
	{/if}

	<div class={isPaid ? '' : 'min-h-screen bg-gray-50 py-12'}>
		<div class={isPaid ? '' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
			<!-- Header (only for non-paid users) -->
			{#if !isPaid}
				<div class="mb-12 text-center">
					<h1 class="mb-4 text-4xl font-bold text-black">Website Analysis Dashboard</h1>
					<p class="text-lg text-gray-600">
						Analyze your website's performance in AI-powered search results
					</p>
				</div>
			{/if}

			<!-- URL Input Section -->
			<div class="mb-8">
				<UrlInput onSubmit={handleSubmit} disabled={isLoading} />
			</div>

			<!-- Results Section -->
			{#if isLoading || hasError || hasResult}
				<!-- Score Card -->
				<div class="mb-8 transition-all duration-500 ease-out">
					<ScoreCard
						score={result?.overallScore ?? 0}
						summary={result ? 'Analysis complete - see detailed insights below' : ''}
						loading={isLoading}
						error={hasError ? scanState.error : undefined}
						onRetry={hasError ? handleRetry : undefined}
						url={scanState.url}
						{isPaid}
					/>
				</div>

				<!-- Results Layout -->
				{#if hasResult && result}
					{#if isPaid}
						<!-- Paid User: Detailed Analysis Components -->
						<div class="animate-fade-in-up mb-8 space-y-8">
							<!-- Detailed Query Analysis -->
							<div class="transition-all duration-700 ease-out" style="animation-delay: 100ms">
								<DetailedQueryList queries={result.testedQueries} loading={isLoading} />
							</div>

							<!-- Citation Analysis -->
							<div class="transition-all duration-700 ease-out" style="animation-delay: 200ms">
								<CitationAnalysis citations={result.citations} loading={isLoading} />
							</div>

							<!-- Recommendations Panel -->
							<div class="transition-all duration-700 ease-out" style="animation-delay: 300ms">
								<div
									class="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 ease-out"
								>
									<h3 class="mb-4 text-xl font-semibold text-black">Recommendations</h3>
									<div class="space-y-6">
										<div>
											<h4 class="mb-3 font-medium text-black">Suggested Title Optimization</h4>
											<div class="rounded-lg border-l-4 border-light-blue/30 bg-light-blue/5 p-4">
												<p class="leading-relaxed text-gray-800">
													{result.recommendations.headline}
												</p>
											</div>
										</div>
										<div>
											<h4 class="mb-3 font-medium text-black">FAQ Content Suggestions</h4>
											<div class="space-y-4">
												{#each result.recommendations.faqs as faq, index}
													<div class="rounded-lg border border-gray-200 p-4">
														<div class="mb-2 flex items-center justify-between">
															<h5 class="font-medium text-black">FAQ #{index + 1}</h5>
															<span class="text-xs text-gray-500">Recommended</span>
														</div>
														<div class="space-y-2">
															<div>
																<span class="text-sm font-medium text-gray-700">Q:</span>
																<p class="text-sm text-gray-800">{faq.q}</p>
															</div>
															<div>
																<span class="text-sm font-medium text-gray-700">A:</span>
																<p class="text-sm text-gray-600">{faq.a}</p>
															</div>
														</div>
													</div>
												{/each}
											</div>
										</div>
										<div>
											<h4 class="mb-3 font-medium text-black">Structured Data Schema</h4>
											<div class="flex items-center space-x-3">
												<span
													class="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800"
												>
													{result.recommendations.jsonldType}
												</span>
												<span class="text-sm text-gray-600"
													>Recommended schema type for your content</span
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<!-- Free User: Three-Panel Teaser Layout -->
						<div class="animate-fade-in-up mb-8 grid gap-6 lg:grid-cols-3">
							<!-- Queries Panel -->
							<div
								class="transition-all duration-700 ease-out lg:col-span-1"
								style="animation-delay: 100ms"
							>
								<TeaserList
									items={result.testedQueries}
									visibleCount={2}
									locked={true}
									title="Tested Queries"
									loading={isLoading}
								>
									<div slot="default" let:item>
										<div class="flex items-center justify-between">
											<div class="flex-1">
												<p class="font-medium text-black">{item.query}</p>
												<p class="text-sm text-gray-600">Score: {item.score}/100</p>
											</div>
											<div class="ml-4 flex items-center">
												{#if item?.cited === true}
													<span
														class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
													>
														✓ Cited
													</span>
												{:else}
													<span
														class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
													>
														✗ Not Cited
													</span>
												{/if}
											</div>
										</div>
									</div>
								</TeaserList>
							</div>

							<!-- Citations Panel -->
							<div
								class="transition-all duration-700 ease-out lg:col-span-1"
								style="animation-delay: 200ms"
							>
								<TeaserList
									items={result.citations}
									visibleCount={1}
									locked={true}
									title="Citations Found"
									loading={isLoading}
								>
									<div slot="default" let:item>
										<div class="space-y-2">
											<div class="flex items-center justify-between">
												<p class="font-medium text-black">{item.source}</p>
												<span
													class="inline-flex items-center rounded-full bg-light-blue/10 px-2 py-1 text-xs font-medium text-dark-blue capitalize"
												>
													{item.position}
												</span>
											</div>
											<p class="text-sm leading-relaxed text-gray-700">{item.excerpt}</p>
										</div>
									</div>
								</TeaserList>
							</div>

							<!-- Recommendations Panel -->
							<div
								class="transition-all duration-700 ease-out lg:col-span-1"
								style="animation-delay: 300ms"
							>
								<LockedPanel locked={true} upgradeText="Unlock detailed recommendations">
									<div
										class="rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 ease-out"
									>
										<h3 class="mb-4 text-lg font-semibold text-black">Recommendations</h3>
										<div class="space-y-4">
											<div>
												<h4 class="mb-2 font-medium text-black">Suggested Title</h4>
												<p class="text-sm leading-relaxed text-gray-700">
													{result.recommendations.headline}
												</p>
											</div>
											<div>
												<h4 class="mb-2 font-medium text-black">FAQ Suggestions</h4>
												<div class="space-y-3">
													{#each result.recommendations.faqs as faq}
														<div class="border-l-4 border-light-blue/30 pl-3">
															<p class="text-sm font-medium text-black">{faq.q}</p>
															<p class="mt-1 text-sm text-gray-600">{faq.a}</p>
														</div>
													{/each}
												</div>
											</div>
											<div>
												<h4 class="mb-2 font-medium text-black">Schema Type</h4>
												<span
													class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
												>
													{result.recommendations.jsonldType}
												</span>
											</div>
										</div>
									</div>
								</LockedPanel>
							</div>
						</div>
					{/if}

					<!-- Quick Edit Panel for Paid Users -->
					{#if isPaid}
						<div
							class="animate-fade-in-up mb-8 transition-all duration-500 ease-out"
							style="animation-delay: 400ms"
						>
							<QuickEditPanel recommendations={result.recommendations} onReScore={handleReScore} />
						</div>
					{/if}

					<!-- Export Options for Paid Users -->
					{#if isPaid}
						<div
							class="animate-fade-in-up mb-8 transition-all duration-500 ease-out"
							style="animation-delay: 500ms"
						>
							<ExportOptions data={result} loading={isLoading} />
						</div>
					{/if}
				{/if}
			{:else}
				<!-- Welcome State -->
				<div class="text-center">
					<div class="mx-auto max-w-2xl">
						<div class="rounded-2xl bg-white p-8 shadow-lg">
							<div class="mb-6">
								<div
									class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-light-blue/10"
								>
									<svg
										class="h-8 w-8 text-light-blue"
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
							</div>
							<h2 class="mb-4 text-2xl font-bold text-black">Ready to Analyze Your Website?</h2>
							<p class="leading-relaxed text-gray-600">
								Enter your domain or URL above to get insights about your website's performance in
								AI-powered search results. Our analysis will show you how well your content performs
								across different queries and provide actionable recommendations.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Footer (only for non-paid users) -->
			{#if !isPaid}
				<footer class="mt-16 border-t border-gray-200 pt-8 text-center">
					<div class="space-y-4">
						<div class="flex justify-center space-x-6 text-sm text-gray-600">
							<a href="/" class="transition-colors duration-200 hover:text-gray-900"> Home </a>
							<span class="text-gray-400">|</span>
							<a href="/legal" class="transition-colors duration-200 hover:text-gray-900">
								Terms & Privacy
							</a>
							<span class="text-gray-400">|</span>
							<span>© 2024 GEO POC</span>
						</div>
						<p class="text-xs text-gray-500">
							This is a demonstration application for proof-of-concept purposes.
						</p>
					</div>
				</footer>
			{/if}
		</div>
	</div>
</DashboardLayout>

<style>
	@keyframes fade-in-up {
		0% {
			opacity: 0;
			transform: translateY(20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out;
	}
</style>
