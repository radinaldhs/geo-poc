<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initializeStore } from '$lib/stores/app';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Initialize store on app load to handle payment returns and localStorage
	onMount(() => {
		initializeStore();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
