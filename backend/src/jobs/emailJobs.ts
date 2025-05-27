import nodemailer from 'nodemailer';
import { Worker } from 'bullmq';
import { env } from '../utils/env';
import { EmailJobData, emailQueue } from './queues';

// Email transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates: Record<string, (data: any) => { subject: string; html: string }> = {
  welcome: (data) => ({
    subject: `Welcome to Course Marketplace, ${data.firstName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Course Marketplace!</h1>
        <p>Hi ${data.firstName},</p>
        <p>Thank you for joining Course Marketplace. We're excited to have you on board!</p>
        <p>Start exploring our courses and begin your learning journey today.</p>
        <a href="${env.FRONTEND_URL}/courses" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Browse Courses</a>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),

  'email-verification': (data) => ({
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Verify Your Email Address</h1>
        <p>Hi ${data.firstName},</p>
        <p>Please click the button below to verify your email address:</p>
        <a href="${data.verificationUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),

  'password-reset': (data) => ({
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Reset Your Password</h1>
        <p>Hi ${data.firstName},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${data.resetUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),

  'course-enrollment': (data) => ({
    subject: `You're enrolled in ${data.courseTitle}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Course Enrollment Confirmation</h1>
        <p>Hi ${data.firstName},</p>
        <p>Congratulations! You have successfully enrolled in <strong>${data.courseTitle}</strong>.</p>
        <p>You can start learning immediately by accessing your course dashboard.</p>
        <a href="${env.FRONTEND_URL}/my-courses/${data.courseId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Learning</a>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),

  'course-completion': (data) => ({
    subject: `Congratulations! You've completed ${data.courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Course Completed! 🎉</h1>
        <p>Hi ${data.firstName},</p>
        <p>Congratulations on completing <strong>${data.courseTitle}</strong>!</p>
        <p>Your certificate is now available for download.</p>
        <a href="${env.FRONTEND_URL}/certificates/${data.certificateId}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Certificate</a>
        <p>Keep learning and exploring new courses!</p>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),

  'instructor-payout': (data) => ({
    subject: 'Your monthly payout is ready',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Monthly Payout Notification</h1>
        <p>Hi ${data.firstName},</p>
        <p>Your monthly payout of <strong>${data.amount}</strong> has been processed.</p>
        <p>Payment details:</p>
        <ul>
          <li>Amount: ${data.amount}</li>
          <li>Period: ${data.period}</li>
          <li>Transaction ID: ${data.transactionId}</li>
        </ul>
        <p>The funds should arrive in your account within 2-3 business days.</p>
        <p>Best regards,<br>The Course Marketplace Team</p>
      </div>
    `,
  }),
};

// Email service
export class EmailService {
  static async sendEmail(to: string, template: string, data: Record<string, any>) {
    const templateFn = emailTemplates[template];
    if (!templateFn) {
      throw new Error(`Email template '${template}' not found`);
    }

    const { subject, html } = templateFn(data);

    const mailOptions = {
      from: env.FROM_EMAIL,
      to,
      subject,
      html,
    };

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, result.messageId);
      return result;
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  static async queueEmail(to: string, template: string, data: Record<string, any>, delay?: number) {
    const jobData: EmailJobData = { to, template, data };
    
    const options: any = {};
    if (delay) {
      options.delay = delay;
    }

    return emailQueue.add('send-email', jobData, options);
  }
}

// Email job processor
const emailWorker = new Worker('email', async (job) => {
  const { to, template, data } = job.data as EmailJobData;
  await EmailService.sendEmail(to, template, data);
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  }
});

export { emailWorker };
