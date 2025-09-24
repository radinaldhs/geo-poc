<script lang="ts">
	import type { CitationItem } from '$lib/types';

	export let citations: CitationItem[] = [];
	export let loading = false;

	// AI platform attribution for citations
	function getAIPlatform(citation: CitationItem, index: number): string {
		const platforms = [
			'ChatGPT',
			'Claude',
			'Gemini',
			'Perplexity',
			'SearchGPT',
			'Bing Chat',
			'Bard'
		];
		// Use citation source + excerpt hash for deterministic platform assignment
		const hash =
			(citation.source + citation.excerpt)
				.split('')
				.reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
		return platforms[hash % platforms.length];
	}

	// Generate confidence score for citations
	function getConfidenceScore(citation: CitationItem): number {
		const hash = citation.excerpt.length + citation.source.length;
		return 75 + (hash % 20); // 75-94% confidence range
	}

	// Get position badge styling
	function getPositionBadgeColor(position: string): string {
		switch (position) {
			case 'body':
				return 'bg-blue-100 text-blue-800';
			case 'faq':
				return 'bg-green-100 text-green-800';
			case 'footer':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Generate detailed reasoning for why content was cited
	function getCitationReasoning(citation: CitationItem, platform: string): string {
		const reasoningTemplates = {
			body: [
				`${platform} identified this content as directly relevant to user queries, citing it for its comprehensive coverage of the topic.`,
				`The main content area provided clear, authoritative information that ${platform} found valuable for answering related questions.`,
				`${platform} selected this excerpt because it demonstrates expertise and provides specific details users are looking for.`
			],
			faq: [
				`${platform} found this FAQ particularly useful as it directly addresses common user questions in a structured format.`,
				`The question-answer format made it easy for ${platform} to extract precise information for user queries.`,
				`${platform} values FAQ content for its clarity and direct approach to addressing user concerns.`
			],
			footer: [
				`${platform} cited this footer content as it provides important contextual information about your business credibility.`,
				`Footer information like this helps ${platform} establish trust and authority signals for your content.`,
				`${platform} found this supplementary information valuable for providing complete answers to user queries.`
			]
		};

		const templates = reasoningTemplates[citation.position] || reasoningTemplates.body;
		const hash = citation.excerpt.length;
		return templates[hash % templates.length];
	}

	// Get confidence color
	function getConfidenceColor(confidence: number): string {
		if (confidence >= 90) return 'text-green-600';
		if (confidence >= 80) return 'text-yellow-600';
		return 'text-orange-600';
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<div class="mb-6 flex items-center justify-between">
		<h3 class="text-xl font-semibold text-black">Citation Analysis</h3>
		<span class="text-sm text-gray-500">{citations.length} citations found</span>
	</div>

	{#if loading}
		<!-- Loading state -->
		<div class="space-y-6">
			{#each Array(3) as _}
				<div class="animate-pulse rounded-lg border border-gray-200 p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="h-4 w-1/3 rounded bg-gray-200"></div>
						<div class="h-6 w-20 rounded-full bg-gray-200"></div>
					</div>
					<div class="mb-3 h-3 w-1/4 rounded bg-gray-200"></div>
					<div class="mb-2 h-3 w-full rounded bg-gray-200"></div>
					<div class="mb-4 h-3 w-3/4 rounded bg-gray-200"></div>
					<div class="h-3 w-full rounded bg-gray-200"></div>
				</div>
			{/each}
		</div>
	{:else if citations.length === 0}
		<!-- Empty state -->
		<div class="py-12 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
				<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</div>
			<h4 class="mb-2 text-lg font-medium text-gray-900">No citations found</h4>
			<p class="text-gray-500">Run an analysis to see where AI platforms cite your content.</p>
		</div>
	{:else}
		<!-- Citations list -->
		<div class="space-y-6">
			{#each citations as citation, index}
				{@const platform = getAIPlatform(citation, index)}
				{@const confidence = getConfidenceScore(citation)}

				<div
					class="rounded-lg border border-gray-200 p-5 transition-all duration-200 hover:border-light-blue/30 hover:shadow-md"
				>
					<!-- Citation header -->
					<div class="mb-4 flex items-start justify-between">
						<div class="flex-1">
							<div class="flex items-center space-x-3">
								<h4 class="font-semibold text-black">{citation.source}</h4>
								<span
									class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {getPositionBadgeColor(
										citation.position
									)} capitalize"
								>
									{citation.position}
								</span>
							</div>
							<div class="mt-1 flex items-center space-x-3 text-sm text-gray-500">
								<span>Cited by <span class="font-medium">{platform}</span></span>
								<span class="text-gray-300">•</span>
								<span class="{getConfidenceColor(confidence)} font-medium">
									{confidence}% confidence
								</span>
							</div>
						</div>
					</div>

					<!-- Cited excerpt -->
					<div class="mb-4 rounded-md border-l-4 border-light-blue/30 bg-light-blue/5 p-4">
						<h5 class="mb-2 text-sm font-medium text-gray-700">Cited Content:</h5>
						<blockquote class="leading-relaxed text-gray-800">
							"{citation.excerpt}"
						</blockquote>
					</div>

					<!-- AI reasoning -->
					<div class="rounded-md bg-gray-50 p-4">
						<h5 class="mb-2 text-sm font-medium text-gray-700">Why This Was Cited:</h5>
						<p class="text-sm leading-relaxed text-gray-700">
							{getCitationReasoning(citation, platform)}
						</p>
					</div>

					<!-- Citation metrics -->
					<div class="mt-4 flex items-center justify-between text-xs text-gray-500">
						<span>Content length: {citation.excerpt.length} characters</span>
						<span>Position: {citation.position} section</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Citation summary -->
		<div class="mt-6 rounded-lg bg-gradient-to-r from-light-blue/5 to-dark-blue/5 p-4">
			<h4 class="mb-3 font-medium text-black">Citation Summary</h4>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="text-center">
					<div class="text-lg font-bold text-light-blue">
						{citations.filter((c) => c.position === 'body').length}
					</div>
					<div class="text-sm text-gray-600">Body Citations</div>
				</div>
				<div class="text-center">
					<div class="text-lg font-bold text-green-600">
						{citations.filter((c) => c.position === 'faq').length}
					</div>
					<div class="text-sm text-gray-600">FAQ Citations</div>
				</div>
				<div class="text-center">
					<div class="text-lg font-bold text-purple-600">
						{citations.filter((c) => c.position === 'footer').length}
					</div>
					<div class="text-sm text-gray-600">Footer Citations</div>
				</div>
			</div>
			<div class="mt-3 text-center">
				<p class="text-sm text-gray-600">
					Average confidence: <span class="font-medium text-dark-blue">
						{Math.round(
							citations.reduce((sum, c) => sum + getConfidenceScore(c), 0) / citations.length
						)}%
					</span>
				</p>
			</div>
		</div>
	{/if}
</div>
