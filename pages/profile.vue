<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
		<!-- Header Section -->
		<div class="bg-white border-b border-gray-200 shadow-sm">
			<div class="container px-6 py-8 mx-auto">
				<div class="flex items-center space-x-4">
					<NuxtLink to="/"
						class="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
							</path>
						</svg>
						<span>Back to Courses</span>
					</NuxtLink>
					<div class="w-px h-6 bg-gray-300"></div>
					<h1 class="text-2xl font-bold text-gray-800">My Profile</h1>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="pending" class="flex flex-col justify-center items-center py-20">
			<div class="relative">
				<div class="w-16 h-16 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
				<div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-spin border-t-purple-600"
					style="animation-delay: 0.15s"></div>
			</div>
			<p class="mt-6 text-lg font-medium text-gray-600">Loading your profile...</p>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="flex flex-col justify-center items-center py-20">
			<div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
				<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
					</path>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-semibold text-red-800">Failed to load profile</h3>
			<p class="mb-4 text-sm text-red-600">{{ error }}</p>
			<button @click="refresh()"
				class="px-6 py-2 text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700">
				Try Again
			</button>
		</div>

		<!-- Main Content -->
		<div v-else-if="profileData?.user" class="container px-6 py-8 mx-auto">
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<!-- User Information Card -->
				<div class="lg:col-span-1">
					<div class="p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
						<!-- User Avatar -->
						<div class="flex flex-col items-center mb-6">
							<div class="relative mb-4">
								<div v-if="profileData.user.image"
									class="overflow-hidden w-24 h-24 rounded-full border-4 border-blue-100">
									<img :src="profileData.user.image" :alt="profileData.user.name || 'User Avatar'"
										class="object-cover w-full h-full">
								</div>
								<div v-else
									class="flex justify-center items-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-blue-100">
									<span class="text-2xl font-bold text-white">
										{{ getInitials(profileData.user.name || profileData.user.email) }}
									</span>
								</div>
								<div
									class="absolute -right-1 -bottom-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white">
								</div>
							</div>

							<!-- User Details -->
							<h2 class="mb-2 text-2xl font-bold text-center text-gray-800">
								{{ profileData.user.name || 'Anonymous User' }}
							</h2>
							<p class="mb-1 text-center text-gray-600">{{ profileData.user.email }}</p>
							<p class="text-sm text-center text-gray-500">
								Member since {{ formatDate(profileData.user.createdAt) }}
							</p>
						</div>

						<!-- User Stats -->
						<div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
							<div class="text-center">
								<div class="text-2xl font-bold text-blue-600">{{ enrollmentCount }}</div>
								<div class="text-sm text-gray-600">Enrolled Courses</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
								<div class="text-sm text-gray-600">Completed</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Enrolled Courses Section -->
				<div class="lg:col-span-2">
					<div class="p-8 bg-white rounded-2xl border border-gray-100 shadow-lg">
						<div class="flex justify-between items-center mb-6">
							<h3 class="text-xl font-bold text-gray-800">My Enrolled Courses</h3>
							<span class="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
								{{ enrollmentCount }} Course{{ enrollmentCount !== 1 ? 's' : '' }}
							</span>
						</div>

						<!-- No Enrollments State -->
						<div v-if="!profileData.user.enrollments || profileData.user.enrollments.length === 0"
							class="flex flex-col items-center py-12 text-center">
							<div class="flex justify-center items-center mb-4 w-20 h-20 bg-gray-100 rounded-full">
								<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor"
									viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
									</path>
								</svg>
							</div>
							<h4 class="mb-2 text-lg font-semibold text-gray-700">No Courses Enrolled</h4>
							<p class="mb-6 text-gray-500">Start your learning journey by enrolling in a course!</p>
							<NuxtLink to="/"
								class="px-6 py-3 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
								Browse Courses
							</NuxtLink>
						</div>

						<!-- Enrolled Courses List -->
						<div v-else class="space-y-6">
							<div v-for="enrollment in profileData.user.enrollments" :key="enrollment.id"
								class="p-6 rounded-xl border border-gray-200 transition-shadow hover:shadow-md">

								<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<!-- Course Info -->
									<div class="flex-1">
										<div class="flex gap-4 items-start">
											<!-- Course Thumbnail -->
											<div
												class="flex flex-shrink-0 justify-center items-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
												<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path d="M8 5v10l8-5-8-5z" />
												</svg>
											</div>

											<!-- Course Details -->
											<div class="flex-1 min-w-0">
												<h4 class="mb-1 text-lg font-semibold text-gray-800">
													{{ enrollment.course.title }}
												</h4>
												<p v-if="enrollment.course.shortDescription"
													class="mb-2 text-sm text-gray-600 line-clamp-2">
													{{ enrollment.course.shortDescription }}
												</p>
												<div class="flex gap-4 items-center text-sm text-gray-500">
													<span class="flex gap-1 items-center">
														<svg class="w-4 h-4" fill="none" stroke="currentColor"
															viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round"
																stroke-width="2"
																d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
															</path>
														</svg>
														{{ enrollment.course.instructor.name || 'Instructor' }}
													</span>
													<span class="flex gap-1 items-center">
														<svg class="w-4 h-4" fill="none" stroke="currentColor"
															viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round"
																stroke-width="2"
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
														</svg>
														{{ formatDuration(enrollment.course.duration) }}
													</span>
													<span class="px-2 py-1 text-xs font-medium rounded-full"
														:class="getLevelClass(enrollment.course.level)">
														{{ enrollment.course.level }}
													</span>
												</div>
											</div>
										</div>
									</div>

									<!-- Progress and Actions -->
									<div class="space-y-3 lg:w-64">
										<!-- Progress Bar -->
										<div class="space-y-2">
											<div class="flex justify-between text-sm">
												<span class="text-gray-600">Progress</span>
												<span class="font-medium text-gray-800">{{ enrollment.progress
												}}%</span>
											</div>
											<div class="w-full h-2 bg-gray-200 rounded-full">
												<div class="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
													:style="{ width: enrollment.progress + '%' }"></div>
											</div>
										</div>

										<!-- Status and Actions -->
										<div class="flex justify-between items-center">
											<span v-if="enrollment.completedAt"
												class="inline-flex gap-1 items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
												<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clip-rule="evenodd"></path>
												</svg>
												Completed
											</span>
											<span v-else-if="enrollment.progress > 0"
												class="inline-flex gap-1 items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
												<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clip-rule="evenodd"></path>
												</svg>
												In Progress
											</span>
											<span v-else
												class="inline-flex gap-1 items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
												<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
													<path fill-rule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
														clip-rule="evenodd"></path>
												</svg>
												Not Started
											</span>

											<NuxtLink :to="`/courses/${enrollment.course.slug}`"
												class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
												{{ enrollment.progress > 0 ? 'Continue' : 'Start' }}
											</NuxtLink>
										</div>

										<!-- Enrollment Date -->
										<p class="text-xs text-gray-500">
											Enrolled {{ formatDate(enrollment.enrolledAt) }}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- No User State -->
		<div v-else class="flex flex-col justify-center items-center py-20">
			<div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
				<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-semibold text-gray-700">No Profile Found</h3>
			<p class="mb-6 text-gray-500">Please log in to view your profile.</p>
			<NuxtLink to="/login"
				class="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
				Log In
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
	const { data, pending, error, refresh } = await useAsyncData('user', () => {
		return $fetch('/api/profile/get-profile', {
			headers: useRequestHeaders(['cookie'])
		})
	})

	// Computed properties for easier data access
	const profileData = computed(() => data.value?.body || null)
	const enrollmentCount = computed(() => profileData.value?.user?.enrollments?.length || 0)
	const completedCount = computed(() =>
		profileData.value?.user?.enrollments?.filter(e => e.completedAt).length || 0
	)

	// Utility functions
	const getInitials = (name) => {
		if (!name) return '?'
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'Unknown'
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	const formatDuration = (seconds) => {
		if (!seconds) return 'Unknown'
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)

		if (hours > 0) {
			return `${hours}h ${minutes}m`
		}
		return `${minutes}m`
	}

	const getLevelClass = (level) => {
		const levelClasses = {
			'BEGINNER': 'text-green-700 bg-green-100',
			'INTERMEDIATE': 'text-yellow-700 bg-yellow-100',
			'ADVANCED': 'text-red-700 bg-red-100'
		}
		return levelClasses[level] || 'text-gray-700 bg-gray-100'
	}

	// SEO and page meta
	useHead({
		title: 'My Profile - Course Learning Platform',
		meta: [
			{ name: 'description', content: 'View your learning progress, enrolled courses, and profile information.' }
		]
	})
</script>