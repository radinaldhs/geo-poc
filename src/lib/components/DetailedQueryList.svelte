<script lang="ts">
	import type { QueryItem } from '$lib/types';

	export let queries: QueryItem[] = [];
	export let loading = false;

	// AI platform attribution - simulate different platforms for queries
	function getAIPlatform(query: string, index: number): string {
		const platforms = [
			'ChatGPT',
			'Claude',
			'Gemini',
			'Perplexity',
			'SearchGPT',
			'Bing Chat',
			'Bard'
		];
		// Use query hash + index for deterministic platform assignment
		const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
		return platforms[hash % platforms.length];
	}

	// Generate reasoning for citation decisions
	function getCitationReasoning(query: QueryItem, platform: string): string {
		if (query.cited) {
			const reasons = [
				`${platform} found relevant content in your page structure that directly answers this query.`,
				`Your content provides comprehensive information that ${platform} considers authoritative for this topic.`,
				`${platform} identified your FAQ section as particularly valuable for answering this query.`,
				`Your page content demonstrates expertise that ${platform} trusts for this search intent.`
			];
			const hash = query.query.length + query.score;
			return reasons[hash % reasons.length];
		} else {
			const reasons = [
				`${platform} couldn't find sufficiently detailed content to cite your page for this query.`,
				`Your content lacks the specific information ${platform} looks for when answering this query.`,
				`${platform} found your content relevant but not comprehensive enough to cite directly.`,
				`Your page structure makes it difficult for ${platform} to extract clear answers for this query.`
			];
			const hash = query.query.length + query.score;
			return reasons[hash % reasons.length];
		}
	}

	function getScoreColor(score: number): string {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	}

	function getScoreBadgeColor(score: number): string {
		if (score >= 80) return 'bg-green-100 text-green-800';
		if (score >= 60) return 'bg-yellow-100 text-yellow-800';
		return 'bg-red-100 text-red-800';
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<div class="mb-6 flex items-center justify-between">
		<h3 class="text-xl font-semibold text-black">Complete Query Analysis</h3>
		<span class="text-sm text-gray-500">{queries.length} queries tested</span>
	</div>

	{#if loading}
		<!-- Loading state -->
		<div class="space-y-4">
			{#each Array(6) as _}
				<div class="animate-pulse rounded-lg border border-gray-200 p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="h-4 w-3/4 rounded bg-gray-200"></div>
						<div class="h-6 w-16 rounded-full bg-gray-200"></div>
					</div>
					<div class="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
					<div class="h-3 w-full rounded bg-gray-200"></div>
				</div>
			{/each}
		</div>
	{:else if queries.length === 0}
		<!-- Empty state -->
		<div class="py-12 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
				<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			</div>
			<h4 class="mb-2 text-lg font-medium text-gray-900">No queries analyzed yet</h4>
			<p class="text-gray-500">Run an analysis to see detailed query performance data.</p>
		</div>
	{:else}
		<!-- Query list -->
		<div class="space-y-4">
			{#each queries as query, index}
				<div
					class="rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-light-blue/30 hover:shadow-md"
				>
					<!-- Query header -->
					<div class="mb-3 flex items-start justify-between">
						<div class="flex-1">
							<h4 class="font-medium text-black">{query.query}</h4>
							<div class="mt-1 flex items-center space-x-3">
								<span class="text-sm text-gray-500">
									Tested by <span class="font-medium">{getAIPlatform(query.query, index)}</span>
								</span>
								<span class="text-gray-300">•</span>
								<span class="text-sm {getScoreColor(query.score)} font-medium">
									Score: {query.score}/100
								</span>
							</div>
						</div>
						<div class="ml-4 flex items-center space-x-2">
							<span
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getScoreBadgeColor(
									query.score
								)}"
							>
								{query.score}
							</span>
							{#if query.cited}
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

					<!-- Citation reasoning -->
					<div class="rounded-md bg-gray-50 p-3">
						<p class="text-sm leading-relaxed text-gray-700">
							<span class="font-medium">Analysis:</span>
							{getCitationReasoning(query, getAIPlatform(query.query, index))}
						</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Summary stats -->
		<div class="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
			<div class="text-center">
				<div class="text-2xl font-bold text-green-600">
					{queries.filter((q) => q.cited).length}
				</div>
				<div class="text-sm text-gray-600">Cited</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-red-600">
					{queries.filter((q) => !q.cited).length}
				</div>
				<div class="text-sm text-gray-600">Not Cited</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-light-blue">
					{Math.round(queries.reduce((sum, q) => sum + q.score, 0) / queries.length)}
				</div>
				<div class="text-sm text-gray-600">Avg Score</div>
			</div>
		</div>
	{/if}
</div>
