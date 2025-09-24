import { describe, it, expect } from 'vitest';

// URL validation regex - same as in UrlInput.svelte
const urlRegex =
	/^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?$/;

function validateUrl(value: string): boolean {
	if (!value.trim()) {
		return false;
	}
	return urlRegex.test(value.trim());
}

describe('URL Validation', () => {
	it('validates correct URLs', () => {
		const validUrls = [
			'example.com',
			'www.example.com',
			'https://example.com',
			'http://example.com',
			'subdomain.example.com',
			'example.com/path',
			'example-site.com',
			'test.co.uk',
			'my-site.org',
			'site123.net'
		];

		validUrls.forEach((url) => {
			expect(validateUrl(url)).toBe(true);
		});
	});

	it('rejects invalid URLs', () => {
		const invalidUrls = [
			'',
			'   ',
			'not-a-url',
			'just text',
			'http://',
			'https://',
			'.com',
			'example.',
			'example..com',
			'-example.com',
			'example-.com'
		];

		invalidUrls.forEach((url) => {
			expect(validateUrl(url)).toBe(false);
		});
	});

	it('handles edge cases', () => {
		expect(validateUrl('a.co')).toBe(true); // Minimal valid domain with 2-letter TLD
		expect(validateUrl('localhost')).toBe(false); // No TLD
		expect(validateUrl('192.168.1.1')).toBe(false); // IP addresses not supported by this regex
		expect(validateUrl('example.com:8080')).toBe(false); // Ports not supported by this regex
	});
});
