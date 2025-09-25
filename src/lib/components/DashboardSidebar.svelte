<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let currentPage: string = 'dashboard';
	export let onNavigate: (page: string) => void = () => {};

	// Navigation items
	const navItems = [
		{
			id: 'home',
			label: 'Home',
			href: '/',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			id: 'dashboard',
			label: 'Dashboard',
			href: '/dashboard',
			icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
		},
		{
			id: 'export',
			label: 'Export',
			href: '/dashboard#export',
			icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
		},
		{
			id: 'help',
			label: 'Help',
			href: '/dashboard#help',
			icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
		}
	];

	// Mobile menu state
	let isMobileMenuOpen = false;

	// Update current page based on route
	let unsubscribe: (() => void) | undefined;

	onMount(() => {
		unsubscribe = page.subscribe(($page) => {
			const pathname = $page.url.pathname;
			if (pathname === '/') {
				currentPage = 'home';
			} else if (pathname === '/dashboard') {
				currentPage = 'dashboard';
			} else {
				currentPage = 'dashboard';
			}
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});

	function handleNavClick(item: (typeof navItems)[0]) {
		currentPage = item.id;
		onNavigate(item.id);
		isMobileMenuOpen = false; // Close mobile menu on navigation
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<!-- Mobile menu button -->
<div class="fixed top-4 left-4 z-50 lg:hidden">
	<button
		on:click={toggleMobileMenu}
		class="flex items-center justify-center rounded-lg bg-white p-2 shadow-lg transition-all duration-200 hover:bg-gray-50"
		aria-label="Toggle navigation menu"
	>
		<svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			{#if isMobileMenuOpen}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			{/if}
		</svg>
	</button>
</div>

<!-- Mobile overlay -->
{#if isMobileMenuOpen}
	<div
		class="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
		on:click={toggleMobileMenu}
		on:keydown={(e) => e.key === 'Escape' && toggleMobileMenu()}
		role="button"
		tabindex="0"
	></div>
{/if}

<!-- Sidebar -->
<aside
	class="fixed top-0 left-0 z-40 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 {isMobileMenuOpen
		? 'translate-x-0'
		: '-translate-x-full'}"
>
	<!-- Sidebar Header -->
	<div class="flex h-16 items-center justify-between border-b border-gray-200 px-6">
		<a href="/" class="text-xl font-bold text-black">
			<img src="/images/GEON_Hitam.png" alt="GEON POC Logo" class="h-8 w-auto" />
		</a>
		<!-- Close button for mobile -->
		<button
			on:click={toggleMobileMenu}
			class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
			aria-label="Close navigation menu"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>

	<!-- Navigation Menu -->
	<nav class="flex-1 space-y-1 px-3 py-6">
		{#each navItems as item}
			<a
				href={item.href}
				on:click={() => handleNavClick(item)}
				class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 {currentPage ===
				item.id
					? 'bg-light-blue text-white shadow-sm'
					: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
			>
				<svg
					class="mr-3 h-5 w-5 flex-shrink-0 {currentPage === item.id
						? 'text-white'
						: 'text-gray-400 group-hover:text-gray-500'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
				</svg>
				{item.label}
			</a>
		{/each}
	</nav>

	<!-- Sidebar Footer -->
	<div class="border-t border-gray-200 p-4">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-light-blue text-white">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				</div>
			</div>
			<div class="ml-3">
				<p class="text-sm font-medium text-gray-700">Dashboard User</p>
				<p class="text-xs text-gray-500">Professional Plan</p>
			</div>
		</div>
	</div>
</aside>
