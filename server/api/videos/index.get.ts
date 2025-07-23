import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
	// const session = await getServerSession(event)

	// if (!session) {
	// 	return createError({
	// 		statusCode: 401,
	// 		statusMessage: 'Unauthorized',
	// 		message: 'You must be logged in to access videos.'
	// 	});
	// }

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
			.list('videos/', {
				limit: 10,
				offset: 0
			})

		if (error) {
			return createError({
				statusCode: 500,
				statusMessage: 'Failed to fetch videos',
				message: error.message
			})
		}

		const videos = data?.map(file => {
			const { data: { publicUrl } } = supabase.storage
				.from('nuxt-courses')
				.getPublicUrl(`videos/${file.name}`)

			return {
				id: file.id,
				name: file.name,
				url: publicUrl,
				size: file.metadata?.size,
				lastModified: file.updated_at,
				createdAt: file.created_at
			}
		}) || []

		return {
			success: true,
			data: videos
		}
	} catch (error) {
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: 'Failed to fetch videos'
		})
	}
})