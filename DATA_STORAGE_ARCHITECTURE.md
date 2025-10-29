# Data Storage Architecture

## Overview

Your application has **three separate storage systems** for different types of data:

## 1. 📚 Knowledge Base (RAG) - **Vectorize.io**

**What's stored**: Travel information, destination guides, recommendations (static reference content)

**Location**: External service - Vectorize.io
- Organization ID: Set in `VECTORIZE_ORG_ID`
- Pipeline ID: Set in `VECTORIZE_PIPELINE_ID`
- Access Token: Set in `VECTORIZE_ACCESS_TOKEN`

**Code**: `lib/retrieval/vectorize.ts`

**Who can access**:
- ✅ Backend (API routes) via `retrieveKnowledgeBase` tool
- ❌ Frontend cannot directly access

**Current status**: ⚠️ Not configured (placeholder values in .env.local)

**Purpose**: Provides contextual travel information when users ask questions

---

## 2. 💾 User Data & Memory - **Supabase**

**What's stored**: User conversations, preferences, questionnaire responses (dynamic user data)

**Location**: Supabase PostgreSQL database
- Project: https://eaofdajkpqyddlbawdli.supabase.co
- Tables: `conversations`, `messages`, `user_memory`, `questionnaire_responses`

**Code**: `lib/memory/memory-service.ts`

**Who can access**:
- ✅ Backend (API routes) via memory service
- ⚠️ Currently: AI agent tools CAN retrieve via `retrieveMemory` tool
- ✅ You want: ONLY backend admins should retrieve

**Purpose**: Store and retrieve user-specific information across sessions

### Tables Breakdown:

#### `conversations`
- Stores chat session metadata
- Links to all messages in a conversation

#### `messages`
- Individual chat messages (user and assistant)
- Full conversation history

#### `user_memory`
- User preferences (e.g., "prefers luxury hotels")
- Facts (e.g., "traveling with 2 children")
- Goals (e.g., "wants beach vacation")
- Context (e.g., "celebrating anniversary")

#### `questionnaire_responses`
- Structured questionnaire data
- Status tracking (in_progress/completed/abandoned)

---

## 3. 📧 Email Submissions - **Gmail + Google Sheets**

**What's stored**: Completed questionnaire submissions

**Location**:
- Email: jsn9000@gmail.com
- Google Sheets: ID `1sQKB0Z5-ToviNmADGVfJkiRm-AuYA-opkukdu65ZOmc`

**Code**: `components/agent/tools/submit-questionnaire.ts`

**Who can access**:
- ✅ Backend only (via `submitQuestionnaire` tool)
- Sends to specific email addresses

**Purpose**: Final submission of completed questionnaires to backend staff

---

## 🔒 Security Concern: Restricting Memory Retrieval

You mentioned: **"I only want a backend user to be able to retrieve previous conversations and user preferences"**

### Current Setup (❌ Too Open)

The AI agent currently has access to these tools:
```typescript
tools: {
  retrieveMemory,          // ❌ AI can retrieve user data
  saveMemory,              // ✅ AI should save memories
  saveConversationMessage, // ✅ AI should save messages
  retrieveKnowledgeBase,   // ✅ AI should search knowledge base
  submitQuestionnaire,     // ✅ AI should submit forms
}
```

### Issue
- The AI agent can call `retrieveMemory` to retrieve ANY user's conversation history or preferences
- While this enables personalization, it means the AI has broad access to user data

### Recommended Solution

**Option 1: Remove AI's Retrieval Access (Simplest)**

Remove `retrieveMemory` from the tools, but keep automatic context loading:

```typescript
// In app/api/chat-questionnaire/route.ts

// Keep this - loads context automatically for current session only
const memoryContext = await memoryService.buildContextForSession(sessionId, userId);

// But remove this from tools
tools: {
  // retrieveMemory,        // ❌ REMOVE - No manual retrieval
  saveMemory,              // ✅ Keep - AI can save
  saveConversationMessage, // ✅ Keep - AI can save
  retrieveKnowledgeBase,   // ✅ Keep - RAG search
  submitQuestionnaire,     // ✅ Keep - Submit forms
}
```

**Result**:
- AI automatically gets context for the CURRENT session
- AI CANNOT retrieve arbitrary user data or other sessions
- Backend admins can still query database directly

---

**Option 2: Create Admin-Only API Endpoints**

Create protected endpoints for backend staff only:

