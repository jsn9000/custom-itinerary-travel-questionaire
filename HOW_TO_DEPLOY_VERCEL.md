# How to Deploy to Vercel

This guide explains how to deploy the travel questionnaire application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your environment variables ready (found in `.env.local` locally)

## Deployment Steps

### 1. Go to Vercel

Visit https://vercel.com and sign in with your GitHub account.

### 2. Import Your Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**
4. Find your repository: `custom-itinerary-travel-questionaire`
5. Click **"Import"**

**Note:** If you don't see your repository, click **"Adjust GitHub App Permissions"** to grant Vercel access.

### 3. Configure Project Settings

On the import screen:

- **Framework Preset:** Next.js (should be auto-detected)
- **Root Directory:** `./` (leave as default)
- **Build Command:** `pnpm build` (should be auto-detected)
- **Output Directory:** `.next` (should be auto-detected)

### 4. Add Environment Variables (CRITICAL!)

Before clicking "Deploy", you MUST add your environment variables:

1. Click **"Environment Variables"** section to expand it
2. Add the following variables:

#### Variable 1: GOOGLE_SHEET_ID
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** Your Google Sheet ID (the long string in the sheet URL)
- **Environment:** Production, Preview, Development (check all)

#### Variable 2: GOOGLE_SERVICE_ACCOUNT_KEY
- **Name:** `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value:** The complete JSON object from your `.env.local` file
  - Copy the entire value after `GOOGLE_SERVICE_ACCOUNT_KEY=`
  - It starts with `{"type":"service_account"...`
  - It ends with `..."universe_domain":"googleapis.com"}`
  - Must be all on ONE LINE
- **Environment:** Production, Preview, Development (check all)

### 5. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Once done, you'll see "Congratulations!" with your live URL

### 6. Test Your Deployment

1. Click on the deployment URL (e.g., `https://your-project-name.vercel.app`)
2. Navigate to `/questionnaire`
3. Fill out and submit the form
4. Check your Google Sheet to verify data is being saved

## After Deployment

### Your Live URLs

- **Main site:** `https://your-project-name.vercel.app`
- **Questionnaire:** `https://your-project-name.vercel.app/questionnaire`

Share the questionnaire URL with your clients!

### Automatic Deployments

Every time you push code to GitHub, Vercel will automatically rebuild and redeploy your site.

```bash
# Make changes to your code
git add .
git commit -m "Update questionnaire"
git push

# Vercel automatically deploys in 2-3 minutes
```

### Custom Domain (Optional)

To use your own domain:

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** > **"Domains"**
3. Enter your domain name
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Build Fails

**Check the build logs:**
1. Go to Vercel Dashboard
2. Click on your project
3. Click on the failed deployment
4. Review the logs for errors

**Common issues:**
- TypeScript errors: Run `pnpm tsc --noEmit` locally to check
- Missing dependencies: Make sure `package.json` is committed
- Build timeout: Contact Vercel support for larger projects

### Form Submissions Not Working

**Check environment variables:**
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Verify both `GOOGLE_SHEET_ID` and `GOOGLE_SERVICE_ACCOUNT_KEY` are set
3. Make sure the JSON in `GOOGLE_SERVICE_ACCOUNT_KEY` is properly formatted (no line breaks)

**Check function logs:**
1. Go to Vercel Dashboard > Your Project
2. Click on the latest deployment
3. Click **"Functions"** tab
4. Look for errors in the `/api/submit-questionnaire` function

**Verify Google Sheets setup:**
- Google Sheets API is enabled in Google Cloud Console
- Service account email has Editor access to your sheet
- Sheet ID in environment variable matches your actual sheet

### Environment Variables Not Working

**If you change environment variables:**
1. Go to Settings > Environment Variables
2. Edit the variable
3. Click **"Save"**
4. **IMPORTANT:** Redeploy for changes to take effect
   - Go to Deployments
   - Click the three dots menu on the latest deployment
   - Click **"Redeploy"**

### Need to Update Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Click the three dots next to the variable you want to update
5. Click **"Edit"**
6. Update the value
7. Click **"Save"**
8. Redeploy your site for changes to take effect

## Alternative: Vercel CLI

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd /path/to/custom-itinerary-travel-questionaire
vercel

# Follow the prompts
```

Then add environment variables through the Vercel Dashboard as described above.

## Security Notes

- **Never commit `.env.local`** to Git (it's already in `.gitignore`)
- **Never share your service account JSON** publicly
- Environment variables in Vercel are encrypted and secure
- Only authorized team members should have access to your Vercel project

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel Dashboard for detailed error messages

## Summary Checklist

Before deploying, make sure:
- [ ] Code is pushed to GitHub
- [ ] `.env.local` is NOT committed (check `.gitignore`)
- [ ] You have your `GOOGLE_SHEET_ID` value ready
- [ ] You have your `GOOGLE_SERVICE_ACCOUNT_KEY` JSON ready
- [ ] Google Sheets API is enabled
- [ ] Service account has Editor access to the sheet

During deployment:
- [ ] Import repository in Vercel
- [ ] Add both environment variables
- [ ] Deploy
- [ ] Test the live site
- [ ] Verify form submission adds data to Google Sheet

Done! Your questionnaire is live and ready to share with clients.
