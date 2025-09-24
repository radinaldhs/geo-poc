import type { GeoResult, MockError } from '../types.js';

// Simple hash function for deterministic fixture selection
function simpleHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

// Mock data fixtures - weak, medium, strong
const fixtures: GeoResult[] = [
	// Fixture A - Weak (42/100 score)
	{
		url: '',
		overallScore: 42,
		testedQueries: [
			{ query: 'best accounting software', score: 35, cited: false },
			{ query: 'small business accounting', score: 28, cited: true },
			{ query: 'quickbooks alternative', score: 45, cited: false },
			{ query: 'cloud accounting solution', score: 38, cited: false },
			{ query: 'affordable bookkeeping', score: 52, cited: false }
		],
		citations: [
			{
				source: 'Homepage',
				position: 'body',
				excerpt: 'Our accounting software helps small businesses manage their finances with ease.'
			}
		],
		recommendations: {
			headline: 'Improve Your AI Search Visibility',
			faqs: [
				{
					q: 'What makes your accounting software different?',
					a: 'Our software offers intuitive design and powerful features specifically built for small businesses.'
				},
				{
					q: 'How much does it cost?',
					a: 'We offer flexible pricing starting at $29/month with a 30-day free trial.'
				}
			],
			jsonldType: 'FAQPage',
			jsonldSnippet:
				'{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "What makes your accounting software different?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Our software offers intuitive design and powerful features specifically built for small businesses."\n      }\n    }\n  ]\n}'
		}
	},
	// Fixture B - Medium (61/100 score)
	{
		url: '',
		overallScore: 61,
		testedQueries: [
			{ query: 'project management tool', score: 72, cited: true },
			{ query: 'team collaboration software', score: 58, cited: false },
			{ query: 'agile project tracking', score: 65, cited: true },
			{ query: 'remote team management', score: 55, cited: false },
			{ query: 'task management app', score: 68, cited: false },
			{ query: 'scrum planning tool', score: 48, cited: false }
		],
		citations: [
			{
				source: 'Features Page',
				position: 'body',
				excerpt:
					'Streamline your project workflow with our comprehensive project management platform.'
			},
			{
				source: 'FAQ Section',
				position: 'faq',
				excerpt: 'Yes, our tool supports agile methodologies including Scrum and Kanban boards.'
			}
		],
		recommendations: {
			headline: 'Enhance Your Project Management Authority',
			faqs: [
				{
					q: 'Does your tool support agile methodologies?',
					a: 'Yes, we fully support Scrum, Kanban, and other agile frameworks with dedicated boards and sprint planning.'
				},
				{
					q: 'Can teams collaborate in real-time?',
					a: 'Absolutely! Our platform offers real-time collaboration with live updates, comments, and file sharing.'
				},
				{
					q: 'What integrations do you offer?',
					a: 'We integrate with over 50 popular tools including Slack, GitHub, Google Workspace, and Microsoft Teams.'
				}
			],
			jsonldType: 'HowTo',
			jsonldSnippet:
				'{\n  "@context": "https://schema.org",\n  "@type": "HowTo",\n  "name": "How to manage agile projects effectively",\n  "step": [\n    {\n      "@type": "HowToStep",\n      "name": "Set up your project board",\n      "text": "Create a new project and configure your Scrum or Kanban board with custom columns."\n    }\n  ]\n}'
		}
	},
	// Fixture C - Strong (78/100 score)
	{
		url: '',
		overallScore: 78,
		testedQueries: [
			{ query: 'email marketing platform', score: 85, cited: true },
			{ query: 'automated email campaigns', score: 82, cited: true },
			{ query: 'email newsletter software', score: 76, cited: true },
			{ query: 'marketing automation tool', score: 73, cited: false },
			{ query: 'email analytics dashboard', score: 88, cited: true },
			{ query: 'drip campaign builder', score: 71, cited: false },
			{ query: 'email template designer', score: 79, cited: false },
			{ query: 'subscriber management system', score: 74, cited: false }
		],
		citations: [
			{
				source: 'Homepage',
				position: 'body',
				excerpt:
					'The most powerful email marketing platform for growing businesses, with advanced automation and analytics.'
			},
			{
				source: 'Features Page',
				position: 'body',
				excerpt:
					'Create beautiful email campaigns with our drag-and-drop editor and pre-built templates.'
			},
			{
				source: 'FAQ Section',
				position: 'faq',
				excerpt:
					'Our platform provides detailed analytics including open rates, click-through rates, and conversion tracking.'
			},
			{
				source: 'Footer',
				position: 'footer',
				excerpt: 'Trusted by over 100,000 businesses worldwide for their email marketing needs.'
			}
		],
		recommendations: {
			headline: 'Maximize Your Email Marketing Performance',
			faqs: [
				{
					q: 'What automation features do you offer?',
					a: 'We provide advanced automation including drip campaigns, behavioral triggers, segmentation, and A/B testing capabilities.'
				},
				{
					q: 'How detailed are your analytics?',
					a: 'Our analytics dashboard shows open rates, click-through rates, conversion tracking, subscriber growth, and revenue attribution.'
				},
				{
					q: 'Do you offer email templates?',
					a: 'Yes, we have over 200 professionally designed templates that are mobile-responsive and customizable.'
				},
				{
					q: 'What integrations are available?',
					a: 'We integrate with major CRMs, e-commerce platforms, social media tools, and analytics platforms including Salesforce, Shopify, and Google Analytics.'
				}
			],
			jsonldType: 'Product',
			jsonldSnippet:
				'{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Email Marketing Platform",\n  "description": "Advanced email marketing automation with analytics and templates",\n  "offers": {\n    "@type": "Offer",\n    "price": "29.00",\n    "priceCurrency": "USD"\n  }\n}'
		}
	}
];

// Mock error for 10% simulation
const mockError: MockError = {
	message: 'Unable to analyze website. Please try again.',
	retryable: true
};

/**
 * Generate deterministic mock result based on URL hash
 */
export function mockResultFor(url: string): GeoResult {
	const hash = simpleHash(url);
	const fixtureIndex = hash % 3;
	const result = { ...fixtures[fixtureIndex] };
	result.url = url;
	return result;
}

/**
 * Simulate 10% error rate for mock realism
 */
export function shouldSimulateError(url: string): boolean {
	const hash = simpleHash(url + 'error');
	return hash % 10 === 0; // 10% chance
}

/**
 * Get mock error for display
 */
export function getMockError(): MockError {
	return { ...mockError };
}

/**
 * Simulate processing delay (2-3 seconds)
 */
export function getProcessingDelay(): number {
	return 2000 + Math.random() * 1000; // 2-3 seconds
}
