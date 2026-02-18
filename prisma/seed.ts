import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create categories
  const categoriesData = [
    { name: 'Web Development', description: 'Learn full-stack web development using React, Node.js, and modern frameworks', slug: 'web-development' },
    { name: 'Data Science', description: 'Master data analytics, AI, and machine learning using Python and R', slug: 'data-science' },
    { name: 'Mobile App Development', description: 'Build Android and iOS apps using Flutter and Kotlin', slug: 'mobile-development' },
    { name: 'Programming', description: 'Learn programming fundamentals with C, C++, Java, and Python', slug: 'programming' },
    { name: 'Design', description: 'UI/UX design using Figma, Adobe XD, and creative Indian case studies', slug: 'design' },
    { name: 'Business & Entrepreneurship', description: 'Learn business strategy, Indian startup ecosystem, and management', slug: 'business' },
    { name: 'Digital Marketing', description: 'Master SEO, Google Ads, and social media marketing for Indian audiences', slug: 'marketing' },
    { name: 'Photography', description: 'Learn photography, editing, and storytelling with Indian cultural themes', slug: 'photography' },
    { name: 'Music', description: 'Indian classical, Bollywood, and modern music production', slug: 'music' },
    { name: 'Health & Fitness', description: 'Yoga, Indian nutrition, and holistic wellness practices', slug: 'health-fitness' },
    { name: 'Language Learning', description: 'Learn Hindi, Tamil, and English communication skills', slug: 'language' },
    { name: 'Lifestyle', description: 'Indian cooking, mindfulness, and personal development', slug: 'lifestyle' }
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
    where: { email: 'admin@coursemarket.in' },
    update: {},
    create: {
      email: 'admin@coursemarket.in',
      firstName: 'Amit',
      lastName: 'Verma',
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  const instructor1 = await prisma.user.upsert({
    where: { email: 'raghu.instructor@coursemarket.in' },
    update: {},
    create: {
      email: 'raghu.instructor@coursemarket.in',
      firstName: 'Raghu',
      lastName: 'Anand',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      isEmailVerified: true,
      bio: 'Full-stack developer from Bengaluru with 10+ years of experience teaching MERN stack and cloud computing.',
      avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328b5d9d?w=150&h=150&fit=crop&crop=face',
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'neha.instructor@coursemarket.in' },
    update: {},
    create: {
      email: 'neha.instructor@coursemarket.in',
      firstName: 'Neha',
      lastName: 'Sharma',
      password: hashedPassword,
      role: 'INSTRUCTOR',
      isEmailVerified: true,
      bio: 'Data scientist from Pune specializing in machine learning and AI. Loves making data science approachable for everyone.',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    },
  });
  const instructors = [instructor1, instructor2];

  console.log('Creating students...');
  const students = [];
  const indianNames = ['Arjun', 'Priya', 'Karthik', 'Sneha', 'Ravi'];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@coursemarket.in` },
      update: {},
      create: {
        email: `student${i}@coursemarket.in`,
        firstName: indianNames[i - 1],
        lastName: 'Patel',
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
          description: `A practical and in-depth ${category.name} course taught by ${instructor.firstName} from India.`,
          shortDescription: `Learn ${category.name} hands-on with ${instructor.firstName}.`,
          price: parseFloat((Math.random() * (9999 - 1999) + 1999).toFixed(2)), // INR-like pricing
          level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'][Math.floor(Math.random() * 3)],
          language: 'English',
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop',
          requirements: ['Basic understanding of computers'],
          whatYouWillLearn: [`Gain mastery over ${category.name}`],
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
      const enrollments = new Set<string>();
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
          description: 'Welcome to the course and meet your instructor',
          type: 'VIDEO',
          content: 'Overview of what you’ll learn in this course.',
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
          description: 'Understanding the key concepts step-by-step.',
          type: 'VIDEO',
          content: 'We’ll dive into the fundamentals of the topic with real-world Indian examples.',
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
        comment: 'Excellent course! Very practical and relatable Indian examples.',
      },
    });

    await prisma.review.upsert({
      where: { userId_courseId: { userId: students[0].id, courseId: createdCourses[1].id } },
      update: {},
      create: {
        userId: students[0].id,
        courseId: createdCourses[1].id,
        rating: 4,
        comment: 'Good content, would love more Hindi explanations for beginners.',
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log('Test Accounts Created:');
  console.log(' Admin: admin@coursemarket.in / password123');
  console.log(' Instructor 1: raghu.instructor@coursemarket.in / password123');
  console.log(' Instructor 2: neha.instructor@coursemarket.in / password123');
  for (let i = 1; i <= 5; i++) {
    console.log(` Student ${i}: student${i}@coursemarket.in / password123`);
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
