<script lang="ts">
	import UpgradeCTA from './UpgradeCTA.svelte';

	export let locked: boolean = false;
	export let upgradeText: string = 'Upgrade to unlock';

	function handleOverlayClick(event: MouseEvent) {
		if (locked) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	function handleOverlayKeydown(event: KeyboardEvent) {
		if (locked && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
</script>

<div class="relative">
	<!-- Content wrapper with conditional blur -->
	<div
		class={locked
			? 'pointer-events-none blur-sm filter transition-all duration-500 ease-out'
			: 'transition-all duration-500 ease-out'}
	>
		<slot />
	</div>

	<!-- Lock overlay when locked -->
	{#if locked}
		<div
			class="animate-fade-in absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white/90"
			on:click={handleOverlayClick}
			on:keydown={handleOverlayKeydown}
			role="button"
			tabindex="0"
		>
			<div class="transform p-6 text-center transition-all duration-300 ease-out hover:scale-105">
				<!-- Lock icon -->
				<div class="mb-4">
					<svg
						class="mx-auto h-12 w-12 animate-pulse text-gray-400 transition-colors duration-300 hover:text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>

				<!-- Upgrade text -->
				<p class="mb-4 font-medium text-gray-600 transition-colors duration-300">{upgradeText}</p>

				<!-- Upgrade button -->
				<UpgradeCTA text="Upgrade Now" size="md" variant="button" />
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: scale(0.95);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.4s ease-out;
	}
</style>
