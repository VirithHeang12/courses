import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const createUserSchema = z.object({
  email: z.string().email(),
})


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate input
    const validatedData = createUserSchema.parse(body)

    // Check if slug already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return createError({
        statusCode: 400,
        statusMessage: 'User already exists',
        message: 'A user with this email already exists'
      })
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        ...validatedData,
      }
    })

    return {
      success: true,
      data: user,
      message: 'User created successfully'
    }
  } catch (error) {
    console.error('Error creating course:', error)
    
    if (error instanceof z.ZodError) {
      return createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
      })
    }

    return createError({
      statusCode: 500,
      statusMessage: 'Failed to create course',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})
