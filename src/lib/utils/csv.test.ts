import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadCsv } from './csv.js';
import type { GeoResult } from '../types.js';

// Mock DOM APIs
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
});

afterEach(() => {
	vi.clearAllMocks();
});

describe('CSV Export', () => {
	const mockResult: GeoResult = {
		url: 'example.com',
		overallScore: 75,
		testedQueries: [
			{ query: 'test query 1', score: 80, cited: true },
			{ query: 'test query 2', score: 65, cited: false }
		],
		citations: [
			{
				source: 'example.com/page1',
				position: 'body',
				excerpt: 'This is a test excerpt'
			}
		],
		recommendations: {
			headline: 'Test Headline',
			faqs: [{ q: 'Test question?', a: 'Test answer.' }],
			jsonldType: 'FAQPage',
			jsonldSnippet: '{"@type": "FAQPage"}'
		}
	};

	it('should create and trigger CSV download', () => {
		downloadCsv(mockResult);

		// Verify Blob creation
		expect(global.Blob).toHaveBeenCalledWith(
			[expect.stringContaining('Section,Type,Data,Score,Status,Position,Source')],
			{ type: 'text/csv;charset=utf-8;' }
		);

		// Verify DOM manipulation
		expect(mockCreateElement).toHaveBeenCalledWith('a');
		expect(mockCreateObjectURL).toHaveBeenCalled();
		expect(mockAppendChild).toHaveBeenCalled();
		expect(mockClick).toHaveBeenCalled();
		expect(mockRemoveChild).toHaveBeenCalled();
		expect(mockRevokeObjectURL).toHaveBeenCalled();
	});

	it('should generate correct CSV headers', () => {
		downloadCsv(mockResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain('Section,Type,Data,Score,Status,Position,Source');
	});

	it('should include overall score in CSV', () => {
		downloadCsv(mockResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain('Overall,Score,"75",75,Complete,,example.com');
	});

	it('should include tested queries in CSV', () => {
		downloadCsv(mockResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain('Queries,Query,"test query 1",80,Cited,,example.com');
		expect(csvContent).toContain('Queries,Query,"test query 2",65,Not Cited,,example.com');
	});

	it('should include citations in CSV', () => {
		downloadCsv(mockResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain(
			'Citations,Citation,"This is a test excerpt",,Found,body,example.com/page1'
		);
	});

	it('should include recommendations in CSV', () => {
		downloadCsv(mockResult);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain(
			'Recommendations,Headline,"Test Headline",,Generated,,example.com'
		);
		expect(csvContent).toContain(
			'Recommendations,FAQ Question,"Test question?",,Generated,,example.com'
		);
		expect(csvContent).toContain(
			'Recommendations,FAQ Answer,"Test answer.",,Generated,,example.com'
		);
		expect(csvContent).toContain('Recommendations,JSON-LD Type,"FAQPage",,Generated,,example.com');
	});

	it('should escape quotes in CSV values', () => {
		const resultWithQuotes: GeoResult = {
			...mockResult,
			testedQueries: [{ query: 'query with "quotes"', score: 80, cited: true }]
		};

		downloadCsv(resultWithQuotes);

		const blobCall = (global.Blob as any).mock.calls[0];
		const csvContent = blobCall[0][0];

		expect(csvContent).toContain('query with ""quotes""');
	});

	it('should generate filename with domain and date', () => {
		downloadCsv(mockResult);

		const linkElement = mockCreateElement.mock.results[0].value;
		const setAttributeCalls = linkElement.setAttribute.mock.calls;

		const downloadCall = setAttributeCalls.find((call: any) => call[0] === 'download');
		expect(downloadCall[1]).toMatch(/geo-analysis-example\.com-\d{4}-\d{2}-\d{2}\.csv/);
	});
});
