<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
		<!-- Hero Section -->
		<div class="text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800">
			<div class="container px-6 py-16 mx-auto">
				<div class="text-center">
					<h1
						class="mb-4 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 md:text-6xl">
						Course Videos
					</h1>
					<p class="mx-auto mb-8 max-w-2xl text-xl text-blue-100 md:text-2xl">
						Discover our comprehensive collection of coding tutorials and educational content
					</p>
					<div class="inline-flex items-center px-6 py-3 space-x-2 rounded-full backdrop-blur-sm bg-white/10">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M8 5v10l8-5-8-5z" />
						</svg>
						<span class="text-sm font-medium">{{ videos.length }} Videos Available</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="container px-6 py-12 mx-auto">

			<div v-if="pending" class="flex flex-col justify-center items-center py-20">
				<div class="relative">
					<div class="w-16 h-16 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
					<div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-spin border-t-purple-600"
						style="animation-delay: 0.15s"></div>
				</div>
				<p class="mt-6 text-lg font-medium text-gray-600">Loading amazing videos...</p>
				<p class="text-sm text-gray-400">Please wait while we fetch your content</p>
			</div>

			<div v-else-if="error" class="flex flex-col justify-center items-center py-20">
				<div class="p-8 mx-auto max-w-md bg-red-50 rounded-2xl border border-red-200">
					<div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
							</path>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-center text-red-800">Oops! Something went wrong</h3>
					<p class="text-sm text-center text-red-600">{{ error }}</p>
					<button @click="refresh()"
						class="px-4 py-2 mt-4 w-full text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700">
						Try Again
					</button>
				</div>
			</div>

			<div v-else-if="videos && videos.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<NuxtLink v-for="video in videos" :key="video.id" :to="`/courses/${video.id}`"
					class="block overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 group hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2">

					<!-- Video Thumbnail/Preview -->
					<div
						class="flex overflow-hidden relative justify-center items-center h-48 bg-gradient-to-br from-blue-100 to-purple-100">
						<!-- Video Icon as placeholder -->
						<div
							class="flex flex-col justify-center items-center text-gray-400 transition-colors duration-300 group-hover:text-blue-500">
							<svg class="mb-2 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
								</path>
							</svg>
							<span class="text-sm font-medium">Video Preview</span>
						</div>
						<!-- Play button overlay -->
						<div
							class="flex absolute inset-0 justify-center items-center opacity-0 transition-opacity duration-300 bg-black/20 group-hover:opacity-100">
							<div
								class="p-4 rounded-full backdrop-blur-sm transition-transform duration-300 transform bg-white/90 group-hover:scale-110">
								<svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l8-5-8-5z" />
								</svg>
							</div>
						</div>
					</div>

					<!-- Content Section -->
					<div class="p-6">
						<h3
							class="mb-3 text-xl font-bold text-gray-800 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
							{{ formatVideoTitle(video.name) }}
						</h3>

						<!-- Meta Information -->
						<div class="flex justify-between items-center mb-4 text-sm text-gray-500">
							<div class="flex items-center space-x-4">
								<span v-if="video.size" class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z">
										</path>
									</svg>
									<span>{{ formatFileSize(video.size) }}</span>
								</span>
								<span v-if="video.createdAt" class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
										</path>
									</svg>
									<span>{{ formatDate(video.createdAt) }}</span>
								</span>
							</div>
						</div>

						<!-- Action Button -->
						<div
							class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200 font-medium shadow-md group-hover:shadow-lg transform group-hover:scale-[1.02]">
							<span class="flex justify-center items-center space-x-2">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l8-5-8-5z" />
								</svg>
								<span>Watch Now</span>
							</span>
						</div>
					</div>
				</NuxtLink>
			</div>

			<div v-else class="flex flex-col justify-center items-center py-20">
				<div class="p-12 mx-auto max-w-md text-center bg-gray-50 rounded-2xl border border-gray-200">
					<div class="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gray-100 rounded-full">
						<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
							</path>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-semibold text-gray-700">No Videos Available</h3>
					<p class="mb-6 text-gray-500">Check back later for new content!</p>
					<button @click="refresh()"
						class="px-6 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
						Refresh
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const { data: response, pending, error } = await useFetch('/api/videos', {
		method: 'GET',
		headers: useRequestHeaders(['cookie'])
	})

	const videos = computed(() => response?.value?.data || []);

	const formatFileSize = (bytes) => {
		if (!bytes) return 'Unknown'
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
	}

	const formatDate = (dateString) => {
		if (!dateString) return 'Unknown'
		return new Date(dateString).toLocaleDateString()
	}

	const formatVideoTitle = (title) => {
		if (!title) return 'Untitled Video'
		// Remove file extensions and improve formatting
		return title
			.replace(/\.[^/.]+$/, '') // Remove file extension
			.replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
			.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
	}

	const refresh = () => {
		window.location.reload()
	}
</script>
