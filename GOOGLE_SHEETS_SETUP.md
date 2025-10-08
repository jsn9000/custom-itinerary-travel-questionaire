# Google Sheets Integration Setup

This guide will help you set up the Google Sheets integration for the travel questionnaire.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `travel-questionnaire`
   - Description: `Service account for travel questionnaire form`
4. Click "Create and Continue"
5. Skip the optional steps (roles can be skipped for this use case)
6. Click "Done"

## Step 3: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file
6. **Keep this file secure!** It contains credentials for your service account

## Step 4: Share Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc/edit
2. Click the "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it **Editor** access
5. Click "Send" or "Share"

## Step 5: Set Up Your Sheet Headers

Add the following headers to Row 1 of your Google Sheet (in this exact order):

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Number of Travelers | Children | Special Occasion | Destination | Continent | Need Accommodation | Hotel Price Range | Need Car Rental | Need Flight Help | Departure Airport | Willing Other Airport | Flight Date | Flexible Flight Date | Flight Preference | Need Activities Help | Need Food Help | Total Budget | Days on Land | Travel Date Flexibility |

## Step 6: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Existing OpenAI and Vectorize Configuration
OPENAI_API_KEY=your_openai_api_key_here
VECTORIZE_ACCESS_TOKEN=your_vectorize_token
VECTORIZE_ORG_ID=your_org_id
VECTORIZE_PIPELINE_ID=your_pipeline_id
```

For `GOOGLE_SERVICE_ACCOUNT_KEY`:
- Open the JSON file you downloaded in Step 3
- Copy the **entire contents** of the file
- Paste it as a single line in the `.env.local` file
- Make sure it's all on one line (no line breaks)

Example:
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"my-project","private_key_id":"abc123",...}
```

## Step 7: Restart Your Development Server

After setting up the environment variables, restart your Next.js development server:

```bash
pnpm dev
```

## Testing the Integration

1. Visit http://localhost:3001/questionnaire
2. Fill out the form
3. Click "Submit Questionnaire"
4. Check your Google Sheet - a new row should appear with the submitted data!

## Troubleshooting

### "Failed to submit questionnaire" error
- Check that the service account email has Editor access to your Google Sheet
- Verify that `GOOGLE_SERVICE_ACCOUNT_KEY` is properly formatted (all on one line)
- Check the browser console and server logs for detailed error messages

### "GOOGLE_SHEET_ID not configured" error
- Make sure `.env.local` exists in the project root
- Verify the environment variable names are correct
- Restart the development server after adding environment variables

### Permission denied errors
- Ensure you've shared the Google Sheet with the service account email
- Verify the Google Sheets API is enabled in your Google Cloud project
- Check that the service account key is valid and not expired
