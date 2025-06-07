import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  const categories = [
    {
      name: 'Web Development',
      description: 'Learn modern web development technologies and frameworks',
      slug: 'web-development'
    },
    {
      name: 'Data Science',
      description: 'Master data analysis, machine learning, and AI',
      slug: 'data-science'
    },
    {
      name: 'Mobile Development',
      description: 'Build iOS and Android applications',
      slug: 'mobile-development'
    },
    {
      name: 'Programming',
      description: 'Learn programming languages and computer science fundamentals',
      slug: 'programming'
    },
    {
      name: 'Design',
      description: 'UI/UX design, graphic design, and creative tools',
      slug: 'design'
    },
    {
      name: 'Business',
      description: 'Business strategy, entrepreneurship, and management',
      slug: 'business'
    },
    {
      name: 'Marketing',
      description: 'Digital marketing, SEO, and social media strategies',
      slug: 'marketing'
    },
    {
      name: 'Photography',
      description: 'Photography techniques, editing, and visual storytelling',
      slug: 'photography'
    },
    {
      name: 'Music',
      description: 'Music theory, instruments, and audio production',
      slug: 'music'
    },
    {
      name: 'Health & Fitness',
      description: 'Fitness training, nutrition, and wellness',
      slug: 'health-fitness'
    },
    {
      name: 'Language',
      description: 'Learn new languages and improve communication skills',
      slug: 'language'
    },
    {
      name: 'Lifestyle',
      description: 'Personal development, hobbies, and life skills',
      slug: 'lifestyle'
    }
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create sample users
  const hashedPassword = await hash('password123', 12);

  const admin = await prisma.user.upsert({
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

  const student = await prisma.user.upsert({
    where: { email: 'student@coursemarket.com' },
    update: {},
    create: {
      email: 'student@coursemarket.com',
      firstName: 'Mike',
      lastName: 'Student',
      password: hashedPassword,
      role: 'STUDENT',
      isEmailVerified: true,
    },
  });

  // Get categories for course creation
  const webDevCategory = await prisma.category.findFirst({ where: { slug: 'web-development' } });
  const dataScienceCategory = await prisma.category.findFirst({ where: { slug: 'data-science' } });
  const programmingCategory = await prisma.category.findFirst({ where: { slug: 'programming' } });

  if (!webDevCategory || !dataScienceCategory || !programmingCategory) {
    throw new Error('Categories not found');
  }

  // Create sample courses
  console.log('Creating sample courses...');

  const course1 = await prisma.course.upsert({
    where: { slug: 'complete-react-course' },
    update: {},
    create: {
      title: 'Complete React Development Course',
      slug: 'complete-react-course',
      description: 'Master React from beginner to advanced. Learn hooks, context, routing, and modern React patterns. Build real-world projects and deploy them to production.',
      shortDescription: 'Master React from beginner to advanced with hands-on projects',
      price: 99.99,
      discountPrice: 79.99,
      level: 'INTERMEDIATE',
      language: 'English',
      thumbnail: '/api/placeholder/800/450',
      requirements: ['Basic JavaScript knowledge', 'HTML and CSS fundamentals', 'Code editor installed'],
      whatYouWillLearn: [
        'Build modern React applications',
        'Master React Hooks and Context API',
        'Implement routing with React Router',
        'Deploy React apps to production',
        'Write clean, maintainable code'
      ],
      status: 'PUBLISHED',
      instructorId: instructor1.id,
      categoryId: webDevCategory.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'python-data-science' },
    update: {},
    create: {
      title: 'Python for Data Science and Machine Learning',
      slug: 'python-data-science',
      description: 'Learn Python programming for data science. Cover NumPy, Pandas, Matplotlib, and Scikit-learn. Build machine learning models and analyze real datasets.',
      shortDescription: 'Learn Python for data science and machine learning',
      price: 129.99,
      discountPrice: 99.99,
      level: 'BEGINNER',
      language: 'English',
      thumbnail: '/api/placeholder/800/450',
      requirements: ['Basic programming knowledge', 'High school math', 'Computer with Python installed'],
      whatYouWillLearn: [
        'Python programming fundamentals',
        'Data manipulation with Pandas',
        'Data visualization techniques',
        'Machine learning basics',
        'Real-world data analysis projects'
      ],
      status: 'PUBLISHED',
      instructorId: instructor2.id,
      categoryId: dataScienceCategory.id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { slug: 'javascript-mastery' },
    update: {},
    create: {
      title: 'JavaScript Mastery: From Beginner to Expert',
      slug: 'javascript-mastery',
      description: 'Complete JavaScript course covering ES6+, async programming, DOM manipulation, and modern development practices. Perfect for beginners and intermediate developers.',
      shortDescription: 'Complete JavaScript course from beginner to expert level',
      price: 89.99,
      level: 'BEGINNER',
      language: 'English',
      thumbnail: '/api/placeholder/800/450',
      requirements: ['Basic computer skills', 'Text editor or IDE'],
      whatYouWillLearn: [
        'JavaScript fundamentals and ES6+ features',
        'DOM manipulation and event handling',
        'Asynchronous programming',
        'Object-oriented programming in JS',
        'Build interactive web applications'
      ],
      status: 'PUBLISHED',
      instructorId: instructor1.id,
      categoryId: programmingCategory.id,
    },
  });

  // Create modules and lessons for course 1
  console.log('Creating course modules and lessons...');

  const module1 = await prisma.module.create({
    data: {
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      order: 1,
      courseId: course1.id,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      title: 'Advanced React Concepts',
      description: 'Dive deeper into React',
      order: 2,
      courseId: course1.id,
    },
  });

  // Lessons for module 1
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introduction to React',
        description: 'What is React and why use it?',
        type: 'VIDEO',
        content: 'Introduction to React concepts and ecosystem',
        videoUrl: 'https://example.com/intro-react.mp4',
        videoDuration: 1200, // 20 minutes
        order: 1,
        position: 1,
        isFree: true,
        moduleId: module1.id,
        courseId: course1.id,
      },
      {
        title: 'Setting Up Development Environment',
        description: 'Install Node.js, npm, and create-react-app',
        type: 'VIDEO',
        content: 'Step by step development setup',
        videoUrl: 'https://example.com/setup.mp4',
        videoDuration: 900, // 15 minutes
        order: 2,
        position: 2,
        isFree: true,
        moduleId: module1.id,
        courseId: course1.id,
      },
      {
        title: 'Your First React Component',
        description: 'Create and render your first React component',
        type: 'VIDEO',
        content: 'Building your first component',
        videoUrl: 'https://example.com/first-component.mp4',
        videoDuration: 1800, // 30 minutes
        order: 3,
        position: 3,
        isFree: false,
        moduleId: module1.id,
        courseId: course1.id,
      },
      {
        title: 'JSX Syntax and Rules',
        description: 'Understanding JSX and its syntax rules',
        type: 'VIDEO',
        content: 'Deep dive into JSX',
        videoUrl: 'https://example.com/jsx.mp4',
        videoDuration: 1500, // 25 minutes
        order: 4,
        position: 4,
        isFree: false,
        moduleId: module1.id,
        courseId: course1.id,
      },
    ],
  });

  // Lessons for module 2
  await prisma.lesson.createMany({
    data: [
      {
        title: 'React Hooks Introduction',
        description: 'useState and useEffect hooks',
        type: 'VIDEO',
        content: 'Introduction to React Hooks',
        videoUrl: 'https://example.com/hooks-intro.mp4',
        videoDuration: 2100, // 35 minutes
        order: 1,
        position: 5,
        isFree: false,
        moduleId: module2.id,
        courseId: course1.id,
      },
      {
        title: 'Custom Hooks',
        description: 'Creating reusable custom hooks',
        type: 'VIDEO',
        content: 'Building custom hooks',
        videoUrl: 'https://example.com/custom-hooks.mp4',
        videoDuration: 1800, // 30 minutes
        order: 2,
        position: 6,
        isFree: false,
        moduleId: module2.id,
        courseId: course1.id,
      },
      {
        title: 'Context API',
        description: 'State management with Context API',
        type: 'VIDEO',
        content: 'Managing global state',
        videoUrl: 'https://example.com/context.mp4',
        videoDuration: 2400, // 40 minutes
        order: 3,
        position: 7,
        isFree: false,
        moduleId: module2.id,
        courseId: course1.id,
      },
    ],
  });

  // Create sample enrollments
  console.log('Creating sample enrollments...');
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      status: 'ACTIVE',
      progress: 25.5,
    },
  });

  // Create sample reviews
  console.log('Creating sample reviews...');
  await prisma.review.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      rating: 5,
      comment: 'Excellent course! Very well explained and practical examples.',
    },
  });

  await prisma.review.create({
    data: {
      userId: student.id,
      courseId: course2.id,
      rating: 4,
      comment: 'Great content, but could use more practical exercises.',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('\n📧 Test Accounts Created:');
  console.log('👑 Admin: admin@coursemarket.com / password123');
  console.log('👨‍🏫 Instructor 1: john.instructor@coursemarket.com / password123');
  console.log('👩‍🏫 Instructor 2: sarah.instructor@coursemarket.com / password123');
  console.log('👨‍🎓 Student: student@coursemarket.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
