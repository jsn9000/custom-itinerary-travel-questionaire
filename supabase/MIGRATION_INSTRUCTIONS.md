# Supabase Memory Tables Migration

## How to Run the Migration

You have two options to create the memory tables in your Supabase database:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/eaofdajkpqyddlbawdli
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **"New query"**
4. Copy and paste the contents of `migrations/001_create_memory_tables.sql`
5. Click **"Run"** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd /Users/jsimpson/github/deja-jasper/custom-itinerary-travel-questionaire

# Link your project (if not already linked)
supabase link --project-ref eaofdajkpqyddlbawdli

# Run the migration
supabase db push
```

## Tables Created

After running the migration, you will have these tables:

1. **conversations** - Stores chat sessions
   - `id`, `user_id`, `session_id`, `metadata`, `created_at`, `updated_at`

2. **messages** - Stores individual messages in conversations
   - `id`, `conversation_id`, `role`, `content`, `metadata`, `created_at`

3. **user_memory** - Stores user preferences, facts, and context
   - `id`, `user_id`, `session_id`, `memory_key`, `memory_value`, `memory_type`, `relevance_score`, `metadata`, `created_at`, `updated_at`

4. **questionnaire_responses** - Stores structured questionnaire data
   - `id`, `session_id`, `user_id`, `responses`, `status`, `created_at`, `updated_at`

## Verify Installation

After running the migration, verify it worked by running this query in the SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('conversations', 'messages', 'user_memory', 'questionnaire_responses');
```

You should see all 4 tables listed.

## Next Steps

Once the tables are created, your application will automatically:
- Store conversation history
- Remember user preferences and context
- Track questionnaire responses
- Provide personalized responses using memory

The AI agent has access to these tools:
- `retrieveMemory` - Get user context and history
- `saveMemory` - Store user preferences and facts
- `saveConversationMessage` - Save messages to history
- `retrieveKnowledgeBase` - RAG search (existing functionality)
