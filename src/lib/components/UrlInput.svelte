<script lang="ts">
	// Props
	export let disabled = false;
	export let onSubmit: ((url: string) => void) | undefined = undefined;

	// Component state
	let url = '';
	let isValid = false;
	let showError = false;
	let errorMessage = '';

	// URL validation regex - supports http/https and domain-only formats
	const urlRegex =
		/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/;

	// Validate URL in real-time
	function validateUrl(value: string): void {
		if (!value.trim()) {
			isValid = false;
			showError = false;
			errorMessage = '';
			return;
		}

		const trimmedValue = value.trim();

		// Check for common invalid patterns first
		if (trimmedValue.includes(' ')) {
			isValid = false;
			showError = true;
			errorMessage = 'URLs cannot contain spaces';
			return;
		}

		if (trimmedValue.length > 2048) {
			isValid = false;
			showError = true;
			errorMessage = 'URL is too long (maximum 2048 characters)';
			return;
		}

		// Test against URL regex
		if (urlRegex.test(trimmedValue)) {
			// Additional validation for edge cases
			try {
				// Try to construct URL to catch additional edge cases
				let testUrl = trimmedValue;
				if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
					testUrl = 'https://' + testUrl;
				}
				new URL(testUrl);

				isValid = true;
				showError = false;
				errorMessage = '';
			} catch (error) {
				isValid = false;
				showError = true;
				errorMessage =
					'Please enter a valid domain or URL (e.g., example.com or https://example.com)';
			}
		} else {
			isValid = false;
			showError = true;
			errorMessage =
				'Please enter a valid domain or URL (e.g., example.com or https://example.com)';
		}
	}

	// Handle input changes
	function handleInput(event: Event): void {
		const target = event.target as HTMLInputElement;
		url = target.value;
		validateUrl(url);
	}

	// Handle form submission
	function handleSubmit(): void {
		if (isValid && !disabled) {
			try {
				// Normalize URL - add https:// if no protocol specified
				let normalizedUrl = url.trim();
				if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
					normalizedUrl = 'https://' + normalizedUrl;
				}

				// Final validation before submission
				new URL(normalizedUrl);
				onSubmit?.(normalizedUrl);
			} catch (error) {
				console.error('URL validation error during submission:', error);
				// Re-validate to show error
				validateUrl(url);
			}
		}
	}

	// Handle Enter key press
	function handleKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSubmit();
		}
	}

	// Determine if scan button should be disabled
	$: scanDisabled = disabled || !isValid || !url.trim();
</script>

<div class="max-w-2xl mx-auto w-full">
	<div
		class="rounded-2xl bg-white p-6 shadow-lg ease-out hover:shadow-xl transition-all duration-300"
	>
		<div class="space-y-4">
			<!-- Input field -->
			<div class="space-y-2">
				<label for="url-input" class="text-lg font-medium text-gray-900 block">
					Enter your domain or URL
				</label>
				<div class="relative">
					<input
						id="url-input"
						type="text"
						bind:value={url}
						on:input={handleInput}
						on:keypress={handleKeyPress}
						placeholder="example.com or https://example.com"
						class="rounded-xl px-4 py-3 text-lg ease-out focus:ring-light-blue w-full transform border-2 transition-all duration-300 focus:scale-[1.02] focus:border-transparent focus:ring-2 focus:outline-none {showError
							? 'border-red-500 bg-red-50'
							: isValid
								? 'border-green-500 bg-green-50'
								: 'border-gray-300 bg-white'}"
						{disabled}
					/>
					<!-- Validation icons -->
					{#if url.trim() && !disabled}
						<div class="inset-y-0 right-0 pr-3 absolute flex items-center">
							{#if isValid}
								<svg
									class="animate-fade-in h-5 w-5 text-green-500 ease-out transform transition-all duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							{:else if showError}
								<svg
									class="animate-shake h-5 w-5 text-red-500 ease-out transform transition-all duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							{/if}
						</div>
					{/if}
				</div>
				<!-- Error message -->
				{#if showError && errorMessage}
					<p class="animate-fade-in mt-1 text-sm text-red-600">{errorMessage}</p>
				{/if}
			</div>

			<!-- Scan button -->
			<div class="flex justify-center">
				<button
					type="button"
					on:click={handleSubmit}
					disabled={scanDisabled}
					class="rounded-xl px-8 py-3 text-lg font-semibold ease-out transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none {scanDisabled
						? 'bg-gray-300 text-gray-500 cursor-not-allowed'
						: 'text-white hover:shadow-lg transform bg-[#007fd1] hover:scale-105 hover:bg-[#00609e] focus:ring-[#007fd1] active:scale-95'}"
				>
					{#if disabled}
						<div class="animate-fade-in space-x-2 flex items-center">
							<svg
								class="h-5 w-5 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							<span class="animate-pulse">Scanning...</span>
						</div>
					{:else}
						<span class="ease-out transition-all duration-200">Scan Website</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		0% {
			opacity: 0;
			transform: translateY(5px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}

	.animate-shake {
		animation: shake 0.3s ease-out;
	}
</style>
