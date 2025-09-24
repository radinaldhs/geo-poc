/**
 * Enhanced analytics data for professional ScoreCard visualization
 */

export interface AnalyticsData {
	overallScore: number;
	scoreHistory: Array<{ date: string; score: number }>;
	categoryScores: Array<{ category: string; score: number; maxScore: number }>;
	competitorComparison: Array<{ name: string; score: number }>;
	queryPerformance: Array<{
		query: string;
		score: number;
		cited: boolean;
		trend: 'up' | 'down' | 'stable';
		impressions: number;
		clicks: number;
		ctr: number;
	}>;
	citationSources: Array<{
		source: string;
		count: number;
		quality: 'high' | 'medium' | 'low';
		position: string;
	}>;
	recommendations: Array<{
		priority: 'high' | 'medium' | 'low';
		category: string;
		title: string;
		description: string;
		impact: number;
		effort: number;
	}>;
	insights: {
		topPerformingQueries: string[];
		improvementAreas: string[];
		competitiveAdvantages: string[];
		riskFactors: string[];
	};
	metrics: {
		totalQueries: number;
		citedQueries: number;
		averagePosition: number;
		visibilityTrend: number;
		authorityScore: number;
		contentGaps: number;
	};
	geoScores: {
		contentQuality: {
			score: number;
			factors: {
				comprehensiveness: number;
				accuracy: number;
				freshness: number;
				readability: number;
				expertise: number;
			};
		};
		technicalOptimization: {
			score: number;
			factors: {
				structuredData: number;
				pageSpeed: number;
				mobileOptimization: number;
				crawlability: number;
				siteArchitecture: number;
			};
		};
		authoritySignals: {
			score: number;
			factors: {
				domainAuthority: number;
				backlinks: number;
				citations: number;
				brandMentions: number;
				expertAuthor: number;
			};
		};
		userExperience: {
			score: number;
			factors: {
				engagementMetrics: number;
				navigationClarity: number;
				contentAccessibility: number;
				interactiveElements: number;
				visualDesign: number;
			};
		};
		aiOptimization: {
			score: number;
			factors: {
				queryAlignment: number;
				contextualRelevance: number;
				semanticStructure: number;
				answerFormat: number;
				citationPotential: number;
			};
		};
	};
}

