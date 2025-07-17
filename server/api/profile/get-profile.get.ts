import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
	const user = await prisma.user.findFirst({
		where: {
			name: {
				startsWith: 'Heang'
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})


	return {
		status: 200,
		body: {
			user: user || null
		}
	}
})