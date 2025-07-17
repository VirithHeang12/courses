import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
	const session = await getServerSession(event)

	if (!session) {
		return createError({
			statusCode: 401,
			statusMessage: 'Unauthorized',
			message: 'You must be logged in to upload videos.'
		});
	}

	return {
		status: 'success',
		message: 'You are authenticated',
	}
});