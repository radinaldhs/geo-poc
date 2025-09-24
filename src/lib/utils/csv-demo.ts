// Demo script to test CSV export functionality
// This can be run in the browser console to test the CSV export

import { downloadCsv } from './csv.js';
import type { GeoResult } from '../types.js';

export function testCsvExport() {
	const sampleResult: GeoResult = {
		url: 'example.com',
		overallScore: 85,
		testedQueries: [
			{ query: 'best pizza near me', score: 90, cited: true },
			{ query: 'pizza delivery hours', score: 75, cited: false },
			{ query: 'pizza menu prices', score: 80, cited: true },
			{ query: 'gluten free pizza options', score: 70, cited: false }
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
			},
			{
				source: 'example.com/contact',
				position: 'footer',
				excerpt: 'Visit us at 123 Main St for authentic Italian pizza experience.'
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

	console.log('Testing CSV export with sample data...');
	console.log('Sample result:', sampleResult);

	try {
		downloadCsv(sampleResult);
		console.log('CSV export completed successfully!');
		console.log('Check your downloads folder for: geo-analysis-example.com-[date].csv');
	} catch (error) {
		console.error('CSV export failed:', error);
	}
}

// Export for browser console testing
if (typeof window !== 'undefined') {
	(window as any).testCsvExport = testCsvExport;
}
