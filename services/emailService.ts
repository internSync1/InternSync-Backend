import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  private isDevelopmentMode: boolean;
  private emailConfigured: boolean;

  constructor() {
    this.emailConfigured = !!(process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL);
    this.isDevelopmentMode = process.env.NODE_ENV === 'development';

    if (this.emailConfigured && !this.isDevelopmentMode) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      console.log('✅ SendGrid email service initialized');
      console.log(`📧 From email: ${process.env.FROM_EMAIL}`);
    } else {
      console.log('🔧 Email service running in DEVELOPMENT MODE');
      if (!this.emailConfigured) {
        console.log('📝 To enable email: Set SENDGRID_API_KEY and FROM_EMAIL in .env file');
      } else {
        console.log('📝 Set NODE_ENV=production to enable actual email sending');
      }
    }
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    if (this.isDevelopmentMode || !this.emailConfigured) {
      console.log('🔧 DEVELOPMENT MODE: OTP Email');
      console.log(`📧 To: ${email}`);
      console.log(`🔑 OTP: ${otp}`);
      console.log('✅ Email simulated successfully');
      return true;
    }

    try {
      console.log(`📤 Sending OTP via SendGrid to: ${email}`);

      const msg = {
        to: email,
        from: process.env.FROM_EMAIL!,
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
        text: `Your OTP code is: ${otp}. This code expires in 10 minutes. Please do not share this code with anyone.`
      };

      await sgMail.send(msg);
      console.log('✅ OTP email sent successfully via SendGrid!');
      return true;
    } catch (error: any) {
      console.error('❌ SendGrid error sending OTP email:', error.message);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }

      // Fallback to development mode for this request
      console.log('🔧 Falling back to development mode');
      console.log(`📧 To: ${email}`);
      console.log(`🔑 OTP: ${otp}`);
      return true;
    }
  }

  async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    const name = firstName || 'there';
    if (this.isDevelopmentMode || !this.emailConfigured) {
      console.log('🔧 DEVELOPMENT MODE: Welcome Email');
      console.log(`📧 To: ${email}`);
      console.log(`👋 Welcome ${name}!`);
      console.log('✅ Email simulated successfully');
      return true;
    }

    try {
      console.log(`📤 Sending welcome email via SendGrid to: ${email}`);

      const msg = {
        to: email,
        from: process.env.FROM_EMAIL!,
        subject: 'Welcome to InternSync!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Welcome to InternSync!</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057;">Hello ${name}!</h3>
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
        text: `Hello ${name}! Thank you for joining InternSync. Your account has been successfully verified and you can now start exploring internship opportunities.`
      };

      await sgMail.send(msg);
      console.log('✅ Welcome email sent successfully via SendGrid!');
      return true;
    } catch (error: any) {
      console.error('❌ SendGrid error sending welcome email:', error.message);
      if (error.response) {
        console.error('SendGrid response:', error.response.body);
      }

      console.log('🔧 Falling back to development mode');
      console.log(`📧 To: ${email}`);
      console.log(`👋 Welcome ${name}!`);
      return true;
    }
  }
}

export default new EmailService();
