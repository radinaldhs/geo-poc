<script lang="ts">
	export let onGetStarted: () => void;
</script>

<section class="bg-white py-16 sm:py-24 relative">
	<div class="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-black sm:text-6xl">
				Optimize Your Website for
				<span class="text-light-blue">AI Search Results</span>
			</h1>
			<p class="mt-6 max-w-2xl text-lg leading-8 text-gray-600 mx-auto">
				Discover how your website performs across major AI platforms like ChatGPT, Claude, and
				Gemini. Get actionable insights to improve your visibility in AI-powered search results.
			</p>
			<div class="mt-10 gap-x-6 flex items-center justify-center">
				<button
					on:click={onGetStarted}
					class="rounded-md bg-light-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-dark-blue focus-visible:outline-light-blue transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					Analyze Your Website
				</button>
				<a
					href="#features"
					class="text-sm leading-6 font-semibold text-black hover:text-light-blue transition-colors duration-200"
				>
					Learn more <span aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</section>
