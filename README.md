# GEO POC Dashboard

A demonstration application that simulates a website analysis tool for search engine optimization insights. Built with SvelteKit, TypeScript, and TailwindCSS, this frontend-only application showcases a freemium model where users can analyze their websites and upgrade for full access to detailed insights.

## Features

- **Website Analysis**: Enter any domain or URL to receive a mock GEO score (0-100) with detailed insights
- **Freemium Model**: Basic insights are free, detailed analysis requires payment through Stripe
- **Deterministic Results**: Same URL always produces the same analysis results
- **Quick Content Editing**: Paid users can test content improvements and see score changes
- **CSV Export**: Export analysis data for further processing
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Mock Error Simulation**: 10% chance of simulated errors with retry functionality

## Technology Stack

- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS with custom color palette
- **State Management**: Svelte stores with localStorage persistence
- **Payment Processing**: Stripe Payment Links (test mode)
- **Build Tool**: Vite
- **Testing**: Vitest with component testing

## Quick Start

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd geo-poc
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
VITE_APP_NAME="GEO POC"
VITE_PAYMENT_LINK_URL="https://buy.stripe.com/test_xxx"
VITE_RETURN_URL="http://localhost:5173/dashboard?paid=1"
```

4. Start the development server:

```bash
npm run dev
# or
npm run dev -- --open
```

The application will be available at `http://localhost:5173`

## Environment Configuration

The application uses the following environment variables:

| Variable                | Description                      | Required | Default   |
| ----------------------- | -------------------------------- | -------- | --------- |
| `VITE_APP_NAME`         | Application name displayed in UI | No       | "GEO POC" |
| `VITE_PAYMENT_LINK_URL` | Stripe Payment Link URL          | Yes      | -         |
| `VITE_RETURN_URL`       | URL to redirect after payment    | Yes      | -         |

### Setting up Stripe Payment Links

1. Create a Stripe account and enable test mode
2. Create a Payment Link in the Stripe Dashboard
3. Set the success URL to your return URL with `?paid=1` parameter (redirects to dashboard)
4. Copy the Payment Link URL to your `.env` file

## Usage

### Free User Flow

1. Enter a domain or URL in the input field
2. Click "Scan" to analyze the website
3. View limited results:
   - First 2 tested queries (remaining blurred)
   - First citation (remaining blurred)
   - Recommendations panel is locked
4. Click any "Upgrade" button to access payment

### Paid User Flow

1. Complete payment through Stripe Payment Link
2. Return to dashboard with full access
3. View all analysis results without restrictions
4. Use Quick Edit panel to test content improvements
5. Export analysis data as CSV

### Testing Payment Flow

Use Stripe's test card numbers:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

## Development

### Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── ScoreCard.svelte
│   │   ├── TeaserList.svelte
│   │   ├── LockedPanel.svelte
│   │   └── ...
│   ├── stores/              # Svelte stores for state management
│   │   └── app.ts
│   ├── mock/                # Mock data generation
│   │   └── data.ts
│   ├── utils/               # Utility functions
│   │   ├── csv.ts
│   │   └── env.ts
│   └── types.ts             # TypeScript type definitions
├── routes/                  # SvelteKit routes
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── legal/
│       └── +page.svelte
└── app.css                  # Global styles and TailwindCSS
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev -- --open   # Start dev server and open browser

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run all tests
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:watch      # Run tests in watch mode

# Code Quality
npm run check           # Run TypeScript checks
npm run check:watch     # Run TypeScript checks in watch mode
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

### Testing

The application includes comprehensive tests:

- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Component interactions and data flow
- **Mock Data Tests**: Deterministic result generation

Run tests with:

```bash
npm run test
```

For watch mode during development:

```bash
npm run test:watch
```

### Mock Data System

The application uses deterministic mock data based on URL hashing:

- **Fixture A (Weak)**: 42/100 score, 1/5 queries cited
- **Fixture B (Medium)**: 61/100 score, 2/6 queries cited
- **Fixture C (Strong)**: 78/100 score, 4/8 queries cited

Error simulation occurs 10% of the time with retry functionality.

## Deployment

