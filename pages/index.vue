<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
		<!-- Hero Section -->
		<div class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white">
			<div class="container mx-auto px-6 py-16">
				<div class="text-center">
					<h1 class="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
						Course Videos
					</h1>
					<p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Discover our comprehensive collection of coding tutorials and educational content
					</p>
					<div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M8 5v10l8-5-8-5z"/>
						</svg>
						<span class="text-sm font-medium">{{ videos.length }} Videos Available</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="container mx-auto px-6 py-12">

			<div v-if="pending" class="flex flex-col items-center justify-center py-20">
				<div class="relative">
					<div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
					<div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style="animation-delay: 0.15s"></div>
				</div>
				<p class="mt-6 text-lg font-medium text-gray-600">Loading amazing videos...</p>
				<p class="text-sm text-gray-400">Please wait while we fetch your content</p>
			</div>

			<div v-else-if="error" class="flex flex-col items-center justify-center py-20">
				<div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
					<div class="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-red-800 mb-2 text-center">Oops! Something went wrong</h3>
					<p class="text-red-600 text-center text-sm">{{ error }}</p>
					<button @click="refresh()" class="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
						Try Again
					</button>
				</div>
			</div>

			<div v-else-if="videos && videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<div v-for="video in videos" :key="video.id" 
					 class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
					
					<!-- Video Player Container -->
					<div class="relative overflow-hidden bg-gray-100">
						<VideoPlayer 
							:src="video.url" 
							:height="200" 
							:controls="true" 
							:preload="'metadata'" 
							:fluid="true"
							@ready="onPlayerReady" 
						/>
						<!-- Overlay for hover effect -->
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
					</div>
					
					<!-- Content Section -->
					<div class="p-6">
						<h3 class="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
							{{ formatVideoTitle(video.name) }}
						</h3>
						
						<!-- Meta Information -->
						<div class="flex items-center justify-between text-sm text-gray-500 mb-4">
							<div class="flex items-center space-x-4">
								<span v-if="video.size" class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"></path>
									</svg>
									<span>{{ formatFileSize(video.size) }}</span>
								</span>
								<span v-if="video.createdAt" class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
									</svg>
									<span>{{ formatDate(video.createdAt) }}</span>
								</span>
							</div>
						</div>
						
						<!-- Action Button -->
						<button class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]">
							<span class="flex items-center justify-center space-x-2">
								<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path d="M8 5v10l8-5-8-5z"/>
								</svg>
								<span>Watch Now</span>
							</span>
						</button>
					</div>
				</div>
			</div>

			<div v-else class="flex flex-col items-center justify-center py-20">
				<div class="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md mx-auto text-center">
					<div class="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6">
						<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-700 mb-2">No Videos Available</h3>
					<p class="text-gray-500 mb-6">Check back later for new content!</p>
					<button @click="refresh()" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
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

	const onPlayerReady = (player) => {
		console.log('Video player ready:', player)
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
