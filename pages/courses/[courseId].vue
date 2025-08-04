<template>
	<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
		<!-- Header -->
		<div class="bg-white border-b border-gray-200 shadow-sm">
			<div class="container px-6 py-4 mx-auto">
				<div class="flex items-center space-x-4">
					<button @click="$router.back()"
						class="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
							</path>
						</svg>
						<span>Back to Videos</span>
					</button>
					<div class="w-px h-6 bg-gray-300"></div>
					<h1 class="text-xl font-semibold text-gray-800">Video Player</h1>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="container px-6 py-8 mx-auto">
			<!-- Loading State -->
			<div v-if="pending" class="flex flex-col justify-center items-center py-20">
				<div class="relative">
					<div class="w-16 h-16 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
					<div class="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent animate-spin border-t-purple-600"
						style="animation-delay: 0.15s"></div>
				</div>
				<p class="mt-6 text-lg font-medium text-gray-600">Loading video...</p>
			</div>

			<!-- Error State -->
			<div v-else-if="error" class="flex flex-col justify-center items-center py-20">
				<div class="p-8 mx-auto max-w-md bg-red-50 rounded-2xl border border-red-200">
					<div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
							</path>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-center text-red-800">Video Not Found</h3>
					<p class="text-sm text-center text-red-600">{{ error }}</p>
					<button @click="$router.push('/')"
						class="px-4 py-2 mt-4 w-full text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700">
						Back to Home
					</button>
				</div>
			</div>

			<!-- Video Content -->
			<div v-else-if="video" class="mx-auto max-w-6xl">
				<!-- Video Player -->
				<div class="overflow-hidden mb-8 bg-white rounded-2xl shadow-lg">
					<div class="bg-black">
						<VideoPlayer :src="video.url" :height="500" :controls="true" :preload="'auto'" :fluid="true"
							:autoplay="false" @ready="onPlayerReady" @play="onPlay" @pause="onPause" @ended="onEnded"
							@timeupdate="onTimeUpdate" @error="onPlayerError" />
					</div>
				</div>

				<!-- Video Information -->
				<div class="p-8 bg-white rounded-2xl shadow-lg">
					<h1 class="mb-4 text-3xl font-bold text-gray-800">
						{{ formatVideoTitle(video.name) }}
					</h1>

					<!-- Meta Information -->
					<div class="flex flex-wrap gap-6 items-center mb-6 text-sm text-gray-600">
						<div v-if="video.size" class="flex items-center space-x-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z">
								</path>
							</svg>
							<span>{{ formatFileSize(video.size) }}</span>
						</div>
						<div v-if="video.createdAt" class="flex items-center space-x-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
								</path>
							</svg>
							<span>{{ formatDate(video.createdAt) }}</span>
						</div>
						<div v-if="video.mimeType" class="flex items-center space-x-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
								</path>
							</svg>
							<span>{{ video.mimeType }}</span>
						</div>
					</div>

					<!-- Player Controls Info -->
					<div v-if="playerReady" class="p-4 bg-gray-50 rounded-xl">
						<h3 class="mb-2 text-lg font-semibold text-gray-800">Player Controls</h3>
						<div class="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
							<div>
								<strong>Current Time:</strong> {{ formatTime(currentTime) }}
							</div>
							<div v-if="duration > 0">
								<strong>Duration:</strong> {{ formatTime(duration) }}
							</div>
							<div>
								<strong>Status:</strong> {{ isPlaying ? 'Playing' : 'Paused' }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const route = useRoute();
	const courseId = computed(() => route.params.courseId as string);

	// Fetch video data
	const { data: response, pending, error } = await useFetch<{
		success: boolean;
		data: {
			id: string;
			name: string;
			url: string;
			size?: number;
			mimeType?: string;
			createdAt?: string;
			updatedAt?: string;
		};
	}>(`/api/videos/${courseId.value}`, {
		method: 'GET',
		headers: useRequestHeaders(['cookie'])
	});

	const video = computed(() => response?.value?.data || null);

	// Player state
	const playerReady = ref(false);
	const isPlaying = ref(false);
	const currentTime = ref(0);
	const duration = ref(0);

	// Utility functions
	const formatFileSize = (bytes: number) => {
		if (!bytes) return 'Unknown'
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
	}

	const formatDate = (dateString: string) => {
		if (!dateString) return 'Unknown'
		return new Date(dateString).toLocaleDateString()
	}

	const formatVideoTitle = (title: string) => {
		if (!title) return 'Untitled Video'
		// Remove file extensions and improve formatting
		return title
			.replace(/\.[^/.]+$/, '') // Remove file extension
			.replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
			.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
	}

	const formatTime = (timeInSeconds: number) => {
		if (!timeInSeconds || timeInSeconds === 0) return '0:00'
		const minutes = Math.floor(timeInSeconds / 60)
		const seconds = Math.floor(timeInSeconds % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	// Player event handlers
	const onPlayerReady = (player: any) => {
		console.log('Video player ready:', player)
		playerReady.value = true
		if (player && player.duration) {
			duration.value = player.duration()
		}
	}

	const onPlay = () => {
		console.log('Video started playing')
		isPlaying.value = true
	}

	const onPause = () => {
		console.log('Video paused')
		isPlaying.value = false
	}

	const onEnded = () => {
		console.log('Video ended')
		isPlaying.value = false
	}

	const onTimeUpdate = (time: number) => {
		currentTime.value = time
	}

	const onPlayerError = (error: any) => {
		console.error('Video player error:', error)
	}

	// SEO
	useSeoMeta({
		title: () => video.value ? `${formatVideoTitle(video.value.name)} - Course Videos` : 'Video Player',
		description: () => video.value ? `Watch ${formatVideoTitle(video.value.name)}` : 'Video player page'
	})
</script>

<style scoped>
	/* Add any custom styles here */
</style>