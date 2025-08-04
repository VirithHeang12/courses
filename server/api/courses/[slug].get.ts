import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Course slug is required'
      })
    }

    // Get course with all related data
    const course = await prisma.course.findUnique({
      where: { 
        slug: slug,
        isPublished: true // Only return published courses
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Latest 10 reviews
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      }
    })

    if (!course) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Course not found'
      })
    }

    // Calculate average rating if there are reviews
    if (course.reviews.length > 0) {
      const avgRating = course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
      course.rating = Math.round(avgRating * 10) / 10 // Round to 1 decimal place
    }

    return {
      success: true,
      data: course
    }
  } catch (error) {
    console.error('Error fetching course:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch course',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})