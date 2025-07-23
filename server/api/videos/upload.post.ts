import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
	// const session = await getServerSession(event)

	// if (!session) {
	// 	return createError({
	// 		statusCode: 401,
	// 		statusMessage: 'Unauthorized',
	// 		message: 'You must be logged in to upload videos.'
	// 	});
	// }

	try {
		const form = await readMultipartFormData(event)

		if (!form || form.length === 0) {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No file uploaded'
			})
		}

		const videoFile = form.find(field => field.name === 'video')

		if (!videoFile || !videoFile.data) {
			return createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'Video file is required'
			})
		}

		const supabase = await serverSupabaseClient(event)

		if (!supabase) {
			return createError({
				statusCode: 500,
				statusMessage: 'Internal Server Error',
				message: 'Failed to initialize Supabase client'
			})
		}

		const fileName = `${Date.now()}-${videoFile.filename || 'video.mp4'}`
		const filePath = `videos/${fileName}`

		const { data, error } = await supabase.storage
			.from('nuxt-courses')
			.upload(filePath, videoFile.data, {
				contentType: videoFile.type || 'video/mp4',
				upsert: false
			})

		if (error) {
			return createError({
				statusCode: 500,
				statusMessage: 'Upload Failed',
				message: error.message
			})
		}

		const { data: { publicUrl } } = supabase.storage
			.from('nuxt-courses')
			.getPublicUrl(data.path)

		return {
			status: 'success',
			message: 'Video uploaded successfully',
			data: {
				path: data.path,
				url: publicUrl,
				fileName: fileName
			}
		}
	} catch (error) {
		return createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: 'Failed to upload video'
		})
	}
});