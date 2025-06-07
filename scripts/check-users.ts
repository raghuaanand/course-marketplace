import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAndCreateTestUser() {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();
    // console.log(`Found ${userCount} users in the database`);

    if (userCount === 0) {
      console.log('Creating test user...');
      
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
          role: 'STUDENT',
          isEmailVerified: true,
        },
      });
      
      console.log('Test user created:', {
        id: testUser.id,
        email: testUser.email,
        name: `${testUser.firstName} ${testUser.lastName}`,
        role: testUser.role,
      });
    } else {
      // Show existing users (without passwords)
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });
      
      console.log('Existing users:');
      users.forEach(user => {
        console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - ${user.role}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateTestUser();
