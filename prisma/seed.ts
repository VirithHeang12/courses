import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a sample user (instructor)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      id: 'instructor-1',
      name: 'John Doe',
      email: 'instructor@example.com',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  })

  // Create sample students
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      id: 'student-1',
      name: 'Alice Smith',
      email: 'student1@example.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face'
    }
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      id: 'student-2',
      name: 'Bob Johnson',
      email: 'student2@example.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  })

  // Create sample courses
  const courses = [
    {
      id: 'course-1',
      title: 'Complete Nuxt.js 3 Masterclass',
      slug: 'complete-nuxtjs-3-masterclass',
      description: 'Learn Nuxt.js 3 from the ground up. This comprehensive course covers everything from basics to advanced concepts including server-side rendering, static site generation, and deployment strategies.',
      shortDescription: 'Master Nuxt.js 3 with hands-on projects and real-world examples.',
      videoUrl: 'https://example.com/videos/nuxt-masterclass.mp4',
      videoStorageId: 'nuxt-masterclass-video-id',
      thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
      duration: 3600, // 1 hour in seconds
      level: 'INTERMEDIATE',
      category: 'Web Development',
      tags: ['Nuxt.js', 'Vue.js', 'JavaScript', 'SSR', 'JAMstack'],
      price: 99.99,
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id
    },
    {
      id: 'course-2',
      title: 'Vue.js Fundamentals for Beginners',
      slug: 'vuejs-fundamentals-beginners',
      description: 'Start your Vue.js journey with this beginner-friendly course. Learn the core concepts, reactive data, components, and build your first Vue.js application.',
      shortDescription: 'Perfect introduction to Vue.js for complete beginners.',
      videoUrl: 'https://example.com/videos/vue-fundamentals.mp4',
      videoStorageId: 'vue-fundamentals-video-id',
      thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
      duration: 2400, // 40 minutes
      level: 'BEGINNER',
      category: 'Web Development',
      tags: ['Vue.js', 'JavaScript', 'Frontend', 'Components'],
      price: 49.99,
      isPublished: true,
      isFeatured: false,
      instructorId: instructor.id
    },
    {
      id: 'course-3',
      title: 'Advanced TypeScript Patterns',
      slug: 'advanced-typescript-patterns',
      description: 'Dive deep into advanced TypeScript concepts including generics, conditional types, mapped types, and design patterns. Perfect for developers who want to master TypeScript.',
      shortDescription: 'Master advanced TypeScript concepts and patterns.',
      videoUrl: 'https://example.com/videos/typescript-advanced.mp4',
      videoStorageId: 'typescript-advanced-video-id',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=450&fit=crop',
      duration: 5400, // 1.5 hours
      level: 'ADVANCED',
      category: 'Programming Languages',
      tags: ['TypeScript', 'JavaScript', 'Types', 'Patterns'],
      price: 129.99,
      isPublished: true,
      isFeatured: true,
      instructorId: instructor.id
    }
  ]

  for (const courseData of courses) {
    await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: courseData
    })
  }

  // Create sample enrollments
  const course1 = await prisma.course.findUnique({ where: { slug: 'complete-nuxtjs-3-masterclass' } })
  const course2 = await prisma.course.findUnique({ where: { slug: 'vuejs-fundamentals-beginners' } })

  if (course1 && course2) {
    // Student 1 enrollments
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student1.id,
          courseId: course1.id
        }
      },
      update: {},
      create: {
        userId: student1.id,
        courseId: course1.id,
        progress: 45,
        lastAccessedAt: new Date()
      }
    })

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student1.id,
          courseId: course2.id
        }
      },
      update: {},
      create: {
        userId: student1.id,
        courseId: course2.id,
        progress: 100,
        completedAt: new Date(),
        lastAccessedAt: new Date()
      }
    })

    // Student 2 enrollments
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student2.id,
          courseId: course1.id
        }
      },
      update: {},
      create: {
        userId: student2.id,
        courseId: course1.id,
        progress: 20,
        lastAccessedAt: new Date()
      }
    })

    // Create sample reviews
    await prisma.courseReview.upsert({
      where: {
        userId_courseId: {
          userId: student1.id,
          courseId: course2.id
        }
      },
      update: {},
      create: {
        userId: student1.id,
        courseId: course2.id,
        rating: 5,
        comment: 'Excellent course! Very well explained and perfect for beginners. I learned so much about Vue.js fundamentals.'
      }
    })

    await prisma.courseReview.upsert({
      where: {
        userId_courseId: {
          userId: student2.id,
          courseId: course1.id
        }
      },
      update: {},
      create: {
        userId: student2.id,
        courseId: course1.id,
        rating: 4,
        comment: 'Great content and very comprehensive. Still working through it but loving the depth of coverage.'
      }
    })

    // Update enrollment counts
    await prisma.course.update({
      where: { id: course1.id },
      data: { enrollmentCount: 2 }
    })

    await prisma.course.update({
      where: { id: course2.id },
      data: { enrollmentCount: 1 }
    })
  }

  console.log('✅ Database seeding completed!')
  console.log(`Created instructor: ${instructor.name}`)
  console.log(`Created students: ${student1.name}, ${student2.name}`)
  console.log(`Created ${courses.length} courses`)
  console.log('Created sample enrollments and reviews')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })