<script lang="ts">
	const platforms = [
		{
			name: 'ChatGPT',
			description: "OpenAI's conversational AI platform",
			icon: '🤖'
		},
		{
			name: 'Claude',
			description: "Anthropic's AI assistant",
			icon: '🧠'
		},
		{
			name: 'Gemini',
			description: "Google's multimodal AI model",
			icon: '💎'
		},
		{
			name: 'Perplexity',
			description: 'AI-powered search engine',
			icon: '🔍'
		},
		{
			name: 'SearchGPT',
			description: "OpenAI's search platform",
			icon: '🔎'
		},
		{
			name: 'Bing Chat',
			description: "Microsoft's AI-powered search",
			icon: '💬'
		},
		{
			name: 'Bard',
			description: "Google's conversational AI",
			icon: '🎭'
		}
	];
</script>

<section class="bg-gray-50 py-16 sm:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold tracking-tight text-black sm:text-4xl">
				Supported AI Platforms
			</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
				Analyze your website's performance across all major AI search platforms
			</p>
		</div>

		<div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
			{#each platforms as platform}
				<div
					class="group relative rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="flex items-center space-x-4">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-lg bg-light-blue/10 text-2xl"
						>
							{platform.icon}
						</div>
						<div class="flex-1">
							<h3
								class="text-lg font-semibold text-black transition-colors duration-200 group-hover:text-light-blue"
							>
								{platform.name}
							</h3>
							<p class="text-sm text-gray-600">
								{platform.description}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
