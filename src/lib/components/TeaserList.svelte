<script lang="ts">
	import UpgradeCTA from './UpgradeCTA.svelte';

	export let items: any[] = [];
	export let visibleCount: number = 2;
	export let locked: boolean = true;
	export let title: string = '';
	export let loading: boolean = false;
	export let emptyMessage: string = 'No items available';

	$: visibleItems = items.slice(0, visibleCount);
	$: hiddenItems = items.slice(visibleCount);
	$: hasHiddenItems = hiddenItems.length > 0;
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	{#if title}
		<h3 class="mb-4 text-lg font-semibold text-black">{title}</h3>
	{/if}

	{#if loading}
		<!-- Enhanced Loading placeholders -->
		<div class="animate-fade-in space-y-3">
			{#each Array(visibleCount) as _, index}
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-4"
					style="animation-delay: {index * 100}ms"
				>
					<div class="space-y-2">
						<div class="shimmer h-4 w-3/4 rounded bg-gray-200"></div>
						<div class="shimmer h-3 w-1/2 rounded bg-gray-200"></div>
						<div class="shimmer h-3 w-2/3 rounded bg-gray-200"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if items.length === 0}
		<!-- Empty state -->
		<div class="py-8 text-center text-gray-500">
			<div class="mb-2 text-4xl">📋</div>
			<p class="text-sm">{emptyMessage}</p>
		</div>
	{:else}
		<!-- Content -->
		<div class="animate-fade-in relative space-y-3">
			<!-- Visible items -->
			<div class="space-y-3">
				{#each visibleItems as item, index}
					<div
						class="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-md"
						style="animation-delay: {index * 100}ms"
					>
						<slot {item} {index}>
							<!-- Default slot content -->
							<div class="text-sm text-black">
								{JSON.stringify(item)}
							</div>
						</slot>
					</div>
				{/each}
			</div>

			<!-- Hidden/blurred items -->
			{#if hasHiddenItems && locked}
				<div class="relative transition-all duration-500 ease-out">
					<!-- Blurred content -->
					<div class="pointer-events-none space-y-3 blur-sm filter transition-all duration-300">
						{#each hiddenItems as item, index}
							<div
								class="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-out"
								style="animation-delay: {(index + visibleCount) * 100}ms"
							>
								<slot {item} index={index + visibleCount}>
									<!-- Default slot content -->
									<div class="text-sm text-black">
										{JSON.stringify(item)}
									</div>
								</slot>
							</div>
						{/each}
					</div>

					<!-- Lock overlay -->
					<div
						class="bg-opacity-80 hover:bg-opacity-90 absolute inset-0 flex items-center justify-center rounded-lg bg-white transition-all duration-300 ease-out"
					>
						<div class="transform text-center transition-all duration-300 ease-out hover:scale-105">
							<div class="mb-2 animate-pulse text-2xl">🔒</div>
							<p class="mb-3 text-sm text-gray-600">
								{hiddenItems.length} more item{hiddenItems.length === 1 ? '' : 's'} available
							</p>
							<UpgradeCTA text="Upgrade to View All" size="sm" variant="button" />
						</div>
					</div>
				</div>
			{:else if hasHiddenItems && !locked}
				<!-- Show all items when not locked -->
				<div class="animate-fade-in space-y-3">
					{#each hiddenItems as item, index}
						<div
							class="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-out hover:border-gray-300 hover:shadow-md"
							style="animation-delay: {(index + visibleCount) * 100}ms"
						>
							<slot {item} index={index + visibleCount}>
								<!-- Default slot content -->
								<div class="text-sm text-black">
									{JSON.stringify(item)}
								</div>
							</slot>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Enhanced shimmer animation for loading states */
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
</style>
