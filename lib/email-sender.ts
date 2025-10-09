import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Create transporter using Gmail SMTP
  // You'll need to set up environment variables for this
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });
}

export async function sendQuestionnaireEmail(
  recipientEmail: string,
  travelerName: string,
  travelerEmail: string,
  textBuffer: Buffer
): Promise<void> {
  const subject = `New Travel Questionnaire Submission - ${travelerName}`;

  const text = `
You have received a new travel questionnaire submission.

Traveler Name: ${travelerName}
Traveler Email: ${travelerEmail}
Submitted: ${new Date().toLocaleString('en-US')}

Please see the attached text file for complete details.
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Travel Questionnaire Submission</h2>
      <p>You have received a new travel questionnaire submission.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Traveler Name:</strong> ${travelerName}</p>
        <p style="margin: 5px 0;"><strong>Traveler Email:</strong> ${travelerEmail}</p>
        <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-US')}</p>
      </div>

      <p>Please see the attached text file for complete details.</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">This email was automatically generated from Mame Dee Travel World.</p>
    </div>
  `;

  await sendEmail({
    to: recipientEmail,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `questionnaire_${travelerName.replace(/\s+/g, '_')}_${Date.now()}.txt`,
        content: textBuffer,
        contentType: 'text/plain',
      },
    ],
  });
}
