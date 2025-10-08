import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/google-sheets';

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
