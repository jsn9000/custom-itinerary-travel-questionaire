import { google } from 'googleapis';

export async function appendToSheet(data: Record<string, string>) {
  try {
    // Parse the service account credentials from environment variable
    // Support both direct JSON and base64-encoded JSON
    let credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}';

    // If it looks like base64 (no { at start), decode it
    if (!credentialsJson.trim().startsWith('{')) {
      credentialsJson = Buffer.from(credentialsJson, 'base64').toString('utf-8');
    }

    // Remove any actual control characters (newlines, tabs, carriage returns)
    // that shouldn't be in the JSON structure itself
    // But preserve escaped versions like \\n which should be in the private key
    credentialsJson = credentialsJson
      .split('\n')
      .map(line => line.trim())
      .join('');

    const credentials = JSON.parse(credentialsJson);

    // Ensure private key has proper newlines
    if (credentials.private_key && !credentials.private_key.includes('\n')) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }

    // Create JWT client directly
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    // Prepare the row data in the order matching the sheet columns
    // Format timestamp as human readable: "Jan 15, 2025 10:30 AM"
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const row = [
      timestamp, // Timestamp
      data.name,
      data.email,
      data.numberOfTravelers,
      data.children,
      data.specialOccasion,
      data.destination,
      data.continent,
      data.needAccommodation,
      data.hotelPriceRange,
      data.needCarRental,
      data.needFlightHelp,
      data.departureAirport,
      data.willingOtherAirport,
      data.flightDate,
      data.flexibleFlightDate,
      data.flightPreference,
      data.needActivitiesHelp,
      data.needFoodHelp,
      data.totalBudget,
      data.daysOnLand,
      data.travelDateFlexibility,
    ];

    // Append the row to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:V', // Adjust if your sheet has a different name
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return { success: true, response: response.data };
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw error;
  }
}
