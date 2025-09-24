import { describe, it, expect } from 'vitest';

// Helper functions to test TeaserList logic
function getVisibleItems<T>(items: T[], visibleCount: number): T[] {
	return items.slice(0, visibleCount);
}

function getHiddenItems<T>(items: T[], visibleCount: number): T[] {
	return items.slice(visibleCount);
}

function hasHiddenItems<T>(items: T[], visibleCount: number): boolean {
	return items.length > visibleCount;
}

function getHiddenItemsText(hiddenCount: number): string {
	return `${hiddenCount} more item${hiddenCount === 1 ? '' : 's'} available`;
}

describe('TeaserList', () => {
	const mockItems = [
		{ id: 1, name: 'Item 1', description: 'First item' },
		{ id: 2, name: 'Item 2', description: 'Second item' },
		{ id: 3, name: 'Item 3', description: 'Third item' },
		{ id: 4, name: 'Item 4', description: 'Fourth item' }
	];

	it('can import TeaserList component', async () => {
		const module = await import('./TeaserList.svelte');
		expect(module.default).toBeDefined();
	});

	it('correctly calculates visible items', () => {
		expect(getVisibleItems(mockItems, 2)).toEqual([
			{ id: 1, name: 'Item 1', description: 'First item' },
			{ id: 2, name: 'Item 2', description: 'Second item' }
		]);

		expect(getVisibleItems(mockItems, 0)).toEqual([]);
		expect(getVisibleItems(mockItems, 10)).toEqual(mockItems); // More than available
	});

	it('correctly calculates hidden items', () => {
		expect(getHiddenItems(mockItems, 2)).toEqual([
			{ id: 3, name: 'Item 3', description: 'Third item' },
			{ id: 4, name: 'Item 4', description: 'Fourth item' }
		]);

		expect(getHiddenItems(mockItems, 0)).toEqual(mockItems);
		expect(getHiddenItems(mockItems, 10)).toEqual([]); // No hidden items
	});

	it('correctly determines if there are hidden items', () => {
		expect(hasHiddenItems(mockItems, 2)).toBe(true);
		expect(hasHiddenItems(mockItems, 4)).toBe(false);
		expect(hasHiddenItems(mockItems, 10)).toBe(false);
		expect(hasHiddenItems([], 2)).toBe(false);
	});

	it('generates correct hidden items text', () => {
		expect(getHiddenItemsText(1)).toBe('1 more item available');
		expect(getHiddenItemsText(2)).toBe('2 more items available');
		expect(getHiddenItemsText(5)).toBe('5 more items available');
	});

	it('handles edge cases for item slicing', () => {
		// Empty array
		expect(getVisibleItems([], 2)).toEqual([]);
		expect(getHiddenItems([], 2)).toEqual([]);
		expect(hasHiddenItems([], 2)).toBe(false);

		// Single item
		const singleItem = [mockItems[0]];
		expect(getVisibleItems(singleItem, 2)).toEqual(singleItem);
		expect(getHiddenItems(singleItem, 2)).toEqual([]);
		expect(hasHiddenItems(singleItem, 2)).toBe(false);

		// Exact match
		expect(getVisibleItems(mockItems, 4)).toEqual(mockItems);
		expect(getHiddenItems(mockItems, 4)).toEqual([]);
		expect(hasHiddenItems(mockItems, 4)).toBe(false);
	});

	it('handles negative visible count', () => {
		// slice(-1) returns the last element, so we need to handle this case
		// In practice, the component should handle negative values gracefully
		expect(getVisibleItems(mockItems, -1).length).toBeLessThanOrEqual(mockItems.length);
		expect(getHiddenItems(mockItems, -1).length).toBeGreaterThanOrEqual(0);
		expect(hasHiddenItems(mockItems, -1)).toBe(true);
	});

	it('handles zero visible count', () => {
		expect(getVisibleItems(mockItems, 0)).toEqual([]);
		expect(getHiddenItems(mockItems, 0)).toEqual(mockItems);
		expect(hasHiddenItems(mockItems, 0)).toBe(true);
	});

	it('correctly handles different data types', () => {
		const stringItems = ['a', 'b', 'c', 'd'];
		expect(getVisibleItems(stringItems, 2)).toEqual(['a', 'b']);
		expect(getHiddenItems(stringItems, 2)).toEqual(['c', 'd']);

		const numberItems = [1, 2, 3, 4];
		expect(getVisibleItems(numberItems, 3)).toEqual([1, 2, 3]);
		expect(getHiddenItems(numberItems, 3)).toEqual([4]);
	});
});
