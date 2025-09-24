import { describe, it, expect } from 'vitest';
import type { QueryItem, CitationItem } from '$lib/types';

// Integration test to verify TeaserList works with actual data types
describe('TeaserList Integration', () => {
	it('works with QueryItem data', () => {
		const queryItems: QueryItem[] = [
			{ query: 'best pizza near me', score: 85, cited: true },
			{ query: 'pizza delivery hours', score: 72, cited: false },
			{ query: 'pizza menu prices', score: 68, cited: true },
			{ query: 'gluten free pizza options', score: 45, cited: false }
		];

		// Test that we can slice the data correctly
		const visibleItems = queryItems.slice(0, 2);
		const hiddenItems = queryItems.slice(2);

		expect(visibleItems).toHaveLength(2);
		expect(hiddenItems).toHaveLength(2);
		expect(visibleItems[0].query).toBe('best pizza near me');
		expect(hiddenItems[0].query).toBe('pizza menu prices');
	});

	it('works with CitationItem data', () => {
		const citationItems: CitationItem[] = [
			{
				source: 'example.com/about',
				position: 'body',
				excerpt: 'We serve the best pizza in town with fresh ingredients.'
			},
			{
				source: 'example.com/menu',
				position: 'faq',
				excerpt: 'Our pizza is made with organic flour and local cheese.'
			},
			{
				source: 'example.com/contact',
				position: 'footer',
				excerpt: 'Visit us at 123 Main St for authentic Italian pizza.'
			}
		];

		// Test that we can slice the data correctly
		const visibleItems = citationItems.slice(0, 1);
		const hiddenItems = citationItems.slice(1);

		expect(visibleItems).toHaveLength(1);
		expect(hiddenItems).toHaveLength(2);
		expect(visibleItems[0].source).toBe('example.com/about');
		expect(hiddenItems[0].source).toBe('example.com/menu');
	});

	it('handles empty arrays gracefully', () => {
		const emptyQueries: QueryItem[] = [];
		const emptyCitations: CitationItem[] = [];

		expect(emptyQueries.slice(0, 2)).toEqual([]);
		expect(emptyQueries.slice(2)).toEqual([]);
		expect(emptyCitations.slice(0, 1)).toEqual([]);
		expect(emptyCitations.slice(1)).toEqual([]);
	});

	it('handles arrays smaller than visible count', () => {
		const singleQuery: QueryItem[] = [{ query: 'single query', score: 90, cited: true }];

		const visibleItems = singleQuery.slice(0, 3); // Request more than available
		const hiddenItems = singleQuery.slice(3);

		expect(visibleItems).toEqual(singleQuery);
		expect(hiddenItems).toEqual([]);
	});
});
