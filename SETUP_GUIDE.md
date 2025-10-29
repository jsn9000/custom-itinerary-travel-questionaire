# Setup Guide - Database Migration & RAG Configuration

## Part 1: Running the Database Migration

You have **3 options** to run the migration. Choose the one that works best for you:

---

### Option 1: Supabase Dashboard (Easiest - Recommended)

**Step-by-step**:

1. **Open your Supabase project**:
   - Go to: https://supabase.com/dashboard/project/eaofdajkpqyddlbawdli

2. **Navigate to SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

3. **Copy the migration SQL**:
   - Open `supabase/migrations/001_create_memory_tables.sql` in your editor
   - Copy the entire contents (all ~140 lines)

4. **Paste and run**:
   - Paste into the SQL Editor
   - Click **"Run"** button (or press Cmd/Ctrl + Enter)

5. **Verify success**:
   - You should see: "Success. No rows returned"
   - Navigate to **"Table Editor"** in the left sidebar
   - You should see 4 new tables:
     - `conversations`
     - `messages`
     - `user_memory`
     - `questionnaire_responses`

**Done!** ✅ Your database is ready.

---

### Option 2: Using Supabase MCP (From Claude Code)

Since you have the Supabase MCP server configured, you can use it:

**Step-by-step**:

1. **Restart Claude Desktop**:
   - Quit Claude Desktop completely
   - Reopen Claude Desktop
   - Wait for it to fully load

2. **Verify MCP is active**:
   - In Claude Code, type a message to me
   - I should now have access to `mcp__` tools for Supabase

3. **Run the migration**:
   - I can read your migration file and execute it via MCP
   - Just ask me: "Run the Supabase migration using MCP"

**Note**: This option requires Claude Desktop restart first.

---

### Option 3: Install Supabase CLI (Most Flexible)

If you want the CLI for future use:

**Step-by-step**:

1. **Install Supabase CLI**:
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```
   - This will open a browser for authentication

3. **Link your project**:
   ```bash
   cd /Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire
   supabase link --project-ref eaofdajkpqyddlbawdli
   ```

4. **Run the migration**:
   ```bash
   supabase db push
   ```

5. **Verify**:
   ```bash
   supabase db diff
   ```
   - Should show no differences (meaning migration applied successfully)

**Benefit**: You can manage migrations with version control going forward.

---

## Part 2: Configuring Vectorize for RAG

Vectorize provides semantic search capabilities for your travel knowledge base.

### Step 1: Sign Up for Vectorize

1. **Create account**:
   - Go to: https://vectorize.io
   - Click **"Sign Up"** or **"Get Started"**
   - Create an account (free tier available)

2. **Verify email**:
   - Check your email for verification link
   - Click to verify your account

---

### Step 2: Create an Organization

1. **Login to dashboard**:
   - Go to: https://vectorize.io/dashboard

2. **Create organization**:
   - Click **"Create Organization"** or similar
   - Enter your organization name (e.g., "Mame Dee Travel")
   - Note your **Organization ID** (you'll need this)

---

### Step 3: Create a Pipeline

A "pipeline" is where your documents are stored and searched.

1. **Navigate to Pipelines**:
   - In the Vectorize dashboard, find **"Pipelines"** section

2. **Create new pipeline**:
   - Click **"Create Pipeline"** or **"New Pipeline"**
   - **Name**: "travel-knowledge-base" (or your choice)
   - **Description**: "Travel destination guides and information"
   - **Embedding Model**: Choose recommended option (usually "openai/text-embedding-3-small")

3. **Note your Pipeline ID**:
   - After creation, you'll see a **Pipeline ID**
   - Copy this - you'll need it for `.env.local`

---

### Step 4: Get API Access Token

1. **Go to Settings/API Keys**:
   - Look for **"Settings"**, **"API Keys"**, or **"Access Tokens"** section

2. **Generate token**:
   - Click **"Create Token"** or **"Generate API Key"**
   - **Name**: "Travel App"
   - **Permissions**: Read and Write (for uploading documents)

3. **Copy the token**:
   - ⚠️ **Important**: Copy immediately - you won't see it again!
   - Store it securely

---

### Step 5: Update Your Environment Variables

Now update your `.env.local` file with the real values:

```bash
# Replace these placeholder values with your actual Vectorize credentials:

VECTORIZE_ACCESS_TOKEN=vec_your_actual_access_token_here
VECTORIZE_ORG_ID=org_your_organization_id_here
VECTORIZE_PIPELINE_ID=pipe_your_pipeline_id_here
```

**Example** (with fake values for illustration):
```bash
VECTORIZE_ACCESS_TOKEN=vec_sk_abc123xyz789def456
VECTORIZE_ORG_ID=org_mame_dee_travel_123
VECTORIZE_PIPELINE_ID=pipe_travel_knowledge_base_456
```

---

### Step 6: Upload Documents to Vectorize

Now you need to add travel content to your knowledge base.

**Option A: Via Vectorize Dashboard (GUI)**

1. **Go to your pipeline**:
   - Navigate to your "travel-knowledge-base" pipeline

2. **Upload documents**:
   - Look for **"Upload"**, **"Add Documents"**, or **"Ingest"** button
   - You can upload:
     - Text files (`.txt`)
     - PDFs (`.pdf`)
     - Markdown files (`.md`)
     - CSV files (`.csv`)

3. **Organize by categories** (optional):
   - Destinations
   - Activities
   - Hotels/Accommodations
   - Travel tips
   - Seasonal information

**Option B: Programmatically (Advanced)**

Create a script to upload documents via the Vectorize API:

```typescript
// scripts/upload-to-vectorize.ts
import { VectorizeService } from '@/lib/retrieval/vectorize';

