import { describe, it, expect } from 'vitest';

describe('Component Integration', () => {
	it('can import UrlInput component', async () => {
		// This test verifies that the component can be imported without errors
		const module = await import('./UrlInput.svelte');
		expect(module.default).toBeDefined();
	});

	it('can import from components index', async () => {
		// This test verifies that the component can be imported from the index
		const module = await import('./index.js');
		expect(module.UrlInput).toBeDefined();
	});
});
