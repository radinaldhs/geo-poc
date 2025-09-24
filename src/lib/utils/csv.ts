import type { GeoResult } from '../types.js';

/**
 * Converts GeoResult data to CSV format and triggers download
 */
export function downloadCsv(result: GeoResult): void {
	const csvContent = generateCsvContent(result);
	const filename = generateFilename(result.url);

	// Create blob and trigger download
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');

	if (link.download !== undefined) {
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}

/**
 * Generates CSV content from GeoResult data
 */
function generateCsvContent(result: GeoResult): string {
	const rows: string[] = [];

	// Add headers
	rows.push('Section,Type,Data,Score,Status,Position,Source');

	// Add overall score row
	rows.push(
		`Overall,Score,"${result.overallScore}",${result.overallScore},Complete,,${result.url}`
	);

	// Add tested queries
	result.testedQueries.forEach((query, index) => {
		const csvRow = [
			'Queries',
			'Query',
			`"${escapeQuotes(query.query)}"`,
			query.score.toString(),
			query.cited ? 'Cited' : 'Not Cited',
			'',
			result.url
		].join(',');
		rows.push(csvRow);
	});

	// Add citations
	result.citations.forEach((citation, index) => {
		const csvRow = [
			'Citations',
			'Citation',
			`"${escapeQuotes(citation.excerpt)}"`,
			'',
			'Found',
			citation.position,
			citation.source
		].join(',');
		rows.push(csvRow);
	});

	// Add recommendations
	const csvRow = [
		'Recommendations',
		'Headline',
		`"${escapeQuotes(result.recommendations.headline)}"`,
		'',
		'Generated',
		'',
		result.url
	].join(',');
	rows.push(csvRow);

	// Add FAQ recommendations
	result.recommendations.faqs.forEach((faq, index) => {
		const questionRow = [
			'Recommendations',
			'FAQ Question',
			`"${escapeQuotes(faq.q)}"`,
			'',
			'Generated',
			'',
			result.url
		].join(',');
		rows.push(questionRow);

		const answerRow = [
			'Recommendations',
			'FAQ Answer',
			`"${escapeQuotes(faq.a)}"`,
			'',
			'Generated',
			'',
			result.url
		].join(',');
		rows.push(answerRow);
	});

	// Add JSON-LD type
	const jsonldRow = [
		'Recommendations',
		'JSON-LD Type',
		`"${result.recommendations.jsonldType}"`,
		'',
		'Generated',
		'',
		result.url
	].join(',');
	rows.push(jsonldRow);

	return rows.join('\n');
}

/**
 * Escapes quotes in CSV values
 */
function escapeQuotes(value: string): string {
	return value.replace(/"/g, '""');
}

/**
 * Generates filename based on URL and current date
 */
function generateFilename(url: string): string {
	const domain = extractDomain(url);
	const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
	return `geo-analysis-${domain}-${timestamp}.csv`;
}

/**
 * Extracts domain from URL for filename
 */
function extractDomain(url: string): string {
	try {
		// Add protocol if missing
		const fullUrl = url.startsWith('http') ? url : `https://${url}`;
		const urlObj = new URL(fullUrl);
		return urlObj.hostname.replace(/[^a-zA-Z0-9.-]/g, ''); // Remove invalid filename characters
	} catch {
		// Fallback for invalid URLs
		return url.replace(/[^a-zA-Z0-9.-]/g, '').substring(0, 20);
	}
}
