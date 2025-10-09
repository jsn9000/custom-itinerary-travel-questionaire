import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';
import { generateQuestionnaireText } from '@/lib/pdf-generator';
import { sendQuestionnaireEmail } from '@/lib/email-sender';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.numberOfTravelers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Append data to Google Sheet using service account
    await appendToSheet(data);

    // Generate text file
    console.log('Generating text file for submission...');
    const textBuffer = await generateQuestionnaireText(data);
    console.log('Text file generated successfully');

    // Send email with text file attachment
    console.log('Sending email to jsn9000@gmail.com...');
    await sendQuestionnaireEmail(
      'jsn9000@gmail.com',
      data.name,
      data.email,
      textBuffer
    );
    console.log('Email sent successfully');

    return NextResponse.json(
      { success: true, message: 'Questionnaire submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}
