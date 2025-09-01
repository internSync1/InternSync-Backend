import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
      },
    });

    // Verify transporter configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready to send emails');
      console.log(`📧 Configured email: ${process.env.EMAIL_USER}`);
    } catch (error: any) {
      console.error('❌ Email service configuration error:', error);
      console.error('🔧 Check your EMAIL_USER and EMAIL_APP_PASSWORD in .env file');
    }
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      console.log(`📤 Attempting to send OTP to: ${email}`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for InternSync Authentication',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">InternSync Authentication</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-bottom: 15px;">Your One-Time Password (OTP)</h3>
              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; background-color: #e9ecef; padding: 15px 25px; border-radius: 5px; display: inline-block;">
                  ${otp}
                </span>
              </div>
              <p style="color: #6c757d; margin-top: 15px;">
                This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
              </p>
            </div>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this OTP, please ignore this email. Your account security is important to us.
              </p>
            </div>
            <p style="color: #6c757d; font-size: 12px; text-align: center; margin-top: 30px;">
              This is an automated message from InternSync. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      console.log('📬 Email details:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      return true;
    } catch (error: any) {
      console.error('❌ Error sending OTP email:', error);
      console.error('🔍 Email service error details:', {
        error: error.message,
        code: error.code,
        command: error.command
      });
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      console.log(`📤 Attempting to send welcome email to: ${email}`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to InternSync!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Welcome to InternSync!</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057;">Hello ${firstName}!</h3>
              <p style="color: #6c757d;">
                Thank you for joining InternSync. Your account has been successfully verified and you can now start exploring internship opportunities.
              </p>
              <p style="color: #6c757d;">
                Get started by completing your profile and browsing available internships.
              </p>
            </div>
            <p style="color: #6c757d; font-size: 12px; text-align: center; margin-top: 30px;">
              This is an automated message from InternSync. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      console.log('📬 Email details:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      return true;
    } catch (error: any) {
      console.error('❌ Error sending welcome email:', error);
      console.error('🔍 Email service error details:', {
        error: error.message,
        code: error.code,
        command: error.command
      });
      return false;
    }
  }
}

export default new EmailService();
