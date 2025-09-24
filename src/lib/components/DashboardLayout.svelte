<script lang="ts">
	import DashboardSidebar from './DashboardSidebar.svelte';
	import { appStore } from '$lib/stores/app';

	export let currentPage: string = 'dashboard';

	// Reactive statement for paid state
	$: isPaid = $appStore.paid;

	function handleNavigate(page: string) {
		currentPage = page;
		// Handle any additional navigation logic here
		console.log('Navigating to:', page);
	}
</script>

<!-- Only show dashboard layout for paid users -->
{#if isPaid}
	<div class="flex h-screen bg-gray-50">
		<!-- Sidebar -->
		<DashboardSidebar {currentPage} onNavigate={handleNavigate} />

		<!-- Main Content Area -->
		<div class="flex flex-1 flex-col lg:ml-64">
			<!-- Top Header Bar -->
			<header class="bg-white shadow-sm">
				<div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
					<div class="flex items-center">
						<h1 class="text-lg font-semibold text-gray-900">
							{#if currentPage === 'home'}
								Home
							{:else if currentPage === 'dashboard'}
								Dashboard
							{:else if currentPage === 'export'}
								Export Data
							{:else if currentPage === 'help'}
								Help & Support
							{:else}
								Dashboard
							{/if}
						</h1>
					</div>
					<div class="flex items-center space-x-4">
						<!-- Status indicator -->
						<div class="flex items-center space-x-2">
							<div class="h-2 w-2 rounded-full bg-green-400"></div>
							<span class="text-sm text-gray-600">Professional Plan</span>
						</div>
					</div>
				</div>
			</header>

			<!-- Main Content -->
			<main class="flex-1 overflow-y-auto">
				<div class="p-4 sm:p-6 lg:p-8">
					<slot />
				</div>
			</main>
		</div>
	</div>
{:else}
	<!-- For non-paid users, just show the content without sidebar layout -->
	<slot />
{/if}
