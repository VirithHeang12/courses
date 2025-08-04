import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
	try {
		const supabase = await serverSupabaseClient(event)
		const videoId = getRouterParam(event, 'id')

		if (!supabase) {
			return createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: 'Failed to initialize Supabase client'
			})
		}

		if (!videoId) {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Video ID is required'
			})
		}

		// Get all videos to find the one with matching ID
		const { data, error } = await supabase.storage
			.from('nuxt-courses')
			.list('videos', {
				limit: 100,
			})

		if (error) {
			return createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch videos',
				message: error.message
			})
		}

		if (!data || data.length === 0) {
			return createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'No videos found'
			})
		}

		// Find the specific video by ID
		const videoFile = data.find(file => file.id === videoId)

		if (!videoFile) {
			return createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Video not found'
			})
		}

		// Check if it's a video file
		if (!videoFile.metadata?.mimetype?.startsWith('video/')) {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'File is not a video'
			})
		}

		const { data: { publicUrl } } = supabase.storage
			.from('nuxt-courses')
			.getPublicUrl(`videos/${videoFile.name}`)

		const videoData = {
			id: videoFile.id,
			name: videoFile.name,
			url: publicUrl,
			size: videoFile.metadata?.size,
			mimeType: videoFile.metadata?.mimetype,
			createdAt: videoFile.created_at,
			updatedAt: videoFile.updated_at
		}

		return {
			success: true,
			data: videoData
		}
	} catch (error) {
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: 'Failed to fetch video'
		})
	}
})