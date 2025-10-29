# Run Migration NOW - Simple Steps

## ✅ Supabase CLI is installed!

Version: 2.54.11

---

## 🚀 Quick Migration Steps

You now have **2 easy options** to run the migration:

---

### Option 1: Supabase Dashboard (Fastest - 2 minutes)

This is the quickest way - no CLI setup needed!

**Steps**:

1. **Open this file in your editor**:
   ```
   /Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire/supabase/migrations/001_create_memory_tables.sql
   ```

2. **Select all and copy** (Cmd+A, then Cmd+C)

3. **Go to Supabase Dashboard**:
   - Open: https://supabase.com/dashboard/project/eaofdajkpqyddlbawdli
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

4. **Paste and run**:
   - Paste the SQL (Cmd+V)
   - Click **"Run"** (or press Cmd+Enter)
   - Wait for "Success. No rows returned" message

5. **Verify**:
   - Click **"Table Editor"** in left sidebar
   - You should see 4 new tables:
     - ✅ conversations
     - ✅ messages
     - ✅ user_memory
     - ✅ questionnaire_responses

**Done!** Your database is ready to use.

---

### Option 2: Using Supabase CLI (More steps, but reusable)

If you want to use the CLI for future migrations:

**Step 1: Login to Supabase**

Open your **regular terminal** (not in Claude Code) and run:
```bash
supabase login
```

This will:
- Open a browser window
- Ask you to authorize the CLI
- Save your credentials

**Step 2: Link your project**

```bash
cd /Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire
supabase link --project-ref eaofdajkpqyddlbawdli
```

You'll be asked to enter your database password. You can find it:
- In your `.env.local` (not stored there currently)
- Or in Supabase Dashboard → Settings → Database → Connection String

**Step 3: Run the migration**

```bash
supabase db push
```

This will apply all migrations in the `supabase/migrations/` folder.

**Step 4: Verify**

```bash
supabase db diff
```

Should show no differences (meaning migration was successful).

---

## 🎯 Recommendation

**Use Option 1** (Dashboard) for now - it's faster and simpler!

You can always use the CLI later for future migrations.

---

## ✅ After Migration

Once the tables are created, test your app:

1. **Go to your app**:
   ```
   http://localhost:3000/chat-questionnaire
   ```

2. **Start a conversation**:
   - Type a message
   - Share some preferences (e.g., "I love beach vacations")

3. **Verify data is being saved**:
   - Go to Supabase Dashboard → Table Editor
   - Check the `conversations` table - should have a row
   - Check the `messages` table - should have your messages
   - Check the `user_memory` table - should have saved preferences (if AI saved any)

4. **Test persistence**:
   - Refresh the page
   - Continue the conversation
   - The AI should remember context from before

---

## 🐛 If Something Goes Wrong

### Problem: "relation already exists"
**Solution**: Tables already created! Check Table Editor to verify they exist.

### Problem: "permission denied"
**Solution**: Make sure you're logged into the correct Supabase account.

### Problem: Migration fails
**Solution**:
1. Check for syntax errors in the SQL
2. Try running small sections at a time
3. Drop existing tables first (if they're incomplete):
   ```sql
   DROP TABLE IF EXISTS messages CASCADE;
   DROP TABLE IF EXISTS user_memory CASCADE;
   DROP TABLE IF EXISTS questionnaire_responses CASCADE;
   DROP TABLE IF EXISTS conversations CASCADE;
   ```
   Then re-run the full migration.

### Problem: Tables created but app not working
**Solution**:
1. Check browser console for errors
2. Verify `.env.local` has correct Supabase credentials
3. Restart dev server: Ctrl+C, then `pnpm dev`

---

## 📋 Migration Checklist

- [ ] Open Supabase Dashboard SQL Editor
- [ ] Copy migration SQL from `supabase/migrations/001_create_memory_tables.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] See "Success" message
- [ ] Verify 4 tables in Table Editor
- [ ] Test app at http://localhost:3000/chat-questionnaire
- [ ] Check that messages are saving in database

---

## What's Next?

After the migration works:

1. **✅ Your app is fully functional!**
   - Memory and conversations will be saved
   - Users can only see their own data
   - You can see all data in Supabase Dashboard

2. **Optional: Configure Vectorize for RAG**
   - See `SETUP_GUIDE.md` for instructions
   - Not required for basic functionality
   - Adds AI-powered knowledge base search

3. **Optional: Restart Claude Desktop**
   - To activate Supabase MCP server
   - Allows database queries from Claude Code
   - Useful for admin tasks

---

## 🎉 You're Almost Done!

Just run the migration using **Option 1** (Dashboard method) and you're ready to go!

The SQL file is here:
```
/Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire/supabase/migrations/001_create_memory_tables.sql
```

Should take less than 2 minutes! 🚀
