<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation Header -->
		<nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
			<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<!-- Logo and Brand -->
					<div class="flex items-center space-x-4">
						<NuxtLink to="/" class="flex items-center space-x-3 group">
							<div class="relative">
								<div
									class="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl">
									<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path d="M8 5v10l8-5-8-5z" />
									</svg>
								</div>
								<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse">
								</div>
							</div>
							<div class="hidden sm:block">
								<h1
									class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									CourseHub
								</h1>
								<p class="-mt-1 text-xs text-gray-500">Learn & Grow</p>
							</div>
						</NuxtLink>
					</div>

					<!-- Search Bar and Navigation -->
					<div class="flex flex-1 justify-center items-center px-4 lg:px-8">
						<!-- Desktop Navigation Links -->
						<div class="hidden items-center space-x-8 md:flex lg:mr-8">
							<NuxtLink to="/" class="nav-link group">
								<svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z">
									</path>
								</svg>
								Courses
							</NuxtLink>
							<NuxtLink to="/about" class="nav-link group">
								<svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								About
							</NuxtLink>
						</div>

						<!-- Search Bar -->
						<div class="relative w-full max-w-lg">
							<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
								</svg>
							</div>
							<input v-model="searchQuery" @keyup.enter="handleSearch" @input="handleSearchInput"
								type="text" placeholder="Search courses, topics, or instructors..."
								class="py-2.5 pr-12 pl-10 w-full text-sm bg-gray-50 rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white">
							<div v-if="searchQuery" class="flex absolute inset-y-0 right-0 items-center pr-3">
								<button @click="clearSearch"
									class="p-1 text-gray-400 transition-colors duration-150 hover:text-gray-600">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>

							<!-- Search Suggestions/Results Dropdown -->
							<div v-if="showSearchResults && (searchResults.length > 0 || searchQuery.length > 2)"
								class="overflow-y-auto absolute right-0 left-0 top-full z-50 mt-2 max-h-96 bg-white rounded-xl border border-gray-200 shadow-lg">

								<!-- Search Results -->
								<div v-if="searchResults.length > 0" class="py-2">
									<div
										class="px-4 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase border-b border-gray-100">
										Courses ({{ searchResults.length }})
									</div>
									<div v-for="result in searchResults" :key="result.id"
										@click="selectSearchResult(result)"
										class="px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 last:border-b-0">
										<div class="flex items-center space-x-3">
											<div
												class="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
												<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path d="M8 5v10l8-5-8-5z" />
												</svg>
											</div>
											<div class="flex-1 min-w-0">
												<p class="text-sm font-medium text-gray-900 truncate">{{ result.title }}
												</p>
												<p v-if="result.shortDescription"
													class="text-xs text-gray-500 truncate">{{ result.shortDescription }}
												</p>
												<div class="flex items-center mt-1 space-x-2">
													<span class="px-2 py-0.5 text-xs font-medium rounded-full"
														:class="getLevelClass(result.level)">
														{{ result.level }}
													</span>
													<span v-if="result.instructor?.name" class="text-xs text-gray-400">
														by {{ result.instructor.name }}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<!-- No Results -->
								<div v-else-if="searchQuery.length > 2" class="px-4 py-8 text-center">
									<svg class="mx-auto mb-3 w-12 h-12 text-gray-300" fill="none" stroke="currentColor"
										viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
									</svg>
									<p class="text-sm text-gray-500">No courses found for "{{ searchQuery }}"</p>
									<p class="mt-1 text-xs text-gray-400">Try different keywords or browse all courses
									</p>
								</div>

								<!-- Quick Actions -->
								<div v-if="searchQuery.length > 2" class="px-4 py-3 border-t border-gray-100">
									<button @click="handleSearch"
										class="w-full text-sm font-medium text-left text-blue-600 hover:text-blue-700">
										View all results for "{{ searchQuery }}"
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- User Menu -->
					<div class="flex items-center space-x-4">
						<!-- User Profile Dropdown -->
						<div class="relative" v-if="user">
							<button @click="toggleUserMenu"
								class="flex items-center p-2 space-x-2 rounded-lg transition-colors hover:bg-gray-100">
								<div
									class="flex justify-center items-center w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
									<span class="text-sm font-semibold text-white">{{ getUserInitials() }}</span>
								</div>
								<svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': showUserMenu }" fill="none"
									stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>

							<!-- Dropdown Menu -->
							<div v-show="showUserMenu"
								class="absolute right-0 z-50 py-2 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg">
								<NuxtLink to="/profile" @click="showUserMenu = false" class="dropdown-item">
									<svg class="mr-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
										</path>
									</svg>
									Profile
								</NuxtLink>
								<button @click="signOut"
									class="w-full text-left text-red-600 dropdown-item hover:bg-red-50">
									<svg class="mr-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
										</path>
									</svg>
									Sign Out
								</button>
							</div>
						</div>

						<!-- Login Button -->
						<NuxtLink v-else to="/login"
							class="px-6 py-2 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md transition-all duration-200 transform hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105">
							Sign In
						</NuxtLink>

						<!-- Mobile Menu Button -->
						<button @click="toggleMobileMenu" class="p-2 rounded-lg md:hidden hover:bg-gray-100">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile Navigation Menu -->
			<div v-show="showMobileMenu" class="bg-white border-t border-gray-200 shadow-lg md:hidden">
				<div class="px-4 py-4 space-y-3">
					<!-- Mobile Search Bar -->
					<div class="relative">
						<div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<input v-model="searchQuery" @keyup.enter="handleSearch" type="text"
							placeholder="Search courses..."
							class="py-2 pr-10 pl-9 w-full text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
						<div v-if="searchQuery" class="flex absolute inset-y-0 right-0 items-center pr-3">
							<button @click="clearSearch" class="p-1 text-gray-400 hover:text-gray-600">
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>
						</div>
					</div>

					<!-- Navigation Links -->
					<div class="pt-2 space-y-2 border-t border-gray-100">
						<NuxtLink to="/" @click="showMobileMenu = false" class="mobile-nav-link">
							<svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z">
								</path>
							</svg>
							Courses
						</NuxtLink>
						<NuxtLink to="/about" @click="showMobileMenu = false" class="mobile-nav-link">
							<svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							About
						</NuxtLink>
						<div v-if="user" class="pt-2 mt-2 border-t border-gray-200">
							<NuxtLink to="/profile" @click="showMobileMenu = false" class="mobile-nav-link">
								<svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
								Profile
							</NuxtLink>
							<button @click="signOut; showMobileMenu = false"
								class="w-full text-left text-red-600 mobile-nav-link">
								<svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
									</path>
								</svg>
								Sign Out
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="flex-1">
			<NuxtPage />
		</main>

		<!-- Footer -->
		<footer class="mt-auto text-white bg-gray-900">
			<div class="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
					<!-- Brand Section -->
					<div class="col-span-1 md:col-span-2">
						<div class="flex items-center mb-4 space-x-3">
							<div
								class="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l8-5-8-5z" />
								</svg>
							</div>
							<h3 class="text-xl font-bold text-white">CourseHub</h3>
						</div>
						<p class="mb-4 max-w-md text-gray-400">
							Empowering learners with high-quality educational content.
							Join thousands of students advancing their skills.
						</p>
						<div class="flex space-x-4">
							<a href="#" class="text-gray-400 transition-colors hover:text-white">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
								</svg>
							</a>
							<a href="#" class="text-gray-400 transition-colors hover:text-white">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</a>
						</div>
					</div>

					<!-- Quick Links -->
					<div>
						<h4 class="mb-4 text-lg font-semibold">Quick Links</h4>
						<ul class="space-y-2">
							<li>
								<NuxtLink to="/" class="footer-link">All Courses</NuxtLink>
							</li>
							<li>
								<NuxtLink to="/about" class="footer-link">About Us</NuxtLink>
							</li>
							<li><a href="#" class="footer-link">Contact</a></li>
							<li><a href="#" class="footer-link">Help Center</a></li>
						</ul>
					</div>

					<!-- Legal -->
					<div>
						<h4 class="mb-4 text-lg font-semibold">Legal</h4>
						<ul class="space-y-2">
							<li><a href="#" class="footer-link">Privacy Policy</a></li>
							<li><a href="#" class="footer-link">Terms of Service</a></li>
							<li><a href="#" class="footer-link">Cookie Policy</a></li>
							<li><a href="#" class="footer-link">GDPR</a></li>
						</ul>
					</div>
				</div>

				<!-- Bottom Bar -->
				<div class="flex flex-col justify-between items-center pt-8 mt-8 border-t border-gray-800 md:flex-row">
					<p class="text-sm text-gray-400">
						© {{ currentYear }} CourseHub. All rights reserved.
					</p>
					<div class="flex items-center mt-4 space-x-4 md:mt-0">
						<span class="text-sm text-gray-400">Made with</span>
						<svg class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd"
								d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
								clip-rule="evenodd"></path>
						</svg>
						<span class="text-sm text-gray-400">by CourseHub Team</span>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>

