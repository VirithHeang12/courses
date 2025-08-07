import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { search } = getQuery<{ search: string }>(event)

    // Get course with all related data
    const courses = await prisma.course.findMany({
      where: { 
        title: {
          contains: search,
          mode: 'insensitive'
        },
        isPublished: true
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
      }
    })

    return {
      status: 200,
      body: {
        courses: courses
      }
    }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch courses',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})