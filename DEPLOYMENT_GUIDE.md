# Deploy to Vercel - Quick Guide

## Prerequisites
Your `.env.local` file is already set up and **will NOT be committed** to Git (it's in .gitignore). You'll need to add the environment variables to Vercel.

## Step 1: Push to GitHub (if not already done)

```bash
git add .
git commit -m "Add travel questionnaire with Google Sheets integration"
git push
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository: `custom-itinerary-travel-questionaire`
5. **IMPORTANT**: Before clicking "Deploy", add your environment variables:
   - Click **"Environment Variables"**
   - Add these 2 variables:

   **Variable 1:**
   ```
   Name: GOOGLE_SHEET_ID
   Value: 1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc
   ```

   **Variable 2:**
   ```
   Name: GOOGLE_SERVICE_ACCOUNT_KEY
   Value: [Copy the entire JSON from your .env.local file]
   ```

   To get the JSON value:
   - Open `.env.local` in your project
   - Copy everything after `GOOGLE_SERVICE_ACCOUNT_KEY=`
   - It should start with `{"type":"service_account"...`

6. Click **"Deploy"**
7. Wait 2-3 minutes for deployment to complete
8. Your site will be live at: `https://your-project-name.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Add environment variables via CLI or website dashboard
```

## Step 3: Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app/questionnaire`
2. Fill out the form
3. Submit
4. Check your Google Sheet to see if the data appears

## Troubleshooting

### Form submissions not working
- Check Vercel logs: Dashboard > Your Project > Deployments > Click on latest deployment > View Function Logs
- Verify environment variables are set correctly in Vercel Dashboard > Settings > Environment Variables
- Make sure the service account email still has Editor access to your Google Sheet

### Environment variable issues
- The JSON value must be on a single line (no line breaks)
- Make sure you copied the ENTIRE JSON object including the outer `{` and `}`

### Google Sheets API errors
- Verify Google Sheets API is enabled in your Google Cloud project
- Confirm the service account email has Editor access to the sheet

## Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** > **"Domains"**
3. Add your custom domain
4. Update your DNS records as instructed

## Automatic Deployments

Every time you push to GitHub, Vercel will automatically redeploy your site!

```bash
git add .
git commit -m "Update questionnaire"
git push
```

Your changes will be live in 2-3 minutes.

## Environment Variables Reference

For production, you need these 2 variables:

```env
GOOGLE_SHEET_ID=1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"travel-website-474500",...}
```

## Your Live URLs

After deployment, your form will be accessible at:
- Main page: `https://your-project-name.vercel.app`
- Questionnaire: `https://your-project-name.vercel.app/questionnaire`

Share the questionnaire link with your clients!