// Generate enhanced analytics data based on overall score
export function generateAnalyticsData(overallScore: number, url: string): AnalyticsData {
	const isHighPerformer = overallScore >= 70;
	const isMediumPerformer = overallScore >= 50;

	// Generate score history (last 30 days)
	const scoreHistory = Array.from({ length: 30 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (29 - i));
		const baseScore = overallScore;
		const variation = (Math.random() - 0.5) * 10; // ±5 points variation
		const score = Math.max(0, Math.min(100, baseScore + variation));

		return {
			date: date.toISOString().split('T')[0],
			score: Math.round(score)
		};
	});

	// Category performance breakdown
	const categoryScores = [
		{
			category: 'Content Quality',
			score: Math.round(overallScore + (Math.random() - 0.5) * 20),
			maxScore: 100
		},
		{
			category: 'Technical SEO',
			score: Math.round(overallScore + (Math.random() - 0.5) * 15),
			maxScore: 100
		},
		{
			category: 'Authority Signals',
			score: Math.round(overallScore + (Math.random() - 0.5) * 25),
			maxScore: 100
		},
		{
			category: 'User Experience',
			score: Math.round(overallScore + (Math.random() - 0.5) * 18),
			maxScore: 100
		},
		{
			category: 'Schema Markup',
			score: Math.round(overallScore + (Math.random() - 0.5) * 30),
			maxScore: 100
		}
	].map((cat) => ({
		...cat,
		score: Math.max(0, Math.min(100, cat.score))
	}));

	// Competitor comparison
	const competitors = ['Competitor A', 'Competitor B', 'Competitor C', 'Industry Average'];
	const competitorComparison = competitors
		.map((name) => ({
			name,
			score:
				name === 'Industry Average'
					? 55 + Math.random() * 10
					: overallScore + (Math.random() - 0.5) * 30
		}))
		.map((comp) => ({
			...comp,
			score: Math.max(20, Math.min(95, Math.round(comp.score)))
		}));

	// Enhanced query performance
	const queryTemplates = [
		'best {industry} software',
		'{industry} solution',
		'top {industry} platform',
		'{industry} tool comparison',
		'affordable {industry} service',
		'{industry} reviews',
		'how to choose {industry}',
		'{industry} pricing',
		'{industry} features',
		'{industry} alternatives'
	];

	const industries = ['accounting', 'project management', 'email marketing', 'CRM', 'analytics'];
	const industry = industries[Math.floor(Math.random() * industries.length)];

	const queryPerformance = queryTemplates
		.slice(0, 6 + Math.floor(Math.random() * 4))
		.map((template) => {
			const query = template.replace('{industry}', industry);
			const baseScore = overallScore + (Math.random() - 0.5) * 40;
			const score = Math.max(0, Math.min(100, Math.round(baseScore)));
			const impressions = Math.floor(Math.random() * 10000) + 1000;
			const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.08));

			return {
				query,
				score,
				cited: score > 60 && Math.random() > 0.3,
				trend: (Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down') as
					| 'up'
					| 'down'
					| 'stable',
				impressions,
				clicks,
				ctr: Math.round((clicks / impressions) * 100 * 100) / 100
			};
		});

	// Citation sources analysis
	const citationSources = [
		{
			source: 'Homepage',
			count: Math.floor(Math.random() * 5) + 1,
			quality: 'high' as const,
			position: 'Hero Section'
		},
		{
			source: 'Features Page',
			count: Math.floor(Math.random() * 8) + 2,
			quality: 'high' as const,
			position: 'Main Content'
		},
		{
			source: 'FAQ Section',
			count: Math.floor(Math.random() * 6) + 1,
			quality: 'medium' as const,
			position: 'FAQ Block'
		},
		{
			source: 'About Page',
			count: Math.floor(Math.random() * 3) + 1,
			quality: 'medium' as const,
			position: 'Company Info'
		},
		{
			source: 'Blog Posts',
			count: Math.floor(Math.random() * 10) + 3,
			quality: 'medium' as const,
			position: 'Article Content'
		},
		{
			source: 'Footer',
			count: Math.floor(Math.random() * 2) + 1,
			quality: 'low' as const,
			position: 'Footer Links'
		}
	];

	// Recommendations based on performance
	const allRecommendations = [
		{
			priority: 'high' as const,
			category: 'Content',
			title: 'Optimize FAQ Content',
			description:
				'Expand FAQ section with more comprehensive answers to improve AI citation rates',
			impact: 85,
			effort: 40
		},
		{
			priority: 'high' as const,
			category: 'Technical',
			title: 'Implement Schema Markup',
			description: 'Add structured data to improve search engine understanding and AI visibility',
			impact: 90,
			effort: 60
		},
		{
			priority: 'medium' as const,
			category: 'Content',
			title: 'Create How-To Guides',
			description: 'Develop step-by-step guides that AI systems can easily reference and cite',
			impact: 70,
			effort: 80
		},
		{
			priority: 'medium' as const,
			category: 'Authority',
			title: 'Build Topic Authority',
			description: 'Create comprehensive content clusters around core topics',
			impact: 75,
			effort: 90
		},
		{
			priority: 'low' as const,
			category: 'Technical',
			title: 'Improve Page Speed',
			description: 'Optimize loading times to improve user experience signals',
			impact: 50,
			effort: 70
		},
		{
			priority: 'high' as const,
			category: 'Content',
			title: 'Add Product Comparisons',
			description: 'Create detailed comparison content that addresses user queries directly',
			impact: 80,
			effort: 50
		}
	];

	const recommendations = allRecommendations
		.filter(() => Math.random() > 0.3) // Randomly select recommendations
		.slice(0, 4);

	// Generate insights based on performance
	const insights = {
		topPerformingQueries: queryPerformance
			.filter((q) => q.score > 70)
			.sort((a, b) => b.score - a.score)
			.slice(0, 3)
			.map((q) => q.query),
		improvementAreas: isHighPerformer
			? ['Schema markup optimization', 'Long-tail keyword coverage']
			: isMediumPerformer
				? ['Content depth', 'Technical SEO', 'Authority building']
				: ['Content quality', 'Basic SEO', 'User experience', 'Site structure'],
		competitiveAdvantages: isHighPerformer
			? ['Strong content authority', 'Excellent technical foundation', 'High citation rate']
			: isMediumPerformer
				? ['Good content base', 'Decent technical setup']
				: ['Room for significant improvement'],
		riskFactors: isHighPerformer
			? ['Competitor content gaps', 'Algorithm changes']
			: isMediumPerformer
				? ['Content freshness', 'Technical debt', 'Authority gaps']
				: ['Poor content quality', 'Technical issues', 'Low authority', 'User experience problems']
	};

	// Calculate metrics
	const citedQueries = queryPerformance.filter((q) => q.cited).length;
	const metrics = {
		totalQueries: queryPerformance.length,
		citedQueries,
		averagePosition: Math.round(
			queryPerformance.reduce((sum, q) => sum + (100 - q.score), 0) / queryPerformance.length / 10
		),
		visibilityTrend: Math.round((Math.random() - 0.4) * 20), // -8 to +12
		authorityScore: Math.round(overallScore * 0.8 + Math.random() * 20),
		contentGaps: Math.floor(Math.random() * 15) + 5
	};

	// Generate comprehensive GEO scores
	const geoScores = {
		contentQuality: {
			score: Math.round(overallScore + (Math.random() - 0.5) * 20),
			factors: {
				comprehensiveness: Math.round(overallScore + (Math.random() - 0.5) * 25),
				accuracy: Math.round(overallScore + (Math.random() - 0.5) * 15),
				freshness: Math.round(overallScore + (Math.random() - 0.5) * 30),
				readability: Math.round(overallScore + (Math.random() - 0.5) * 20),
				expertise: Math.round(overallScore + (Math.random() - 0.5) * 35)
			}
		},
		technicalOptimization: {
			score: Math.round(overallScore + (Math.random() - 0.5) * 25),
			factors: {
				structuredData: Math.round(overallScore + (Math.random() - 0.5) * 40),
				pageSpeed: Math.round(overallScore + (Math.random() - 0.5) * 20),
				mobileOptimization: Math.round(overallScore + (Math.random() - 0.5) * 15),
				crawlability: Math.round(overallScore + (Math.random() - 0.5) * 25),
				siteArchitecture: Math.round(overallScore + (Math.random() - 0.5) * 30)
			}
		},
		authoritySignals: {
			score: Math.round(overallScore + (Math.random() - 0.5) * 30),
			factors: {
				domainAuthority: Math.round(overallScore + (Math.random() - 0.5) * 35),
				backlinks: Math.round(overallScore + (Math.random() - 0.5) * 40),
				citations: Math.round(overallScore + (Math.random() - 0.5) * 25),
				brandMentions: Math.round(overallScore + (Math.random() - 0.5) * 45),
				expertAuthor: Math.round(overallScore + (Math.random() - 0.5) * 30)
			}
		},
		userExperience: {
			score: Math.round(overallScore + (Math.random() - 0.5) * 20),
			factors: {
				engagementMetrics: Math.round(overallScore + (Math.random() - 0.5) * 25),
				navigationClarity: Math.round(overallScore + (Math.random() - 0.5) * 20),
				contentAccessibility: Math.round(overallScore + (Math.random() - 0.5) * 30),
				interactiveElements: Math.round(overallScore + (Math.random() - 0.5) * 35),
				visualDesign: Math.round(overallScore + (Math.random() - 0.5) * 25)
			}
		},
		aiOptimization: {
			score: Math.round(overallScore + (Math.random() - 0.5) * 15),
			factors: {
				queryAlignment: Math.round(overallScore + (Math.random() - 0.5) * 20),
				contextualRelevance: Math.round(overallScore + (Math.random() - 0.5) * 25),
				semanticStructure: Math.round(overallScore + (Math.random() - 0.5) * 30),
				answerFormat: Math.round(overallScore + (Math.random() - 0.5) * 20),
				citationPotential: Math.round(overallScore + (Math.random() - 0.5) * 15)
			}
		}
	};

	// Ensure all scores are within 0-100 range
	Object.values(geoScores).forEach((category) => {
		category.score = Math.max(0, Math.min(100, category.score));
		Object.keys(category.factors).forEach((factor) => {
			(category.factors as any)[factor] = Math.max(
				0,
				Math.min(100, (category.factors as any)[factor])
			);
		});
	});

	return {
		overallScore,
		scoreHistory,
		categoryScores,
		competitorComparison,
		queryPerformance,
		citationSources,
		recommendations,
		insights,
		metrics,
		geoScores
	};
}
