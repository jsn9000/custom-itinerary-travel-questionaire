import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';
import { generateQuestionnairePDF } from '@/lib/pdf-generator';
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

    // Generate PDF
    console.log('Generating PDF for submission...');
    const pdfBuffer = await generateQuestionnairePDF(data);
    console.log('PDF generated successfully');

    // Send email with PDF attachment
    console.log('Sending email to jsn9000@gmail.com...');
    await sendQuestionnaireEmail(
      'jsn9000@gmail.com',
      data.name,
      data.email,
      pdfBuffer
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