<script setup>
	const supabase = useSupabaseClient()
	const user = useSupabaseUser()

	// Reactive state
	const showUserMenu = ref(false)
	const showMobileMenu = ref(false)
	const currentYear = new Date().getFullYear()

	// Search functionality
	const searchQuery = ref('')
	const searchResults = ref([])
	const showSearchResults = ref(false)
	const searchTimeout = ref(null)

	// Close menus when clicking outside
	onMounted(() => {
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.relative')) {
				showUserMenu.value = false
				showSearchResults.value = false
			}
			if (!e.target.closest('nav')) {
				showMobileMenu.value = false
			}
		})
	})

	/**
	 * Toggle user dropdown menu
	 */
	const toggleUserMenu = () => {
		showUserMenu.value = !showUserMenu.value
		showMobileMenu.value = false
	}

	/**
	 * Toggle mobile navigation menu
	 */
	const toggleMobileMenu = () => {
		showMobileMenu.value = !showMobileMenu.value
		showUserMenu.value = false
	}

	/**
	 * Get user initials for avatar
	 */
	const getUserInitials = () => {
		if (!user.value?.email) return 'U'
		const email = user.value.email
		return email.charAt(0).toUpperCase()
	}

	/**
	 * Log user out
	 * 
	 * @returns {Promise<void>}
	 */
	const signOut = async () => {
		const res = await supabase.auth.signOut()

		if (res.error) {
			console.error(res.error)
		} else {
			showUserMenu.value = false
			showMobileMenu.value = false
			navigateTo('/login')
		}
	}

	/**
	 * Handle search input with debouncing
	 * 
	 * @returns {void}
	 */
	const handleSearchInput = () => {
		showSearchResults.value = true

		// Clear previous timeout
		if (searchTimeout.value) {
			clearTimeout(searchTimeout.value)
		}

		// Only search if query is at least 2 characters
		if (searchQuery.value.length < 2) {
			searchResults.value = []
			return
		}

		// Debounce search
		searchTimeout.value = setTimeout(async () => {
			try {
				const response = await $fetch('/api/courses/search', {
					query: {
						search: searchQuery.value
					}
				})
				searchResults.value = response.body.courses || []
			} catch (error) {
				console.error('Search error:', error)
				searchResults.value = []
			}
		}, 300)
	}

	/**
	 * Handle search submission (Enter key or "View all results" button)
	 * 
	 * @returns {void}
	 */
	const handleSearch = () => {
		if (searchQuery.value.trim()) {
			showSearchResults.value = false
			showMobileMenu.value = false

			// Navigate to search results page or home with search query
			navigateTo({
				path: '/',
				query: { search: searchQuery.value.trim() }
			})
		}
	}

	/**
	 * Clear search input and results
	 * 
	 * @returns {void}
	 */
	const clearSearch = () => {
		searchQuery.value = ''
		searchResults.value = []
		showSearchResults.value = false

		if (searchTimeout.value) {
			clearTimeout(searchTimeout.value)
		}
	}

	/**
	 * Select a search result
	 * 
	 * @param {Object} result - Selected course result
	 * @returns {void}
	 */
	const selectSearchResult = (result) => {
		showSearchResults.value = false
		showMobileMenu.value = false

		// Navigate to course page
		navigateTo(`/courses/${result.slug}`)
	}

	/**
	 * Get CSS classes for course level badge
	 * 
	 * @param {string} level - Course level
	 * @returns {string}
	 */
	const getLevelClass = (level) => {
		const levelClasses = {
			'BEGINNER': 'text-green-700 bg-green-100',
			'INTERMEDIATE': 'text-yellow-700 bg-yellow-100',
			'ADVANCED': 'text-red-700 bg-red-100'
		}
		return levelClasses[level] || 'text-gray-700 bg-gray-100'
	}
</script>

<style scoped>

	/* Navigation Styles */
	.nav-link {
		@apply flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200;
	}

	.nav-link.router-link-active {
		@apply text-blue-600 bg-blue-50;
	}

	.dropdown-item {
		@apply flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150;
	}

	.mobile-nav-link {
		@apply flex items-center px-3 py-3 text-base font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200;
	}

	.mobile-nav-link.router-link-active {
		@apply text-blue-600 bg-blue-50;
	}

	.footer-link {
		@apply text-gray-400 hover:text-white transition-colors duration-200;
	}

	/* Animations */
	.rotate-180 {
		transform: rotate(180deg);
		transition: transform 0.2s ease-in-out;
	}

	/* Responsive utilities */
	@media (max-width: 768px) {
		.line-clamp-2 {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>