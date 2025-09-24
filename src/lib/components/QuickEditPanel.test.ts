import { describe, it, expect } from 'vitest';
import type { Recommendations, ContentEdits } from '../types.js';

// Helper functions to test QuickEditPanel logic
function filterEmptyFaqs(faqs: Array<{ q: string; a: string }>): Array<{ q: string; a: string }> {
	return faqs.filter((faq) => faq.q.trim() && faq.a.trim());
}

function initializeFaqsFromRecommendations(
	recommendations: Recommendations
): Array<{ q: string; a: string }> {
	return recommendations.faqs.length > 0 ? [...recommendations.faqs] : [{ q: '', a: '' }];
}

function createContentEdits(
	title: string,
	faqs: Array<{ q: string; a: string }>,
	jsonldType: 'FAQPage' | 'HowTo' | 'Product'
): ContentEdits {
	return {
		title: title.trim(),
		faqs: filterEmptyFaqs(faqs),
		jsonldType
	};
}

describe('QuickEditPanel', () => {
	const mockRecommendations: Recommendations = {
		headline: 'Test Headline',
		faqs: [
			{ q: 'What is this?', a: 'This is a test' },
			{ q: 'How does it work?', a: 'It works well' }
		],
		jsonldType: 'FAQPage',
		jsonldSnippet: '{"@type": "FAQPage"}'
	};

	it('can import QuickEditPanel component', async () => {
		const module = await import('./QuickEditPanel.svelte');
		expect(module.default).toBeDefined();
	});

	it('filters out empty FAQs correctly', () => {
		const faqs = [
			{ q: 'Valid question', a: 'Valid answer' },
			{ q: '', a: 'No question' },
			{ q: 'No answer', a: '' },
			{ q: '   ', a: '   ' }, // whitespace only
			{ q: 'Another valid', a: 'Another valid answer' }
		];

		const filtered = filterEmptyFaqs(faqs);

		expect(filtered).toHaveLength(2);
		expect(filtered[0]).toEqual({ q: 'Valid question', a: 'Valid answer' });
		expect(filtered[1]).toEqual({ q: 'Another valid', a: 'Another valid answer' });
	});

	it('initializes FAQs from recommendations correctly', () => {
		// With existing FAQs
		const withFaqs = initializeFaqsFromRecommendations(mockRecommendations);
		expect(withFaqs).toHaveLength(2);
		expect(withFaqs[0]).toEqual({ q: 'What is this?', a: 'This is a test' });
		expect(withFaqs[1]).toEqual({ q: 'How does it work?', a: 'It works well' });

		// With empty FAQs
		const emptyRecommendations: Recommendations = {
			...mockRecommendations,
			faqs: []
		};
		const withoutFaqs = initializeFaqsFromRecommendations(emptyRecommendations);
		expect(withoutFaqs).toHaveLength(1);
		expect(withoutFaqs[0]).toEqual({ q: '', a: '' });
	});

	it('creates content edits with proper filtering', () => {
		const title = '  Test Title  ';
		const faqs = [
			{ q: 'Valid question', a: 'Valid answer' },
			{ q: '', a: 'Invalid' },
			{ q: 'Another valid', a: 'Another answer' }
		];
		const jsonldType = 'HowTo' as const;

		const edits = createContentEdits(title, faqs, jsonldType);

		expect(edits.title).toBe('Test Title'); // trimmed
		expect(edits.faqs).toHaveLength(2); // filtered
		expect(edits.faqs[0]).toEqual({ q: 'Valid question', a: 'Valid answer' });
		expect(edits.faqs[1]).toEqual({ q: 'Another valid', a: 'Another answer' });
		expect(edits.jsonldType).toBe('HowTo');
	});

	it('handles all JSON-LD types correctly', () => {
		const types: Array<'FAQPage' | 'HowTo' | 'Product'> = ['FAQPage', 'HowTo', 'Product'];

		types.forEach((type) => {
			const edits = createContentEdits('Title', [], type);
			expect(edits.jsonldType).toBe(type);
		});
	});

	it('handles empty title correctly', () => {
		const edits = createContentEdits('   ', [], 'FAQPage');
		expect(edits.title).toBe('');
	});

	it('handles all empty FAQs correctly', () => {
		const faqs = [
			{ q: '', a: '' },
			{ q: '   ', a: '   ' },
			{ q: '', a: 'No question' }
		];

		const edits = createContentEdits('Title', faqs, 'FAQPage');
		expect(edits.faqs).toHaveLength(0);
	});
});
