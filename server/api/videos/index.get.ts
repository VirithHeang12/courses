import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
	try {
		const supabase = await serverSupabaseClient(event)

		if (!supabase) {
			return createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: 'Failed to initialize Supabase client'
			})
		}

		const { data, error } = await supabase.storage
			.from('nuxt-courses')
			.list('videos', {
				limit: 10,
			})

		if (error) {
			return createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch videos',
				message: error.message
			})
		}

		if (!data || data.length === 0) {
			return {
				success: true,
				data: [],
				message: 'No videos found in the videos folder'
			}
		}

		const videosData = data.map(file => {
			const { data: { publicUrl } } = supabase.storage
				.from('nuxt-courses')
				.getPublicUrl(`videos/${file.name}`)

			return {
				id: file.id,
				name: file.name,
				url: publicUrl,
				mimeType: file.metadata?.mimetype
			}
		})

		// filter out files that are not videos
		const videos = videosData.filter(file => file.mimeType?.startsWith('video/'))

		return {
			success: true,
			data: videos,
			count: videos.length
		}
	} catch (error) {
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: 'Failed to fetch videos'
		})
	}
})