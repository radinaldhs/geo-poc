<script lang="ts">
	import type { Recommendations, ContentEdits } from '../types.js';

	export let recommendations: Recommendations;
	export let onReScore: (edits: ContentEdits) => void;

	// Local state for form inputs
	let title = '';
	let faqs = [{ q: '', a: '' }];
	let jsonldType: 'FAQPage' | 'HowTo' | 'Product' = 'FAQPage';
	let isRescoring = false;
	let showScoreImprovement = false;

	// Initialize form with current recommendations
	$: if (recommendations) {
		title = recommendations.headline || '';
		faqs = recommendations.faqs.length > 0 ? [...recommendations.faqs] : [{ q: '', a: '' }];
		jsonldType = recommendations.jsonldType || 'FAQPage';
	}

	function addFaq() {
		faqs = [...faqs, { q: '', a: '' }];
	}

	function removeFaq(index: number) {
		if (faqs.length > 1) {
			faqs = faqs.filter((_, i) => i !== index);
		}
	}

	async function handleReScore() {
		if (isRescoring) return;

		isRescoring = true;

		// Prepare the edits
		const edits: ContentEdits = {
			title: title.trim(),
			faqs: faqs.filter((faq) => faq.q.trim() && faq.a.trim()),
			jsonldType
		};

		// Simulate processing time
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Call the parent's re-score function
		onReScore(edits);

		// Show score improvement animation
		showScoreImprovement = true;
		setTimeout(() => {
			showScoreImprovement = false;
		}, 3000);

		isRescoring = false;
	}

	// JSON-LD type options
	const jsonldOptions = [
		{ value: 'FAQPage', label: 'FAQ Page' },
		{ value: 'HowTo', label: 'How-To Guide' },
		{ value: 'Product', label: 'Product Page' }
	] as const;
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<div class="mb-6">
		<h3 class="text-xl font-semibold text-gray-900">Quick Content Edit & Re-Score</h3>
		<p class="mt-2 text-sm text-gray-600">
			Optimize your content and see immediate score improvements
		</p>
	</div>

	<form on:submit|preventDefault={handleReScore} class="space-y-6">
		<!-- Title/Headline Editor -->
		<div>
			<label for="title" class="mb-2 text-sm font-medium text-gray-700 block">
				Page Title/Headline
			</label>
			<textarea
				id="title"
				bind:value={title}
				rows="2"
				class="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-light-blue focus:ring-light-blue w-full resize-none border focus:ring-1 focus:outline-none"
				placeholder="Enter your optimized page title or headline..."
			></textarea>
		</div>

		<!-- FAQ Editor -->
		<div>
			<div class="mb-3 flex items-center justify-between">
				<span class="text-sm font-medium text-gray-700 block">FAQ Entries</span>
				<button
					type="button"
					on:click={addFaq}
					class="text-sm font-medium text-light-blue hover:text-dark-blue"
				>
					+ Add FAQ
				</button>
			</div>

			<div class="space-y-4">
				{#each faqs as faq, index}
					<div class="rounded-lg border-gray-200 p-4 border">
						<div class="mb-3 flex items-start justify-between">
							<span class="text-sm font-medium text-gray-700">FAQ {index + 1}</span>
							{#if faqs.length > 1}
								<button
									type="button"
									on:click={() => removeFaq(index)}
									class="text-sm text-red-600 hover:text-red-700"
								>
									Remove
								</button>
							{/if}
						</div>

						<div class="space-y-3">
							<div>
								<label for="question-{index}" class="mb-1 text-xs font-medium text-gray-600 block">
									Question
								</label>
								<input
									id="question-{index}"
									type="text"
									bind:value={faq.q}
									class="rounded-md border-gray-300 px-3 py-2 text-sm focus:border-light-blue focus:ring-light-blue w-full border focus:ring-1 focus:outline-none"
									placeholder="Enter the question..."
								/>
							</div>

							<div>
								<label for="answer-{index}" class="mb-1 text-xs font-medium text-gray-600 block">
									Answer
								</label>
								<textarea
									id="answer-{index}"
									bind:value={faq.a}
									rows="3"
									class="rounded-md border-gray-300 px-3 py-2 text-sm focus:border-light-blue focus:ring-light-blue w-full resize-none border focus:ring-1 focus:outline-none"
									placeholder="Enter the answer..."
								></textarea>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- JSON-LD Type Selector -->
		<div>
			<label for="jsonld-type" class="mb-2 text-sm font-medium text-gray-700 block">
				JSON-LD Schema Type
			</label>
			<select
				id="jsonld-type"
				bind:value={jsonldType}
				class="rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-light-blue focus:ring-light-blue w-full border focus:ring-1 focus:outline-none"
			>
				{#each jsonldOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
			<p class="mt-1 text-xs text-gray-500">
				Choose the most appropriate schema type for your content
			</p>
		</div>

		<!-- Re-Score Button -->
		<div class="relative">
			<button
				type="submit"
				disabled={isRescoring}
				class="gap-2 rounded-lg bg-light-blue px-6 py-3 font-medium text-white hover:bg-dark-blue disabled:bg-gray-400 flex w-full items-center justify-center transition-colors disabled:cursor-not-allowed"
			>
				{#if isRescoring}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Re-Scoring...
				{:else}
					Re-Score with Changes
				{/if}
			</button>

			<!-- Score Improvement Animation -->
			{#if showScoreImprovement}
				<div class="-top-12 animate-bounce absolute left-1/2 -translate-x-1/2 transform">
					<div class="bg-green-500 px-3 py-1 text-sm font-bold text-white shadow-lg rounded-full">
						+10 Score!
					</div>
				</div>
			{/if}
		</div>
	</form>
</div>

<style>
	@keyframes bounce {
		0%,
		20%,
		53%,
		80%,
		100% {
			transform: translate3d(-50%, 0, 0);
		}
		40%,
		43% {
			transform: translate3d(-50%, -30px, 0);
		}
		70% {
			transform: translate3d(-50%, -15px, 0);
		}
		90% {
			transform: translate3d(-50%, -4px, 0);
		}
	}

	.animate-bounce {
		animation: bounce 1s ease-in-out;
	}
</style>
