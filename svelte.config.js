import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// SPA mode for client-side routing
			fallback: 'index.html',
			// Specify Node.js runtime for Vercel
			runtime: 'nodejs20.x'
		})
	}
};

export default config;