async function uploadDocuments() {
  const vectorize = new VectorizeService();

  const documents = [
    {
      text: "Paris is the capital of France, known for the Eiffel Tower...",
      metadata: {
        title: "Paris Travel Guide",
        category: "destination",
        country: "France"
      }
    },
    // Add more documents...
  ];

  // Note: You'll need to implement an upload method in VectorizeService
  // or use the Vectorize SDK directly
}
```

---

### Step 7: Test RAG Integration

Once you've uploaded documents and configured environment variables:

1. **Restart your dev server**:
   ```bash
   # In your terminal where dev server is running, press Ctrl+C
   # Then restart:
   pnpm dev
   ```

2. **Test the knowledge base**:
   - Go to: http://localhost:3000/chat-questionnaire
   - Ask a question about travel: "Tell me about Paris destinations"
   - The AI should use the `retrieveKnowledgeBase` tool
   - Watch the console logs for: `🔍 Tool executing with query: "Paris"`

3. **Check tool execution**:
   - In the chat UI, you should see a collapsed "Knowledge Base Search" tool call
   - Expand it to see the query and retrieved documents

---

## Part 3: Verification Checklist

### Database Migration
- [ ] SQL executed successfully in Supabase dashboard
- [ ] 4 tables visible in Table Editor:
  - [ ] `conversations`
  - [ ] `messages`
  - [ ] `user_memory`
  - [ ] `questionnaire_responses`
- [ ] No error messages in Supabase

### Vectorize RAG
- [ ] Vectorize account created
- [ ] Organization created (have org ID)
- [ ] Pipeline created (have pipeline ID)
- [ ] API token generated (have access token)
- [ ] `.env.local` updated with real credentials
- [ ] Documents uploaded to pipeline
- [ ] Dev server restarted after env changes

### Testing
- [ ] App loads at http://localhost:3000/chat-questionnaire
- [ ] Can send messages successfully
- [ ] Memories are being saved (check Supabase Table Editor)
- [ ] RAG search works (if documents uploaded)
- [ ] No errors in browser console

---

## Troubleshooting

### Database Migration Issues

**Problem**: "permission denied" or "unauthorized"
- **Solution**: Make sure you're logged into the correct Supabase account
- Check that you have admin access to project `eaofdajkpqyddlbawdli`

**Problem**: "relation already exists"
- **Solution**: Tables already created! Check Table Editor to verify
- If tables are corrupted, you can drop them first:
  ```sql
  DROP TABLE IF EXISTS messages CASCADE;
  DROP TABLE IF EXISTS user_memory CASCADE;
  DROP TABLE IF EXISTS questionnaire_responses CASCADE;
  DROP TABLE IF EXISTS conversations CASCADE;
  ```
  Then re-run the migration.

### Vectorize Issues

**Problem**: Can't find Vectorize.io
- **Solution**: Try https://www.vectorize.io or search "Vectorize vector database"
- Alternative: You could use **Pinecone**, **Weaviate**, or **Qdrant** instead
- You'd need to update `lib/retrieval/vectorize.ts` for a different service

**Problem**: "Failed to retrieve documents from Vectorize" error
- **Solution**: Check your environment variables are correct
- Verify your access token hasn't expired
- Make sure documents are uploaded to the pipeline
- Check console logs for detailed error messages

**Problem**: No documents uploaded yet
- **Solution**: RAG won't work without documents
- Either upload via dashboard or create an upload script
- You need at least a few documents for meaningful searches

### App Issues

**Problem**: App doesn't see new environment variables
- **Solution**: Restart your dev server (Ctrl+C, then `pnpm dev`)
- Clear browser cache and reload

**Problem**: TypeScript errors after changes
- **Solution**: Run `pnpm tsc --noEmit` to check for errors
- Most common: Missing type definitions or incorrect imports

**Problem**: Memory features not working
- **Solution**: Check that database migration completed
- Verify tables exist in Supabase Table Editor
- Check browser console for API errors

---

## Quick Start Commands

### To run migration (if you install Supabase CLI later):
```bash
brew install supabase/tap/supabase
cd /Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire
supabase login
supabase link --project-ref eaofdajkpqyddlbawdli
supabase db push
```

### To restart dev server:
```bash
# Press Ctrl+C in the terminal
pnpm dev
```

### To check TypeScript:
```bash
pnpm tsc --noEmit
```

### To test Supabase connection:
```bash
# In browser console at http://localhost:3000
fetch('/api/chat-questionnaire', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    sessionId: 'test-session-123'
  })
})
```

---

## What to Do Right Now

### Immediate Actions (Required):

1. **Run Database Migration** (Option 1 recommended):
   - Open Supabase dashboard SQL Editor
   - Copy/paste migration file
   - Click Run

2. **Test without RAG first**:
   - Go to http://localhost:3000/chat-questionnaire
   - Verify basic chat works
   - Check that messages save to database

### Optional (For Full Features):

3. **Set up Vectorize** (can do later):
   - Sign up at vectorize.io
   - Create pipeline
   - Update `.env.local`
   - Upload travel documents

4. **Restart Claude Desktop** (for MCP):
   - Quit and reopen Claude Desktop
   - Enables admin database access from Claude Code

---

## Need Help?

If you get stuck:
1. Check the console logs (browser and terminal)
2. Verify environment variables are set correctly
3. Make sure dev server was restarted after env changes
4. Check Supabase dashboard for data
5. Ask me for help with specific error messages!

---

**Summary**: Start with database migration using Option 1 (Dashboard), then test basic functionality. Add Vectorize later when you're ready to enable RAG search capabilities.
