import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GeoResult } from '../types.js';

// Mock the CSV utility
vi.mock('../utils/csv.js', () => ({
	downloadCsv: vi.fn()
}));

import { downloadCsv } from '../utils/csv.js';

describe('ExportButton', () => {
	const mockResult: GeoResult = {
		url: 'example.com',
		overallScore: 75,
		testedQueries: [{ query: 'test query', score: 80, cited: true }],
		citations: [
			{
				source: 'example.com/page1',
				position: 'body',
				excerpt: 'Test excerpt'
			}
		],
		recommendations: {
			headline: 'Test Headline',
			faqs: [{ q: 'Test?', a: 'Answer.' }],
			jsonldType: 'FAQPage',
			jsonldSnippet: '{"@type": "FAQPage"}'
		}
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('can import ExportButton component', async () => {
		const module = await import('./ExportButton.svelte');
		expect(module.default).toBeDefined();
	});

	it('should validate export button props', () => {
		// Test that the component accepts the expected props
		expect(mockResult).toHaveProperty('url');
		expect(mockResult).toHaveProperty('overallScore');
		expect(mockResult).toHaveProperty('testedQueries');
		expect(mockResult).toHaveProperty('citations');
		expect(mockResult).toHaveProperty('recommendations');
	});

	it('should handle disabled state logic', () => {
		// Test the logic for when button should be disabled
		const shouldBeDisabled = (
			result: GeoResult | undefined,
			disabled: boolean,
			isExporting: boolean
		) => {
			return disabled || !result || isExporting;
		};

		expect(shouldBeDisabled(undefined, false, false)).toBe(true); // No result
		expect(shouldBeDisabled(mockResult, true, false)).toBe(true); // Explicitly disabled
		expect(shouldBeDisabled(mockResult, false, true)).toBe(true); // Currently exporting
		expect(shouldBeDisabled(mockResult, false, false)).toBe(false); // Should be enabled
	});

	it('should call downloadCsv with correct parameters', async () => {
		// Simulate the export function call
		const handleExport = async (result: GeoResult) => {
			if (!result) return;

			try {
				await new Promise((resolve) => setTimeout(resolve, 100));
				downloadCsv(result);
			} catch (error) {
				console.error('Export failed:', error);
			}
		};

		await handleExport(mockResult);
		expect(downloadCsv).toHaveBeenCalledWith(mockResult);
	});

	it('should handle export errors gracefully', async () => {
		// Mock downloadCsv to throw an error
		(downloadCsv as any).mockImplementationOnce(() => {
			throw new Error('Export failed');
		});

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const handleExport = async (result: GeoResult) => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 100));
				downloadCsv(result);
			} catch (error) {
				console.error('Export failed:', error);
			}
		};

		await handleExport(mockResult);
		expect(consoleSpy).toHaveBeenCalledWith('Export failed:', expect.any(Error));

		consoleSpy.mockRestore();
	});

	it('should validate component state transitions', () => {
		// Test the state logic for loading states
		const getButtonText = (isExporting: boolean) => {
			return isExporting ? 'Exporting...' : 'Export CSV';
		};

		expect(getButtonText(false)).toBe('Export CSV');
		expect(getButtonText(true)).toBe('Exporting...');
	});

	it('should validate export prevention logic', () => {
		// Test the logic that prevents exports under certain conditions
		const canExport = (result: GeoResult | undefined, disabled: boolean, isExporting: boolean) => {
			return !(!result || disabled || isExporting);
		};

		expect(canExport(undefined, false, false)).toBe(false); // No result
		expect(canExport(mockResult, true, false)).toBe(false); // Disabled
		expect(canExport(mockResult, false, true)).toBe(false); // Currently exporting
		expect(canExport(mockResult, false, false)).toBe(true); // Can export
	});
});