```typescript
// app/api/admin/conversations/[sessionId]/route.ts
// Requires authentication/API key

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  // Check admin authentication
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  const memoryService = new MemoryService();
  const conversation = await memoryService.getConversation(params.sessionId);
  const messages = await memoryService.getConversationHistory(conversation.id);

  return Response.json({ conversation, messages });
}
```

**Result**:
- AI has no direct access to retrieve user data
- Backend admins use secure API endpoints with authentication
- Full audit trail of who accessed what

---

**Option 3: Row-Level Security (RLS) in Supabase**

Restrict database access using Supabase RLS policies:

```sql
-- Only allow access to current session's data
CREATE POLICY "Users can only access their own session"
  ON user_memory
  FOR SELECT
  USING (session_id = current_setting('app.current_session_id'));

-- Admins can access everything
CREATE POLICY "Admins can access all data"
  ON user_memory
  FOR ALL
  USING (current_user = 'admin_role');
```

**Result**:
- Database enforces access control
- AI can only access data for the active session
- Admins have a separate privileged connection

---

## 📊 Recommended Architecture

### For AI Agent (Frontend-Facing)
```typescript
tools: {
  saveMemory,              // ✅ Save user preferences
  saveConversationMessage, // ✅ Save chat history
  retrieveKnowledgeBase,   // ✅ Search travel info
  submitQuestionnaire,     // ✅ Submit completed forms
}

// Automatic context loading (no tool call needed)
const memoryContext = await memoryService.buildContextForSession(
  sessionId,  // ✅ Only current session
  userId      // ✅ Only if provided
);
```

### For Backend Admins
```typescript
// Direct database queries via Supabase MCP or admin API endpoints
// Full access to all conversations, memories, and responses
// Protected by authentication/API keys
```

---

## 🛠️ Implementation Steps

### Step 1: Remove AI's Manual Retrieval Access

Edit `app/api/chat-questionnaire/route.ts`:

```typescript
import {
  submitQuestionnaire,
  // retrieveMemory,        // ❌ REMOVE THIS
  saveMemory,
  saveConversationMessage,
  retrieveKnowledgeBase
} from "@/components/agent/tools";

// ... in the route handler:

tools: {
  submitQuestionnaire,
  // retrieveMemory,        // ❌ REMOVE THIS
  saveMemory,
  saveConversationMessage,
  retrieveKnowledgeBase,
}
```

### Step 2: Keep Automatic Context Loading

The API route already loads context automatically:

```typescript
// This stays - loads only current session
const memoryContext = await memoryService.buildContextForSession(sessionId, userId);
```

### Step 3: Access Data as Admin

Use Supabase MCP server (already configured) or create admin endpoints.

**Via MCP Server**:
- Restart Claude Desktop
- Use MCP tools to query Supabase directly
- Full SQL access to all tables

**Via Admin API** (optional):
- Create protected `/api/admin/*` routes
- Require API key authentication
- Build admin dashboard

---

## 🔍 Data Flow Summary

```
User Input
    ↓
Chat API (/api/chat-questionnaire)
    ↓
[Auto-load current session context] ← Supabase
    ↓
AI Agent (GPT-4)
    ├→ Save memories ← Supabase
    ├→ Save messages ← Supabase
    ├→ Search knowledge ← Vectorize
    └→ Submit form ← Email/Sheets
    ↓
Response to User
```

**Backend Admin Access**:
```
Admin User
    ↓
Supabase Dashboard / MCP / Admin API
    ↓
Direct Database Access (all data)
```

---

## 📝 Summary

| Data Type | Storage | AI Access | Admin Access |
|-----------|---------|-----------|--------------|
| **Knowledge Base** | Vectorize.io | ✅ Read-only via tool | ✅ Via Vectorize dashboard |
| **Current Session** | Supabase | ✅ Auto-loaded | ✅ Full access |
| **Other Sessions** | Supabase | ❌ Recommended: No access | ✅ Full access |
| **User Memories** | Supabase | ✅ Can save / ❌ Should not retrieve | ✅ Full access |
| **Questionnaire Submissions** | Email/Sheets | ✅ Can submit | ✅ Full access |

---

## ⚠️ Action Required

**Decision needed**: Do you want to remove the `retrieveMemory` tool from the AI agent?

**Recommendation**: ✅ **Yes, remove it**

**Reason**:
- AI doesn't need manual retrieval - context is loaded automatically
- Removes potential security/privacy risk
- Admins can still access everything via Supabase dashboard or MCP

Let me know if you'd like me to make this change!