### Vercel Deployment (Recommended)

This application is optimized for deployment on Vercel with the following configuration:

#### Prerequisites

- Vercel account (free tier available)
- GitHub repository with your code

#### Automatic Deployment

1. **Connect Repository to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" and import your GitHub repository
   - Vercel will automatically detect SvelteKit and configure build settings

2. **Configure Environment Variables**:
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variables:

   ```bash
   VITE_APP_NAME="GEO POC"
   VITE_PAYMENT_LINK_URL="https://buy.stripe.com/live_YOUR_PAYMENT_LINK_ID"
   VITE_RETURN_URL="https://your-app-name.vercel.app/dashboard?paid=1"
   ```

   Use the `.env.production.example` file as a reference for production values.

3. **Deploy**:
   - Vercel will automatically build and deploy your application
   - Every push to your main branch will trigger a new deployment
   - Preview deployments are created for pull requests

#### Manual Deployment

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# For production deployment
vercel --prod
```

#### Vercel Configuration

The application includes a `vercel.json` configuration file that:

- Sets up SPA routing with fallback to `index.html`
- Configures the build command and output directory
- Ensures client-side routing works correctly

#### Build Configuration

The `svelte.config.js` is configured with:

- `@sveltejs/adapter-vercel` for optimal Vercel integration
- Node.js 20.x runtime specification
- SPA mode with fallback routing

### Alternative Deployment Options

#### Netlify

```bash
npm run build
# Drag and drop the .svelte-kit/output/client folder to Netlify
```

#### Static Hosting

For other static hosts, you may need to switch back to the static adapter:

```bash
npm install @sveltejs/adapter-static
# Update svelte.config.js to use adapter-static
npm run build
# Deploy the .svelte-kit/output/client folder
```

### Environment Variables for Production

**Required Variables:**

- `VITE_PAYMENT_LINK_URL`: Your production Stripe Payment Link
- `VITE_RETURN_URL`: Your production domain with `/dashboard?paid=1` parameter

**Optional Variables:**

- `VITE_APP_NAME`: Application name (defaults to "GEO POC")
- `VITE_STRIPE_SECRET_KEY`: For future server-side functionality

### Production Checklist

Before deploying to production:

1. ✅ Update Stripe Payment Link to production mode
2. ✅ Set correct return URL with your production domain
3. ✅ Test payment flow with real Stripe account
4. ✅ Verify all environment variables are set
5. ✅ Run `npm run build` locally to test build process
6. ✅ Test the application in production environment

### Troubleshooting Deployment

**Build Failures:**

- Ensure Node.js version compatibility (18, 20, or 22)
- Check that all dependencies are properly installed
- Verify TypeScript compilation with `npm run check`

**Routing Issues:**

- Ensure `vercel.json` is properly configured for SPA routing
- Check that fallback routing is working for direct URL access

**Environment Variable Issues:**

- Verify all required variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Ensure production Stripe links are valid

## Architecture Decisions

### Frontend-Only Design

- No backend services required
- All data is mocked deterministically
- Payment processing handled by Stripe Payment Links
- State persisted in localStorage

### Deterministic Mocking

- Same URL always produces same results
- Based on simple hash function
- Enables consistent testing and demos

### Freemium Model Implementation

- Content gating through CSS blur filters
- localStorage persistence for paid state
- Stripe Payment Links for secure payment processing

## Troubleshooting

### Common Issues

1. **Payment not working**: Check Stripe Payment Link URL in environment variables
2. **TypeScript errors**: Run `npm run check` to identify issues
3. **Styles not loading**: Ensure TailwindCSS is properly configured
4. **Tests failing**: Check mock data consistency and component props

### Development Tips

- Use browser dev tools to inspect localStorage for paid state
- Test different URLs to see different mock fixtures
- Use Stripe test cards for payment flow testing
- Check console for environment configuration warnings

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Check TypeScript: `npm run check`
6. Format code: `npm run format`
7. Commit changes: `git commit -m 'Add feature'`
8. Push to branch: `git push origin feature-name`
9. Create a Pull Request

## License

This is a demonstration application for proof-of-concept purposes.
