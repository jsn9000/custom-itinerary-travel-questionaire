# MCP Server Setup Guide

This guide explains how to configure and use the MCP (Model Context Protocol) servers in your project.

## Overview

Your project now uses **three MCP servers**:

1. **Firecrawl MCP** - Web scraping and crawling
2. **Supabase MCP** - Database operations and memory management
3. **Vectorize MCP** - Vector search and knowledge base retrieval

## Architecture Change

### Before (Direct Integration)
- ✗ Direct SDK imports for Supabase and Vectorize
- ✗ Custom tool wrappers written manually
- ✗ Tightly coupled to your codebase

### After (MCP Servers)
- ✓ Standardized MCP protocol for all integrations
- ✓ Automatic tool discovery from MCP servers
- ✓ Loosely coupled, maintainable architecture
- ✓ Better separation of concerns

## Required Environment Variables

### 1. Supabase MCP Server

Add these to your `.env.local`:

```bash
# Supabase MCP Server Configuration
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
SUPABASE_PROJECT_REF=eaofdajkpqyddlbawdli
```

**How to get your Supabase Access Token:**
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Name it (e.g., "MCP Server Development")
4. Copy the token and paste it in `.env.local`

**Project Ref:** Already set to `eaofdajkpqyddlbawdli` (from your project URL)

**Security Note:** Only use this with development/test data, never production!

### 2. Vectorize MCP Server

Add these to your `.env.local`:

```bash
# Vectorize MCP Server Configuration
VECTORIZE_ORG_ID=your_vectorize_org_id_here
VECTORIZE_ACCESS_TOKEN=your_vectorize_token_here
VECTORIZE_PIPELINE_ID=your_vectorize_pipeline_id_here
```

**How to get your Vectorize credentials:**
1. Go to https://vectorize.io/dashboard
2. Find your Organization ID in settings
3. Create an API token
4. Get your Pipeline ID from your pipelines list

### 3. Firecrawl MCP Server (Optional)

If you want to use the Firecrawl MCP server, add:

```bash
# Firecrawl MCP Server Configuration
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

## API Routes

### New Route: `/api/chat-with-mcp`

This new route uses all MCP servers and provides:
- Automatic tool discovery from Supabase and Vectorize MCP servers
- Database operations via Supabase MCP tools
- Vector search via Vectorize MCP tools
- Your custom questionnaire submission tool

### Existing Route: `/api/chat-questionnaire`

This route still uses direct integrations (not MCP) for backward compatibility.

### Migration Path

To migrate your existing chat to use MCP servers:

1. Update your frontend to point to the new endpoint:
   ```typescript
   <ChatAssistant api="/api/chat-with-mcp" />
   ```

2. Or update `/api/chat-questionnaire/route.ts` to use the MCP implementation from `/api/chat-with-mcp/route.ts`

## MCP Client Implementations

All MCP clients are located in `/lib/mcp/client/`:

- `firecrawl-client.ts` - Firecrawl MCP client (SSE transport)
- `supabase-client.ts` - Supabase MCP client (SSE transport)
- `vectorize-client.ts` - Vectorize MCP client (stdio transport)

### Usage Example

```typescript
import { getSupabaseMCPClient, getVectorizeMCPClient } from "@/lib/mcp";

// Initialize clients
const supabaseClient = getSupabaseMCPClient();
await supabaseClient.connect();

const vectorizeClient = getVectorizeMCPClient();
await vectorizeClient.connect();

// Get tools
const supabaseTools = await supabaseClient.getTools();
const vectorizeTools = await vectorizeClient.getTools();

// Use with AI SDK
const result = streamText({
  model: openai("gpt-4o"),
  tools: {
    ...supabaseTools,
    ...vectorizeTools,
  },
  // ...
});
```

## Available Tools

### Supabase MCP Tools

Once connected, you'll have access to tools like:
- Execute SQL queries
- Manage tables and schemas
- Search Supabase documentation
- Generate TypeScript types
- And more...

### Vectorize MCP Tools

- `retrieve_documents` - Vector search for relevant documents
- `extract_text` - Extract and chunk text from documents
- `deep_research` - Generate research reports from your pipeline

### Custom Tools

Your custom tools are still available:
- `submitQuestionnaire` - Submit questionnaire responses

## Testing

To test your MCP server setup:

1. Ensure all environment variables are set
2. Start your dev server: `pnpm dev`
3. Make a request to `/api/chat-with-mcp`
4. Check the console for MCP connection logs:
   ```
   🚀 Initializing MCP clients...
   🔗 Supabase MCP client connected successfully
   🔗 Vectorize MCP client connected successfully
   🔧 Agent has access to X Supabase tools and Y Vectorize tools
   ```

## Troubleshooting

### "Failed to connect to MCP server"

- Check that your environment variables are set correctly
- Verify your API tokens are valid
- Check the console for detailed error messages

### "SUPABASE_ACCESS_TOKEN not found"

- Create an access token at https://supabase.com/dashboard/account/tokens
- Add it to `.env.local`
- Restart your dev server

### "VECTORIZE_ORG_ID, VECTORIZE_ACCESS_TOKEN, and VECTORIZE_PIPELINE_ID are required"

- Get your credentials from https://vectorize.io/dashboard
- Add all three variables to `.env.local`
- Restart your dev server

### TypeScript Errors

Run the type checker:
```bash
pnpm tsc --noEmit
```

## Next Steps

1. **Get API Tokens**: Obtain your Supabase access token and Vectorize credentials
2. **Update Environment**: Add the tokens to `.env.local`
3. **Test Connection**: Run the dev server and test the `/api/chat-with-mcp` endpoint
4. **Migrate Frontend**: Update your chat component to use the new endpoint
5. **Monitor Logs**: Check console for tool execution logs

## Resources

- [Supabase MCP Documentation](https://supabase.com/docs/guides/getting-started/mcp)
- [Vectorize MCP Server](https://github.com/vectorize-io/vectorize-mcp-server)
- [AI SDK MCP Integration](https://ai-sdk.dev/cookbook/node/mcp-tools)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
