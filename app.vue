<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation Header -->
		<nav class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between items-center h-16">
					<!-- Logo and Brand -->
					<div class="flex items-center space-x-4">
						<NuxtLink to="/" class="flex items-center space-x-3 group">
							<div class="relative">
								<div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
									<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path d="M8 5v10l8-5-8-5z"/>
									</svg>
								</div>
								<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
							</div>
							<div class="hidden sm:block">
								<h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
									CourseHub
								</h1>
								<p class="text-xs text-gray-500 -mt-1">Learn & Grow</p>
							</div>
						</NuxtLink>
					</div>

					<!-- Desktop Navigation Links -->
					<div class="hidden md:flex items-center space-x-8">
						<NuxtLink to="/" class="nav-link group">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
							</svg>
							Courses
						</NuxtLink>
						<NuxtLink to="/about" class="nav-link group">
							<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							About
						</NuxtLink>
					</div>

					<!-- User Menu -->
					<div class="flex items-center space-x-4">
						<!-- User Profile Dropdown -->
						<div class="relative" v-if="user">
							<button @click="toggleUserMenu" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
								<div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
									<span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
								</div>
								<svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>
							
							<!-- Dropdown Menu -->
							<div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
								<NuxtLink to="/profile" @click="showUserMenu = false" class="dropdown-item">
									<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
									</svg>
									Profile
								</NuxtLink>
								<button @click="signOut" class="dropdown-item text-red-600 hover:bg-red-50 w-full text-left">
									<svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
									</svg>
									Sign Out
								</button>
							</div>
						</div>

						<!-- Login Button -->
						<NuxtLink v-else to="/login" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105">
							Sign In
						</NuxtLink>

						<!-- Mobile Menu Button -->
						<button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile Navigation Menu -->
			<div v-show="showMobileMenu" class="md:hidden bg-white border-t border-gray-200 shadow-lg">
				<div class="px-4 py-4 space-y-2">
					<NuxtLink to="/" @click="showMobileMenu = false" class="mobile-nav-link">
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
						</svg>
						Courses
					</NuxtLink>
					<NuxtLink to="/about" @click="showMobileMenu = false" class="mobile-nav-link">
						<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						About
					</NuxtLink>
					<div v-if="user" class="border-t border-gray-200 pt-2 mt-2">
						<NuxtLink to="/profile" @click="showMobileMenu = false" class="mobile-nav-link">
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
							</svg>
							Profile
						</NuxtLink>
						<button @click="signOut; showMobileMenu = false" class="mobile-nav-link text-red-600 w-full text-left">
							<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
							</svg>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="flex-1">
			<NuxtPage />
		</main>

		<!-- Footer -->
		<footer class="bg-gray-900 text-white mt-auto">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
					<!-- Brand Section -->
					<div class="col-span-1 md:col-span-2">
						<div class="flex items-center space-x-3 mb-4">
							<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
								<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l8-5-8-5z"/>
								</svg>
							</div>
							<h3 class="text-xl font-bold text-white">CourseHub</h3>
						</div>
						<p class="text-gray-400 mb-4 max-w-md">
							Empowering learners with high-quality educational content. 
							Join thousands of students advancing their skills.
						</p>
						<div class="flex space-x-4">
							<a href="#" class="text-gray-400 hover:text-white transition-colors">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
								</svg>
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
								</svg>
							</a>
							<a href="#" class="text-gray-400 hover:text-white transition-colors">
								<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
							</a>
						</div>
					</div>

					<!-- Quick Links -->
					<div>
						<h4 class="text-lg font-semibold mb-4">Quick Links</h4>
						<ul class="space-y-2">
							<li><NuxtLink to="/" class="footer-link">All Courses</NuxtLink></li>
							<li><NuxtLink to="/about" class="footer-link">About Us</NuxtLink></li>
							<li><a href="#" class="footer-link">Contact</a></li>
							<li><a href="#" class="footer-link">Help Center</a></li>
						</ul>
					</div>

					<!-- Legal -->
					<div>
						<h4 class="text-lg font-semibold mb-4">Legal</h4>
						<ul class="space-y-2">
							<li><a href="#" class="footer-link">Privacy Policy</a></li>
							<li><a href="#" class="footer-link">Terms of Service</a></li>
							<li><a href="#" class="footer-link">Cookie Policy</a></li>
							<li><a href="#" class="footer-link">GDPR</a></li>
						</ul>
					</div>
				</div>

				<!-- Bottom Bar -->
				<div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p class="text-gray-400 text-sm">
						© {{ currentYear }} CourseHub. All rights reserved.
					</p>
					<div class="flex items-center space-x-4 mt-4 md:mt-0">
						<span class="text-gray-400 text-sm">Made with</span>
						<svg class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
						</svg>
						<span class="text-gray-400 text-sm">by CourseHub Team</span>
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

	// Close menus when clicking outside
	onMounted(() => {
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.relative')) {
				showUserMenu.value = false
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