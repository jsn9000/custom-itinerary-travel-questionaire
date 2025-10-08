# Simple Google Sheets Setup (No Service Account Needed!)

This is a much simpler approach using Google Apps Script. Follow these steps:

## Step 1: Open Your Google Sheet

Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc/edit

## Step 2: Add Headers to Your Sheet

In Row 1 of your sheet, add these column headers (copy and paste each one):

```
Timestamp | Name | Email | Number of Travelers | Children | Special Occasion | Destination | Continent | Need Accommodation | Hotel Price Range | Need Car Rental | Need Flight Help | Departure Airport | Willing Other Airport | Flight Date | Flexible Flight Date | Flight Preference | Need Activities Help | Need Food Help | Total Budget | Days on Land | Travel Date Flexibility
```

Or add them one by one:
- A1: Timestamp
- B1: Name
- C1: Email
- D1: Number of Travelers
- E1: Children
- F1: Special Occasion
- G1: Destination
- H1: Continent
- I1: Need Accommodation
- J1: Hotel Price Range
- K1: Need Car Rental
- L1: Need Flight Help
- M1: Departure Airport
- N1: Willing Other Airport
- O1: Flight Date
- P1: Flexible Flight Date
- Q1: Flight Preference
- R1: Need Activities Help
- S1: Need Food Help
- T1: Total Budget
- U1: Days on Land
- V1: Travel Date Flexibility

## Step 3: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** > **Apps Script**
2. Delete any code that's already there
3. Copy and paste this entire script:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Create a row with the data in the correct order
    var row = [
      new Date(), // Timestamp
      data.name || '',
      data.email || '',
      data.numberOfTravelers || '',
      data.children || '',
      data.specialOccasion || '',
      data.destination || '',
      data.continent || '',
      data.needAccommodation || '',
      data.hotelPriceRange || '',
      data.needCarRental || '',
      data.needFlightHelp || '',
      data.departureAirport || '',
      data.willingOtherAirport || '',
      data.flightDate || '',
      data.flexibleFlightDate || '',
      data.flightPreference || '',
      data.needActivitiesHelp || '',
      data.needFoodHelp || '',
      data.totalBudget || '',
      data.daysOnLand || '',
      data.travelDateFlexibility || ''
    ];

    // Append the row to the sheet
    sheet.appendRow(row);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'success': true,
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'success': false,
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - you can delete this if you want)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        numberOfTravelers: "2",
        children: "1 child, age 5",
        specialOccasion: "Anniversary",
        destination: "Paris",
        continent: "europe",
        needAccommodation: "yes",
        hotelPriceRange: "$150-200",
        needCarRental: "no",
        needFlightHelp: "yes",
        departureAirport: "JFK",
        willingOtherAirport: "yes",
        flightDate: "2025-06-15",
        flexibleFlightDate: "yes",
        flightPreference: "nonstop",
        needActivitiesHelp: "yes",
        needFoodHelp: "yes",
        totalBudget: "$3000",
        daysOnLand: "7",
        travelDateFlexibility: "Flexible within June"
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

## Step 4: Deploy as Web App

1. Click the **Deploy** button (top right) > **New deployment**
2. Click the gear icon ⚙️ next to "Select type" > Choose **Web app**
3. Fill in the settings:
   - **Description**: Travel Questionnaire Form
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the script (you may see a warning - click "Advanced" then "Go to [your project name]")
6. **COPY THE WEB APP URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 5: Add the URL to Your Environment Variables

1. In your project, create or edit the `.env.local` file
2. Add this line with your web app URL:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace `YOUR_DEPLOYMENT_ID` with the actual URL you copied.

## Step 6: Restart Your Dev Server

```bash
pnpm dev
```

## Done!

Now when you submit the questionnaire form, the data will automatically appear in your Google Sheet!

## Testing

1. Go to http://localhost:3001/questionnaire
2. Fill out the form
3. Submit it
4. Check your Google Sheet - you should see a new row with the data!

## Troubleshooting

**"Authorization required" error:**
- Make sure you authorized the script when deploying
- Check that "Who has access" is set to "Anyone"

**Data not appearing in sheet:**
- Verify the web app URL in `.env.local` is correct
- Make sure the sheet has the headers in Row 1
- Check the Apps Script execution log: Extensions > Apps Script > Executions

**Need to update the script?**
- Make your changes in the Apps Script editor
- Click Deploy > Manage deployments
- Click the pencil icon to edit
- Change "Version" to "New version"
- Click Deploy
