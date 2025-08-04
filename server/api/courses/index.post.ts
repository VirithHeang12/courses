import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema
const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  videoUrl: z.string().url('Valid video URL is required'),
  videoStorageId: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  duration: z.number().positive().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  price: z.number().positive().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  instructorId: z.string().min(1, 'Instructor ID is required')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate input
    const validatedData = createCourseSchema.parse(body)

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingCourse) {
      return createError({
        statusCode: 400,
        statusMessage: 'Slug already exists',
        message: 'A course with this slug already exists'
      })
    }

    // Check if instructor exists
    const instructor = await prisma.user.findUnique({
      where: { id: validatedData.instructorId }
    })

    if (!instructor) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid instructor',
        message: 'The specified instructor does not exist'
      })
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        ...validatedData,
        publishedAt: validatedData.isPublished ? new Date() : null
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return {
      success: true,
      data: course,
      message: 'Course created successfully'
    }
  } catch (error) {
    console.error('Error creating course:', error)
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      })
    }

    return createError({
      statusCode: 500,
      statusMessage: 'Failed to create course',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})