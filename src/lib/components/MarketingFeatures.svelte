<script lang="ts">
	const features = [
		{
			title: 'AI Search Optimization',
			description:
				'Understand how AI platforms discover and cite your content. Get detailed insights into query performance and citation patterns.',
			icon: '🎯'
		},
		{
			title: 'Comprehensive Analysis',
			description:
				'Analyze your website across multiple AI platforms simultaneously. See which queries work and which need improvement.',
			icon: '📊'
		},
		{
			title: 'Actionable Recommendations',
			description:
				'Receive specific suggestions for improving your content structure, headlines, and FAQ sections to boost AI visibility.',
			icon: '💡'
		},
		{
			title: 'Content Testing',
			description:
				'Test different headlines and content variations to see immediate score improvements and optimization opportunities.',
			icon: '🧪'
		},
		{
			title: 'Citation Tracking',
			description:
				'Monitor exactly where AI platforms find and cite your content. Identify gaps and optimization opportunities.',
			icon: '📝'
		},
		{
			title: 'Professional Reports',
			description:
				'Export detailed analysis reports in CSV and Excel formats for team sharing and strategic planning.',
			icon: '📈'
		}
	];
</script>

<section id="features" class="bg-white py-16 sm:py-24">
	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
		<div class="text-center">
			<h2 class="text-3xl font-bold tracking-tight text-black sm:text-4xl">
				Why AI Search Optimization Matters
			</h2>
			<p class="mt-4 max-w-3xl text-lg text-gray-600 mx-auto">
				As AI platforms become the primary way users discover information, ensuring your content is
				optimized for AI search results is crucial for maintaining visibility and driving traffic.
			</p>
		</div>

		<div class="mt-16 gap-8 sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1">
			{#each features as feature}
				<div
					class="group rounded-2xl bg-gray-50 p-8 hover:bg-white hover:shadow-lg relative transition-all duration-300"
				>
					<div class="space-x-4 flex items-start">
						<div
							class="h-12 w-12 rounded-lg bg-light-blue text-2xl text-white flex flex-shrink-0 items-center justify-center"
						>
							{feature.icon}
						</div>
						<div class="flex-1">
							<h3
								class="text-xl font-semibold text-black group-hover:text-light-blue transition-colors duration-200"
							>
								{feature.title}
							</h3>
							<p class="mt-3 leading-relaxed text-gray-600">
								{feature.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-16 text-center">
			<div class="rounded-2xl bg-light-blue/5 p-8">
				<h3 class="mb-4 text-2xl font-bold text-black">Ready to Optimize Your Website?</h3>
				<p class="mb-6 text-lg text-gray-600">
					Join forward-thinking businesses that are already optimizing for the AI search revolution.
				</p>
				<a
					href="/dashboard"
					class="rounded-md bg-light-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-dark-blue focus-visible:outline-light-blue inline-flex items-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					Start Your Analysis
					<svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>
