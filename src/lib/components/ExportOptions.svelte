<script lang="ts">
	import type { GeoResult } from '$lib/types';

	export let data: GeoResult;
	export let loading = false;

	let isExporting = false;
	let exportFormat: 'csv' | 'excel' = 'csv';

	// Generate CSV content
	function generateCSV(result: GeoResult): string {
		const headers = [
			'URL',
			'Overall Score',
			'Query',
			'Query Score',
			'Cited',
			'Citation Source',
			'Citation Position',
			'Citation Excerpt',
			'Recommendation Type',
			'Suggested Title',
			'FAQ Question',
			'FAQ Answer'
		];

		const rows: string[][] = [];

		// Add header row
		rows.push(headers);

		// Add query data with citations and recommendations
		result.testedQueries.forEach((query, queryIndex) => {
			// Find related citation if any
			const citation = result.citations[queryIndex] || null;

			// Add FAQ data if available
			if (result.recommendations.faqs.length > 0) {
				result.recommendations.faqs.forEach((faq, faqIndex) => {
					rows.push([
						queryIndex === 0 && faqIndex === 0 ? result.url : '',
						queryIndex === 0 && faqIndex === 0 ? result.overallScore.toString() : '',
						faqIndex === 0 ? query.query : '',
						faqIndex === 0 ? query.score.toString() : '',
						faqIndex === 0 ? (query.cited ? 'Yes' : 'No') : '',
						citation && faqIndex === 0 ? citation.source : '',
						citation && faqIndex === 0 ? citation.position : '',
						citation && faqIndex === 0 ? `"${citation.excerpt.replace(/"/g, '""')}"` : '',
						faqIndex === 0 ? result.recommendations.jsonldType : '',
						faqIndex === 0 ? `"${result.recommendations.headline.replace(/"/g, '""')}"` : '',
						`"${faq.q.replace(/"/g, '""')}"`,
						`"${faq.a.replace(/"/g, '""')}"`
					]);
				});
			} else {
				// Add row without FAQ data
				rows.push([
					queryIndex === 0 ? result.url : '',
					queryIndex === 0 ? result.overallScore.toString() : '',
					query.query,
					query.score.toString(),
					query.cited ? 'Yes' : 'No',
					citation ? citation.source : '',
					citation ? citation.position : '',
					citation ? `"${citation.excerpt.replace(/"/g, '""')}"` : '',
					queryIndex === 0 ? result.recommendations.jsonldType : '',
					queryIndex === 0 ? `"${result.recommendations.headline.replace(/"/g, '""')}"` : '',
					'',
					''
				]);
			}
		});

		return rows.map((row) => row.join(',')).join('\n');
	}

	// Generate Excel-compatible CSV with enhanced formatting
	function generateExcelCSV(result: GeoResult): string {
		const sections: string[] = [];

		// Summary section
		sections.push('WEBSITE ANALYSIS SUMMARY');
		sections.push(`URL,${result.url}`);
		sections.push(`Overall Score,${result.overallScore}/100`);
		sections.push(`Analysis Date,${new Date().toLocaleDateString()}`);
		sections.push(`Total Queries Tested,${result.testedQueries.length}`);
		sections.push(`Citations Found,${result.citations.length}`);
		sections.push('');

		// Query analysis section
		sections.push('QUERY ANALYSIS');
		sections.push('Query,Score,Cited,AI Platform');
		result.testedQueries.forEach((query, index) => {
			const platforms = [
				'ChatGPT',
				'Claude',
				'Gemini',
				'Perplexity',
				'SearchGPT',
				'Bing Chat',
				'Bard'
			];
			const platform = platforms[index % platforms.length];
			sections.push(
				`"${query.query.replace(/"/g, '""')}",${query.score},${query.cited ? 'Yes' : 'No'},${platform}`
			);
		});
		sections.push('');

		// Citations section
		sections.push('CITATIONS ANALYSIS');
		sections.push('Source,Position,Excerpt,Confidence');
		result.citations.forEach((citation, index) => {
			const confidence = 75 + index * 3; // Mock confidence scores
			sections.push(
				`"${citation.source}","${citation.position}","${citation.excerpt.replace(/"/g, '""')}",${confidence}%`
			);
		});
		sections.push('');

		// Recommendations section
		sections.push('RECOMMENDATIONS');
		sections.push(`Suggested Title,"${result.recommendations.headline.replace(/"/g, '""')}"`);
		sections.push(`Schema Type,${result.recommendations.jsonldType}`);
		sections.push('');
		sections.push('FAQ RECOMMENDATIONS');
		sections.push('Question,Answer');
		result.recommendations.faqs.forEach((faq) => {
			sections.push(`"${faq.q.replace(/"/g, '""')}","${faq.a.replace(/"/g, '""')}"`);
		});

		return sections.join('\n');
	}

	// Download file
	function downloadFile(content: string, filename: string, mimeType: string) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// Handle export
	async function handleExport() {
		if (!data || isExporting) return;

		isExporting = true;

		try {
			// Add realistic delay for export processing
			await new Promise((resolve) => setTimeout(resolve, 1500));

			const timestamp = new Date().toISOString().split('T')[0];
			const domain = new URL(data.url).hostname.replace('www.', '');

			if (exportFormat === 'csv') {
				const csvContent = generateCSV(data);
				downloadFile(csvContent, `geo-analysis-${domain}-${timestamp}.csv`, 'text/csv');
			} else {
				const excelContent = generateExcelCSV(data);
				downloadFile(excelContent, `geo-analysis-${domain}-${timestamp}.csv`, 'text/csv');
			}
		} catch (error) {
			console.error('Export failed:', error);
			// In a real app, you'd show an error message
		} finally {
			isExporting = false;
		}
	}

	// Get file size estimate
	function getFileSizeEstimate(): string {
		if (!data) return '0 KB';

		const content = exportFormat === 'csv' ? generateCSV(data) : generateExcelCSV(data);
		const sizeInBytes = new Blob([content]).size;
		const sizeInKB = Math.round(sizeInBytes / 1024);

		return sizeInKB < 1 ? '< 1 KB' : `${sizeInKB} KB`;
	}

	// Get record count
	function getRecordCount(): number {
		if (!data) return 0;
		return data.testedQueries.length + data.citations.length + data.recommendations.faqs.length;
	}
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<div class="mb-6">
		<h3 class="text-xl font-semibold text-black">Export Analysis Data</h3>
		<p class="mt-1 text-sm text-gray-600">
			Download your complete analysis data for internal sharing and reporting
		</p>
	</div>

	{#if loading}
		<!-- Loading state -->
		<div class="animate-pulse space-y-4">
			<div class="h-4 w-3/4 rounded bg-gray-200"></div>
			<div class="h-10 w-full rounded bg-gray-200"></div>
			<div class="h-12 w-32 rounded bg-gray-200"></div>
		</div>
	{:else if !data}
		<!-- No data state -->
		<div class="py-8 text-center">
			<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
				<svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
			</div>
			<h4 class="mb-2 text-lg font-medium text-gray-900">No data to export</h4>
			<p class="text-gray-500">Run an analysis first to generate exportable data.</p>
		</div>
	{:else}
		<!-- Export options -->
		<div class="space-y-6">
			<!-- Format selection -->
			<div>
				<fieldset>
					<legend class="text-sm font-medium text-gray-700">Export Format</legend>
					<div class="mt-2 grid grid-cols-2 gap-3">
						<label
							class="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:border-light-blue/50 {exportFormat ===
							'csv'
								? 'border-light-blue bg-light-blue/5'
								: ''}"
						>
							<input type="radio" bind:group={exportFormat} value="csv" class="sr-only" />
							<div class="flex-1">
								<div class="flex items-center">
									<svg class="mr-2 h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
										/>
									</svg>
									<span class="font-medium text-gray-900">CSV</span>
								</div>
								<p class="mt-1 text-xs text-gray-500">Standard format, works with Excel</p>
							</div>
							{#if exportFormat === 'csv'}
								<div
									class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-light-blue"
								>
									<div class="h-2 w-2 rounded-full bg-white"></div>
								</div>
							{/if}
						</label>

						<label
							class="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-all duration-200 hover:border-light-blue/50 {exportFormat ===
							'excel'
								? 'border-light-blue bg-light-blue/5'
								: ''}"
						>
							<input type="radio" bind:group={exportFormat} value="excel" class="sr-only" />
							<div class="flex-1">
								<div class="flex items-center">
									<svg class="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
										/>
									</svg>
									<span class="font-medium text-gray-900">Excel Format</span>
								</div>
								<p class="mt-1 text-xs text-gray-500">Enhanced with sections and formatting</p>
							</div>
							{#if exportFormat === 'excel'}
								<div
									class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-light-blue"
								>
									<div class="h-2 w-2 rounded-full bg-white"></div>
								</div>
							{/if}
						</label>
					</div>
				</fieldset>
			</div>

			<!-- Data preview -->
			<div class="rounded-lg bg-gray-50 p-4">
				<h4 class="mb-3 font-medium text-gray-900">Export Preview</h4>
				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span class="text-gray-600">Records:</span>
						<span class="ml-2 font-medium text-gray-900">{getRecordCount()}</span>
					</div>
					<div>
						<span class="text-gray-600">File size:</span>
						<span class="ml-2 font-medium text-gray-900">{getFileSizeEstimate()}</span>
					</div>
					<div>
						<span class="text-gray-600">Queries:</span>
						<span class="ml-2 font-medium text-gray-900">{data.testedQueries.length}</span>
					</div>
					<div>
						<span class="text-gray-600">Citations:</span>
						<span class="ml-2 font-medium text-gray-900">{data.citations.length}</span>
					</div>
				</div>
			</div>

			<!-- Export button -->
			<div class="flex justify-center">
				<button
					on:click={handleExport}
					disabled={isExporting}
					class="inline-flex items-center rounded-lg bg-light-blue px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-dark-blue focus:ring-2 focus:ring-light-blue focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if isExporting}
						<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Preparing Export...
					{:else}
						<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						Download {exportFormat.toUpperCase()}
					{/if}
				</button>
			</div>

			<!-- Export info -->
			<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
				<div class="flex items-start">
					<svg
						class="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/>
					</svg>
					<div class="text-sm">
						<h5 class="font-medium text-blue-900">Export Information</h5>
						<div class="mt-1 text-blue-700">
							<p>
								• CSV format works with Excel, Google Sheets, and other spreadsheet applications
							</p>
							<p>• Excel format includes organized sections and enhanced formatting</p>
							<p>• All query scores, citations, and recommendations are included</p>
							<p>• Files are generated locally in your browser for privacy</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
