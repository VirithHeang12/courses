import prisma from "~/lib/prisma";
import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
	const supabaseUserServer = await serverSupabaseUser(event)

	const user = await prisma.user.findFirst({
		where: {
			email: supabaseUserServer?.email || ''
		},
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			enrollments: {
				include: {
					course: {
						include: {
							instructor: true
						}
					}
				}
			}
		}
	})


	return {
		status: 200,
		body: {
			user: user || null
		}
	}
})