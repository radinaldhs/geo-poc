export interface GeoResult {
	url: string;
	overallScore: number; // 0-100
	testedQueries: QueryItem[];
	citations: CitationItem[];
	recommendations: Recommendations;
}

export interface QueryItem {
	query: string;
	score: number;
	cited: boolean;
}

export interface CitationItem {
	source: string;
	position: 'body' | 'faq' | 'footer';
	excerpt: string;
}

export interface Recommendations {
	headline: string;
	faqs: Array<{ q: string; a: string }>;
	jsonldType: 'FAQPage' | 'HowTo' | 'Product';
	jsonldSnippet: string;
}

export interface MockError {
	message: string;
	retryable: boolean;
}

export interface ContentEdits {
	title: string;
	faqs: Array<{ q: string; a: string }>;
	jsonldType: 'FAQPage' | 'HowTo' | 'Product';
}
