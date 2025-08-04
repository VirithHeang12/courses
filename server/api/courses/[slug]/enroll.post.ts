import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const enrollSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    const body = await readBody(event)
    
    if (!slug) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Course slug is required'
      })
    }

    const validatedData = enrollSchema.parse(body)

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { 
        slug: slug,
        isPublished: true 
      }
    })

    if (!course) {
      return createError({
        statusCode: 404,
        statusMessage: 'Course not found',
        message: 'Course not found or not published'
      })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    })

    if (!user) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid user',
        message: 'User does not exist'
      })
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: validatedData.userId,
          courseId: course.id
        }
      }
    })

    if (existingEnrollment) {
      return createError({
        statusCode: 400,
        statusMessage: 'Already enrolled',
        message: 'User is already enrolled in this course'
      })
    }

    // Create enrollment and update course enrollment count
    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: validatedData.userId,
          courseId: course.id
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnailUrl: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.course.update({
        where: { id: course.id },
        data: {
          enrollmentCount: {
            increment: 1
          }
        }
      })
    ])

    return {
      success: true,
      data: enrollment,
      message: 'Successfully enrolled in course'
    }
  } catch (error) {
    console.error('Error enrolling in course:', error)
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      })
    }

    return createError({
      statusCode: 500,
      statusMessage: 'Failed to enroll in course',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})