import { describe, it, expect } from 'vitest';
import { mockResultFor, shouldSimulateError, getMockError, getProcessingDelay } from './data.js';

describe('Mock Data System', () => {
	describe('mockResultFor', () => {
		it('should return deterministic results for the same URL', () => {
			const url = 'https://example.com';
			const result1 = mockResultFor(url);
			const result2 = mockResultFor(url);

			expect(result1).toEqual(result2);
			expect(result1.url).toBe(url);
			expect(result2.url).toBe(url);
		});

		it('should return different fixtures for different URLs', () => {
			const urls = [
				'https://example.com',
				'https://test.com',
				'https://demo.com',
				'https://sample.com'
			];

			const results = urls.map((url) => mockResultFor(url));

			// Should have at least 2 different scores (likely all 3 fixtures)
			const uniqueScores = new Set(results.map((r) => r.overallScore));
			expect(uniqueScores.size).toBeGreaterThan(1);
		});

		it('should return valid GeoResult structure', () => {
			const result = mockResultFor('https://test.com');

			// Check required properties exist
			expect(result).toHaveProperty('url');
			expect(result).toHaveProperty('overallScore');
			expect(result).toHaveProperty('testedQueries');
			expect(result).toHaveProperty('citations');
			expect(result).toHaveProperty('recommendations');

			// Check types
			expect(typeof result.url).toBe('string');
			expect(typeof result.overallScore).toBe('number');
			expect(Array.isArray(result.testedQueries)).toBe(true);
			expect(Array.isArray(result.citations)).toBe(true);
			expect(typeof result.recommendations).toBe('object');
		});

		it('should return scores within valid range (0-100)', () => {
			const urls = ['https://example.com', 'https://test.com', 'https://demo.com'];

			urls.forEach((url) => {
				const result = mockResultFor(url);
				expect(result.overallScore).toBeGreaterThanOrEqual(0);
				expect(result.overallScore).toBeLessThanOrEqual(100);
			});
		});

		it('should have valid query items structure', () => {
			const result = mockResultFor('https://test.com');

			expect(result.testedQueries.length).toBeGreaterThan(0);

			result.testedQueries.forEach((query) => {
				expect(query).toHaveProperty('query');
				expect(query).toHaveProperty('score');
				expect(query).toHaveProperty('cited');

				expect(typeof query.query).toBe('string');
				expect(typeof query.score).toBe('number');
				expect(typeof query.cited).toBe('boolean');

				expect(query.query.length).toBeGreaterThan(0);
				expect(query.score).toBeGreaterThanOrEqual(0);
				expect(query.score).toBeLessThanOrEqual(100);
			});
		});

		it('should have valid citation items structure', () => {
			const result = mockResultFor('https://test.com');

			expect(result.citations.length).toBeGreaterThan(0);

			result.citations.forEach((citation) => {
				expect(citation).toHaveProperty('source');
				expect(citation).toHaveProperty('position');
				expect(citation).toHaveProperty('excerpt');

				expect(typeof citation.source).toBe('string');
				expect(['body', 'faq', 'footer']).toContain(citation.position);
				expect(typeof citation.excerpt).toBe('string');

				expect(citation.source.length).toBeGreaterThan(0);
				expect(citation.excerpt.length).toBeGreaterThan(0);
			});
		});

		it('should have valid recommendations structure', () => {
			const result = mockResultFor('https://test.com');
			const rec = result.recommendations;

			expect(rec).toHaveProperty('headline');
			expect(rec).toHaveProperty('faqs');
			expect(rec).toHaveProperty('jsonldType');
			expect(rec).toHaveProperty('jsonldSnippet');

			expect(typeof rec.headline).toBe('string');
			expect(Array.isArray(rec.faqs)).toBe(true);
			expect(['FAQPage', 'HowTo', 'Product']).toContain(rec.jsonldType);
			expect(typeof rec.jsonldSnippet).toBe('string');

			expect(rec.headline.length).toBeGreaterThan(0);
			expect(rec.faqs.length).toBeGreaterThan(0);

			rec.faqs.forEach((faq) => {
				expect(faq).toHaveProperty('q');
				expect(faq).toHaveProperty('a');
				expect(typeof faq.q).toBe('string');
				expect(typeof faq.a).toBe('string');
				expect(faq.q.length).toBeGreaterThan(0);
				expect(faq.a.length).toBeGreaterThan(0);
			});
		});

		it('should cover all three fixture types', () => {
			// Test enough URLs to likely hit all fixtures
			const urls = Array.from({ length: 20 }, (_, i) => `https://test${i}.com`);
			const results = urls.map((url) => mockResultFor(url));
			const uniqueScores = new Set(results.map((r) => r.overallScore));

			// Should have all 3 different fixture scores
			expect(uniqueScores.size).toBe(3);
			expect(uniqueScores.has(42)).toBe(true); // Weak fixture
			expect(uniqueScores.has(61)).toBe(true); // Medium fixture
			expect(uniqueScores.has(78)).toBe(true); // Strong fixture
		});
	});

	describe('shouldSimulateError', () => {
		it('should return deterministic results for the same URL', () => {
			const url = 'https://example.com';
			const result1 = shouldSimulateError(url);
			const result2 = shouldSimulateError(url);

			expect(result1).toBe(result2);
		});

		it('should return boolean values', () => {
			const urls = ['https://test1.com', 'https://test2.com', 'https://test3.com'];

			urls.forEach((url) => {
				const result = shouldSimulateError(url);
				expect(typeof result).toBe('boolean');
			});
		});

		it('should simulate approximately 10% error rate', () => {
			// Test with many URLs to verify error rate
			const urls = Array.from({ length: 100 }, (_, i) => `https://test${i}.com`);
			const errorResults = urls.map((url) => shouldSimulateError(url));
			const errorCount = errorResults.filter(Boolean).length;

			// Should be approximately 10% (allow some variance)
			expect(errorCount).toBeGreaterThanOrEqual(5);
			expect(errorCount).toBeLessThanOrEqual(15);
		});

		it('should return different results for different URLs', () => {
			const urls = Array.from({ length: 100 }, (_, i) => `https://test${i}.com`);
			const results = urls.map((url) => shouldSimulateError(url));

			// Should have both true and false values
			expect(results.some((r) => r === true)).toBe(true);
			expect(results.some((r) => r === false)).toBe(true);
		});
	});

	describe('getMockError', () => {
		it('should return valid error structure', () => {
			const error = getMockError();

			expect(error).toHaveProperty('message');
			expect(error).toHaveProperty('retryable');

			expect(typeof error.message).toBe('string');
			expect(typeof error.retryable).toBe('boolean');

			expect(error.message.length).toBeGreaterThan(0);
			expect(error.retryable).toBe(true);
		});

		it('should return consistent error object', () => {
			const error1 = getMockError();
			const error2 = getMockError();

			expect(error1).toEqual(error2);
		});
	});

	describe('getProcessingDelay', () => {
		it('should return delay within expected range (2-3 seconds)', () => {
			for (let i = 0; i < 10; i++) {
				const delay = getProcessingDelay();
				expect(delay).toBeGreaterThanOrEqual(2000);
				expect(delay).toBeLessThan(3000);
			}
		});

		it('should return different values on multiple calls', () => {
			const delays = Array.from({ length: 10 }, () => getProcessingDelay());
			const uniqueDelays = new Set(delays);

			// Should have some variation (not all identical)
			expect(uniqueDelays.size).toBeGreaterThan(1);
		});
	});

	describe('Integration Tests', () => {
		it('should work together for complete mock flow', () => {
			const url = 'https://integration-test.com';

			// Check if error should be simulated
			const hasError = shouldSimulateError(url);

			if (hasError) {
				const error = getMockError();
				expect(error.retryable).toBe(true);
			} else {
				const result = mockResultFor(url);
				expect(result.url).toBe(url);
				expect(result.overallScore).toBeGreaterThan(0);
			}

			// Processing delay should always be valid
			const delay = getProcessingDelay();
			expect(delay).toBeGreaterThanOrEqual(2000);
			expect(delay).toBeLessThan(3000);
		});
	});
});
