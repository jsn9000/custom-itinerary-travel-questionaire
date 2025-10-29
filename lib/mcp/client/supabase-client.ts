/**
 * Supabase MCP Client using HTTP Transport
 * Documentation: https://supabase.com/docs/guides/getting-started/mcp
 * AI SDK MCP Integration: https://ai-sdk.dev/cookbook/node/mcp-tools
 */

import { experimental_createMCPClient } from "ai";
import type { MCPClientConfig } from "./types";

export class SupabaseMCPClient {
  private client: Awaited<
    ReturnType<typeof experimental_createMCPClient>
  > | null = null;
  private accessToken: string;
  private projectRef?: string;
  private serverUrl: string;
  private isConnected: boolean = false;

  constructor(config: MCPClientConfig & { projectRef?: string }) {
    this.accessToken = config.apiKey;
    this.projectRef = config.projectRef;

    // Build URL with query parameters
    const baseUrl = config.serverUrl || "https://mcp.supabase.com/mcp";
    const params = new URLSearchParams();

    if (this.projectRef) {
      params.append("project_ref", this.projectRef);
    }

    // Enable read-only mode for safety
    params.append("read_only", "true");

    this.serverUrl = params.toString()
      ? `${baseUrl}?${params.toString()}`
      : baseUrl;
  }

  /**
   * Initialize the MCP client connection
   */
  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      console.log("🔗 Supabase MCP client already connected");
      return;
    }

    try {
      console.log("🚀 Connecting to Supabase MCP server via HTTP...");
      console.log(`   URL: ${this.serverUrl}`);

      // Use SSE transport with custom headers for authentication
      // Note: Supabase MCP server uses SSE, not HTTP
      this.client = await experimental_createMCPClient({
        transport: {
          type: "sse",
          url: this.serverUrl,
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      });

      this.isConnected = true;
      console.log("✅ Supabase MCP client connected successfully");
    } catch (error) {
      console.error("💥 Failed to connect to Supabase MCP server:", error);
      throw new Error(
        `Failed to connect to Supabase MCP server: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Disconnect the MCP client
   */
  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.close();
      this.client = null;
      this.isConnected = false;
      console.log("🔌 Supabase MCP client disconnected");
    } catch (error) {
      console.error("⚠️ Error during MCP client disconnect:", error);
    }
  }

  /**
   * Get all available Supabase tools
   * Returns tools that can be used with AI SDK's generateText/streamText
   */
  async getTools(): Promise<Record<string, any>> {
    if (!this.isConnected || !this.client) {
      await this.connect();
    }

    if (!this.client) {
      throw new Error("MCP client not initialized");
    }

    try {
      console.log("🔧 Retrieving Supabase MCP tools...");
      const tools = await this.client.tools();
      console.log(`✅ Retrieved ${Object.keys(tools).length} Supabase tools`);
      return tools;
    } catch (error) {
      console.error("💥 Failed to retrieve Supabase tools:", error);
      throw new Error(
        `Failed to retrieve Supabase tools: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get the connection status
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get the underlying MCP client instance
   */
  getClient() {
    return this.client;
  }
}

/**
 * Singleton instance for Supabase MCP client
 */
let supabaseClientInstance: SupabaseMCPClient | null = null;

/**
 * Get or create a Supabase MCP client instance
 */
export function getSupabaseMCPClient(
  accessToken?: string,
  projectRef?: string
): SupabaseMCPClient {
  if (!supabaseClientInstance) {
    const token = accessToken || process.env.SUPABASE_ACCESS_TOKEN;
    const ref = projectRef || process.env.SUPABASE_PROJECT_REF;

    if (!token) {
      throw new Error(
        "SUPABASE_ACCESS_TOKEN not found. Please set it in .env.local or pass it to getSupabaseMCPClient()"
      );
    }

    supabaseClientInstance = new SupabaseMCPClient({
      apiKey: token,
      projectRef: ref,
    });
  }

  return supabaseClientInstance;
}

/**
 * Reset the singleton instance (useful for testing or reconfiguration)
 */
export function resetSupabaseMCPClient(): void {
  if (supabaseClientInstance) {
    supabaseClientInstance.disconnect().catch(console.error);
    supabaseClientInstance = null;
  }
}
