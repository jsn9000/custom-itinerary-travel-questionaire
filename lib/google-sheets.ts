import { google } from 'googleapis';

export async function appendToSheet(data: Record<string, string>) {
  try {
    // Parse the service account credentials from environment variable
    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'
    );

    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
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
