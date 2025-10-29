/**
 * MCP (Model Context Protocol) Integration
 * Public exports for MCP client functionality
 */

// Firecrawl MCP Client
export {
  FirecrawlMCPClient,
  getFirecrawlMCPClient,
  resetFirecrawlMCPClient,
} from "./client/firecrawl-client";

// Supabase MCP Client
export {
  SupabaseMCPClient,
  getSupabaseMCPClient,
  resetSupabaseMCPClient,
} from "./client/supabase-client";

// Vectorize MCP Client
export {
  VectorizeMCPClient,
  getVectorizeMCPClient,
  resetVectorizeMCPClient,
} from "./client/vectorize-client";

export type {
  FirecrawlScrapeParams,
  FirecrawlBatchScrapeParams,
  FirecrawlSearchParams,
  FirecrawlCrawlParams,
  FirecrawlExtractParams,
  FirecrawlDeepResearchParams,
  FirecrawlGenerateLlmsTxtParams,
  FirecrawlScrapeResult,
  FirecrawlSearchResult,
  FirecrawlCrawlResult,
  FirecrawlExtractResult,
  FirecrawlDeepResearchResult,
  FirecrawlGenerateLlmsTxtResult,
  MCPClientConfig,
} from "./client/types";
