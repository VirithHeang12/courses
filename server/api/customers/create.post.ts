import prisma from "~/lib/prisma"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	if (!body.name) {
		return {
			status: 400,
			body: {
				error: 'Name is required'
			}
		}
	}

	const customer = await prisma.customer.create({
		data: {
			name: body.name
		}
	})


	return {
		status: 201,
		body: {
			customer: customer || null
		}
	}
})