import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const category = query.category as string
    const level = query.level as string
    const featured = query.featured === 'true'
    const search = query.search as string

    // Build where clause
    const where: any = {
      isPublished: true
    }

    if (category) {
      where.category = category
    }

    if (level) {
      where.level = level.toUpperCase()
    }

    if (featured) {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count for pagination
    const totalCount = await prisma.course.count({ where })

    // Get courses with instructor info
    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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