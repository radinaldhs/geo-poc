<script lang="ts">
	const contactInfo = {
		email: 'radinaldewantara@gmail.com',
		phone: '(+62) 896 713 133 29',
		address: '123 Innovation Drive, Tech City, TC 12345'
	};
</script>

<section class="bg-gray-50 py-16 sm:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold tracking-tight text-black sm:text-4xl">Get in Touch</h2>
			<p class="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
				Have questions about AI search optimization? We're here to help you succeed.
			</p>
		</div>

		<div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Email -->
			<div
				class="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
			>
				<div class="flex items-center space-x-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-light-blue text-white"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div>
						<h3
							class="text-lg font-semibold text-black transition-colors duration-200 group-hover:text-light-blue"
						>
							Email Us
						</h3>
						<a
							href="mailto:{contactInfo.email}"
							class="text-gray-600 transition-colors duration-200 hover:text-light-blue"
						>
							{contactInfo.email}
						</a>
					</div>
				</div>
			</div>

			<!-- Phone -->
			<div
				class="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
			>
				<div class="flex items-center space-x-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-light-blue text-white"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
					</div>
					<div>
						<h3
							class="text-lg font-semibold text-black transition-colors duration-200 group-hover:text-light-blue"
						>
							Call Us
						</h3>
						<a
							href="tel:{contactInfo.phone}"
							class="text-gray-600 transition-colors duration-200 hover:text-light-blue"
						>
							{contactInfo.phone}
						</a>
					</div>
				</div>
			</div>

			<!-- Address -->
			<div
				class="group rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
			>
				<div class="flex items-center space-x-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-lg bg-light-blue text-white"
					>
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
					</div>
					<div>
						<h3
							class="text-lg font-semibold text-black transition-colors duration-200 group-hover:text-light-blue"
						>
							Visit Us
						</h3>
						<p class="text-gray-600">
							{contactInfo.address}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Additional Contact Information -->
		<div class="mt-16 text-center">
			<div class="rounded-2xl bg-white p-8 shadow-lg">
				<h3 class="mb-4 text-xl font-semibold text-black">Business Inquiries & Partnerships</h3>
				<p class="mb-6 text-gray-600">
					Interested in enterprise solutions or partnership opportunities? We'd love to discuss how
					we can help scale your AI search optimization efforts.
				</p>
				<a
					href="mailto:radinaldewantara@gmail.com"
					class="inline-flex items-center rounded-md bg-dark-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-blue"
				>
					Contact Business Team
				</a>
			</div>
		</div>
	</div>
</section>
