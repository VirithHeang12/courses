<template>
	<div class="container mx-auto p-4">
		<h1 class="text-3xl font-bold mb-6">Course Videos</h1>

		<div v-if="pending" class="text-center">
			Loading videos...
		</div>

		<div v-else-if="error" class="text-red-500 text-center">
			Error loading videos: {{ error }}
		</div>

		<div v-else-if="videos && videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="video in videos" :key="video.id" class="bg-white rounded-lg shadow-md overflow-hidden">
				<video :src="video.url" class="w-full h-48 object-cover" controls preload="metadata" />
				<div class="p-4">
					<h3 class="font-semibold text-lg mb-2">{{ video.name }}</h3>
					<div class="text-sm text-gray-500">
						<p v-if="video.size">Size: {{ formatFileSize(video.size) }}</p>
						<p v-if="video.createdAt">Created: {{ formatDate(video.createdAt) }}</p>
					</div>
				</div>
			</div>
		</div>

		<div v-else class="text-center text-gray-500">
			No videos found
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		auth: false
	})

	const { data: response, pending, error } = await useFetch('/api/videos', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	console.log(response)

	const videos = computed(() => response?.data || [])

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
</script>
