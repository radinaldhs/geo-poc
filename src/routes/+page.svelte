<script lang="ts">
	import {
		ContactSection,
		HeroSection,
		MarketingFeatures,
		SupportedAIPlatforms
	} from '$lib/components';
	import { goto } from '$app/navigation';

	function handleGetStarted() {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>GEON POC - AI Search Optimization Platform</title>
	<meta
		name="description"
		content="Optimize your website for AI-powered search results. Analyze performance across ChatGPT, Claude, Gemini, and other major AI platforms."
	/>
	<meta
		name="keywords"
		content="AI search optimization, ChatGPT SEO, AI platforms, website analysis, search engine optimization"
	/>
	<meta property="og:title" content="GEON POC - AI Search Optimization Platform" />
	<meta
		property="og:description"
		content="Optimize your website for AI-powered search results. Get actionable insights to improve your visibility in AI search platforms."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- Navigation Header -->
<nav class="border-b border-gray-200 bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/" class="text-xl font-bold text-black">
					<img src="/images/GEON_Hitam.png" alt="GEON POC Logo" class="h-8 w-auto" />
				</a>
			</div>
			<div class="flex items-center space-x-4">
				<a
					href="/dashboard"
					class="text-gray-600 transition-colors duration-200 hover:text-light-blue"
				>
					Dashboard
				</a>
				<a
					href="/dashboard"
					class="rounded-md bg-light-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-dark-blue"
				>
					Get Started
				</a>
			</div>
		</div>
	</div>
</nav>

<!-- Marketing Homepage Content -->
<main>
	<!-- Hero Section -->
	<HeroSection onGetStarted={handleGetStarted} />

	<!-- Supported AI Platforms -->
	<SupportedAIPlatforms />

	<!-- Marketing Features -->
	<MarketingFeatures />

	<!-- Contact Section -->
	<ContactSection />
</main>

<!-- Footer -->
<footer class="border-t border-gray-200 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="space-y-4 text-center">
			<div class="flex justify-center space-x-6 text-sm text-gray-600">
				<a href="/legal" class="transition-colors duration-200 hover:text-gray-900">
					Terms & Privacy
				</a>
				<span class="text-gray-400">|</span>
				<a href="/dashboard" class="transition-colors duration-200 hover:text-gray-900">
					Dashboard
				</a>
				<span class="text-gray-400">|</span>
				<span>© 2026 </span>
			</div>
			<p class="text-xs text-gray-500">
				This is a demonstration application for proof-of-concept purposes. Made by Radinal
			</p>
		</div>
	</div>
</footer>
