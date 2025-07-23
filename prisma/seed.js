const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create categories
  const categoriesData = [
    { name: 'Web Development', description: 'Learn modern web development technologies and frameworks', slug: 'web-development' },
    { name: 'Data Science', description: 'Master data analysis, machine learning, and AI', slug: 'data-science' },
    { name: 'Mobile Development', description: 'Build iOS and Android applications', slug: 'mobile-development' },
    { name: 'Programming', description: 'Learn programming languages and computer science fundamentals', slug: 'programming' },
    { name: 'Design', description: 'UI/UX design, graphic design, and creative tools', slug: 'design' },
    { name: 'Business', description: 'Business strategy, entrepreneurship, and management', slug: 'business' },
    { name: 'Marketing', description: 'Digital marketing, SEO, and social media strategies', slug: 'marketing' },
    { name: 'Photography', description: 'Photography techniques, editing, and visual storytelling', slug: 'photography' },
    { name: 'Music', description: 'Music theory, instruments, and audio production', slug: 'music' },
    { name: 'Health & Fitness', description: 'Fitness training, nutrition, and wellness', slug: 'health-fitness' },
    { name: 'Language', description: 'Learn new languages and improve communication skills', slug: 'language' },
    { name: 'Lifestyle', description: 'Personal development, hobbies, and life skills', slug: 'lifestyle' }
  ];

  console.log('Creating categories...');
  for (const category of categoriesData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  const allCategories = await prisma.category.findMany();

  // Create sample users
  const hashedPassword = await hash('password123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@coursemarket.com' },
    update: {},
    create: {
      email: 'admin@coursemarket.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const instructor1 = await prisma.user.upsert({
    where: { email: 'john.instructor@coursemarket.com' },
    update: {},
    create: {
      email: 'john.instructor@coursemarket.com',
      firstName: 'John',
      lastName: 'Smith',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      isEmailVerified: true,
      bio: 'Full-stack developer with 10+ years of experience. Passionate about teaching modern web technologies.',
      avatar: '/api/placeholder/150/150',
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'sarah.instructor@coursemarket.com' },
    update: {},
    create: {
      email: 'sarah.instructor@coursemarket.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      isEmailVerified: true,
      bio: 'Data scientist and AI researcher. Love making complex topics accessible to everyone.',
      avatar: '/api/placeholder/150/150',
    },
  });
  const instructors = [instructor1, instructor2];

  console.log('Creating students...');
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@coursemarket.com` },
      update: {},
      create: {
        email: `student${i}@coursemarket.com`,
        firstName: `Student`,
        lastName: `${i}`,
        password: hashedPassword,
        role: 'STUDENT',
        isEmailVerified: true,
      },
    });
    students.push(student);
  }

  // Create one course per category for each instructor
  console.log('Creating courses...');
  const createdCourses = [];
  for (const instructor of instructors) {
    for (const category of allCategories) {
      const slug = `course-${category.slug}-${instructor.firstName.toLowerCase()}`;
      const course = await prisma.course.upsert({
        where: { slug },
        update: {},
        create: {
          title: `Complete ${category.name} Course by ${instructor.firstName}`,
          slug,
          description: `A comprehensive course on ${category.name} by ${instructor.firstName}.`,
          shortDescription: `Learn ${category.name} from scratch with ${instructor.firstName}.`,
          price: parseFloat((Math.random() * (150 - 50) + 50).toFixed(2)),
          level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][Math.floor(Math.random() * 3)],
          language: 'English',
          thumbnail: '/api/placeholder/800/450',
          requirements: ['Basic knowledge of the field'],
          whatYouWillLearn: [`Master ${category.name}`],
          status: 'PUBLISHED',
          instructorId: instructor.id,
          categoryId: category.id,
        },
      });
      createdCourses.push(course);
    }
  }

  // Create at least 2 enrollments for each student
  console.log('Creating enrollments...');
  if (createdCourses.length >= 2) {
    for (const student of students) {
      const enrollments = new Set();
      while (enrollments.size < 2) {
        const courseIndex = Math.floor(Math.random() * createdCourses.length);
        enrollments.add(createdCourses[courseIndex].id);
      }

      for (const courseId of enrollments) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: student.id, courseId: courseId } },
          update: {},
          create: {
            userId: student.id,
            courseId: courseId,
          },
        });
      }
    }
  }

  // Create modules and lessons for the first course
  if (createdCourses.length > 0) {
    console.log('Creating course modules and lessons for one course...');
    const course1 = createdCourses[0];
    const module1 = await prisma.module.create({
      data: {
        title: 'Module 1: Introduction',
        description: `Introduction to ${course1.title}`,
        order: 1,
        courseId: course1.id,
      },
    });

    await prisma.lesson.createMany({
      data: [
        {
          title: 'Lesson 1: Welcome',
          description: 'Welcome to the course',
          type: 'VIDEO',
          content: 'An introduction to the course content.',
          videoUrl: 'https://example.com/lesson1.mp4',
          videoDuration: 300,
          order: 1,
          position: 1,
          isFree: true,
          moduleId: module1.id,
          courseId: course1.id,
        },
        {
          title: 'Lesson 2: Core Concepts',
          description: 'Understanding the core concepts.',
          type: 'VIDEO',
          content: 'Diving deep into the core concepts.',
          videoUrl: 'https://example.com/lesson2.mp4',
          videoDuration: 900,
          order: 2,
          position: 2,
          isFree: false,
          moduleId: module1.id,
          courseId: course1.id,
        },
      ],
    });
  }

  // Create sample reviews
  console.log('Creating sample reviews...');
  if (students.length > 0 && createdCourses.length >= 2) {
    await prisma.review.upsert({
        where: { userId_courseId: { userId: students[0].id, courseId: createdCourses[0].id } },
        update: {},
        create: {
            userId: students[0].id,
            courseId: createdCourses[0].id,
            rating: 5,
            comment: 'Excellent course! Very well explained and practical examples.',
        },
    });

    await prisma.review.upsert({
        where: { userId_courseId: { userId: students[0].id, courseId: createdCourses[1].id } },
        update: {},
        create: {
            userId: students[0].id,
            courseId: createdCourses[1].id,
            rating: 4,
            comment: 'Great content, but could use more practical exercises.',
        },
    });
  }

  console.log('Seed completed successfully!');
  console.log('Test Accounts Created:');
  console.log(' Admin: admin@coursemarket.com / password123');
  console.log(' Instructor 1: john.instructor@coursemarket.com / password123');
  console.log(' Instructor 2: sarah.instructor@coursemarket.com / password123');
  for (let i = 1; i <= 5; i++) {
    console.log(` Student ${i}: student${i}@coursemarket.com / password123`);
  }
}

main()
  .catch((e) => {
    console.error(' Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });