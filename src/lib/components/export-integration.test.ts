import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadCsv } from '../utils/csv.js';
import type { GeoResult } from '../types.js';

// Mock DOM APIs for integration test
const mockCreateElement = vi.fn();
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

beforeEach(() => {
	// Mock document.createElement
	mockCreateElement.mockReturnValue({
		download: '',
		setAttribute: vi.fn(),
		style: { visibility: '' },
		click: mockClick
	});

	// Mock URL methods
	mockCreateObjectURL.mockReturnValue('blob:mock-url');

	// Setup global mocks
	global.document = {
		createElement: mockCreateElement,
		body: {
			appendChild: mockAppendChild,
			removeChild: mockRemoveChild
		}
	} as any;

	global.URL = {
		createObjectURL: mockCreateObjectURL,
		revokeObjectURL: mockRevokeObjectURL
	} as any;

	global.Blob = vi.fn().mockImplementation((content, options) => ({
		content,
		options
	})) as any;

	vi.clearAllMocks();
});

describe('CSV Export Integration', () => {
	const mockGeoResult: GeoResult = {
		url: 'example.com',
		overallScore: 75,
		testedQueries: [
			{ query: 'best pizza near me', score: 85, cited: true },
			{ query: 'pizza delivery hours', score: 72, cited: false },
			{ query: 'pizza menu prices', score: 68, cited: true }
		],
		citations: [
			{
				source: 'example.com/about',
				position: 'body',
				excerpt: 'We serve the best pizza in town with fresh ingredients and authentic recipes.'
			},
			{
				source: 'example.com/menu',
				position: 'faq',
				excerpt: 'Our pizza is made with organic flour and locally sourced cheese.'
			}
		],
		recommendations: {
			headline: 'Best Pizza Restaurant in Downtown - Fresh Ingredients & Authentic Recipes',
			faqs: [
				{
					q: 'What makes your pizza special?',
					a: 'We use only the freshest ingredients, including organic flour and locally sourced cheese, combined with authentic Italian recipes passed down through generations.'
				},
				{
					q: 'Do you offer gluten-free options?',
					a: 'Yes, we offer a variety of gluten-free pizza crusts and toppings to accommodate dietary restrictions without compromising on taste.'
				}
			],
			jsonldType: 'FAQPage',
			jsonldSnippet:
				'{"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What makes your pizza special?"}]}'
		}
	};

	it('should export complete GeoResult data to CSV format', () => {
		downloadCsv(mockGeoResult);

		// Verify Blob was created with CSV content
		expect(global.Blob).toHaveBeenCalledWith(
			[expect.stringContaining('Section,Type,Data,Score,Status,Position,Source')],
			{ type: 'text/csv;charset=utf-8;' }
		);

		// Get the CSV content
		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		// Verify overall score is included
		expect(csvContent).toContain('Overall,Score,"75",75,Complete,,example.com');

		// Verify all queries are included
		expect(csvContent).toContain('Queries,Query,"best pizza near me",85,Cited,,example.com');
		expect(csvContent).toContain('Queries,Query,"pizza delivery hours",72,Not Cited,,example.com');
		expect(csvContent).toContain('Queries,Query,"pizza menu prices",68,Cited,,example.com');

		// Verify citations are included
		expect(csvContent).toContain(
			'Citations,Citation,"We serve the best pizza in town with fresh ingredients and authentic recipes.",,Found,body,example.com/about'
		);
		expect(csvContent).toContain(
			'Citations,Citation,"Our pizza is made with organic flour and locally sourced cheese.",,Found,faq,example.com/menu'
		);

		// Verify recommendations are included
		expect(csvContent).toContain(
			'Recommendations,Headline,"Best Pizza Restaurant in Downtown - Fresh Ingredients & Authentic Recipes",,Generated,,example.com'
		);
		expect(csvContent).toContain(
			'Recommendations,FAQ Question,"What makes your pizza special?",,Generated,,example.com'
		);
		expect(csvContent).toContain(
			'Recommendations,FAQ Answer,"We use only the freshest ingredients, including organic flour and locally sourced cheese, combined with authentic Italian recipes passed down through generations.",,Generated,,example.com'
		);
		expect(csvContent).toContain('Recommendations,JSON-LD Type,"FAQPage",,Generated,,example.com');
	});

	it('should handle CSV export with special characters and quotes', () => {
		const resultWithSpecialChars: GeoResult = {
			...mockGeoResult,
			testedQueries: [{ query: 'pizza with "special" sauce', score: 80, cited: true }],
			citations: [
				{
					source: 'example.com/special',
					position: 'body',
					excerpt: 'Our "signature" sauce contains herbs, spices, and a touch of "magic".'
				}
			]
		};

		downloadCsv(resultWithSpecialChars);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		// Verify quotes are properly escaped
		expect(csvContent).toContain('pizza with ""special"" sauce');
		expect(csvContent).toContain(
			'Our ""signature"" sauce contains herbs, spices, and a touch of ""magic"".'
		);
	});

	it('should generate proper filename with domain and date', () => {
		downloadCsv(mockGeoResult);

		const linkElement = mockCreateElement.mock.results[0].value;
		const setAttributeCalls = linkElement.setAttribute.mock.calls;

		const downloadCall = setAttributeCalls.find((call: any) => call[0] === 'download');
		expect(downloadCall[1]).toMatch(/geo-analysis-example\.com-\d{4}-\d{2}-\d{2}\.csv/);
	});

	it('should trigger proper download sequence', () => {
		downloadCsv(mockGeoResult);

		// Verify the complete download sequence
		expect(mockCreateElement).toHaveBeenCalledWith('a');
		expect(mockCreateObjectURL).toHaveBeenCalled();
		expect(mockAppendChild).toHaveBeenCalled();
		expect(mockClick).toHaveBeenCalled();
		expect(mockRemoveChild).toHaveBeenCalled();
		expect(mockRevokeObjectURL).toHaveBeenCalled();
	});

	it('should handle empty or minimal data gracefully', () => {
		const minimalResult: GeoResult = {
			url: 'test.com',
			overallScore: 0,
			testedQueries: [],
			citations: [],
			recommendations: {
				headline: '',
				faqs: [],
				jsonldType: 'FAQPage',
				jsonldSnippet: ''
			}
		};

		downloadCsv(minimalResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		// Should still have headers and overall score
		expect(csvContent).toContain('Section,Type,Data,Score,Status,Position,Source');
		expect(csvContent).toContain('Overall,Score,"0",0,Complete,,test.com');
		expect(csvContent).toContain('Recommendations,JSON-LD Type,"FAQPage",,Generated,,test.com');
	});
});
