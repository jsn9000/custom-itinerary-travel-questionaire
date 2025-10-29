/**
 * Vectorize MCP Client using Stdio Transport
 * Documentation: https://github.com/vectorize-io/vectorize-mcp-server
 * AI SDK MCP Integration: https://ai-sdk.dev/cookbook/node/mcp-tools
 */

import { experimental_createMCPClient } from "ai";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { MCPClientConfig } from "./types";

export class VectorizeMCPClient {
  private client: Awaited<
    ReturnType<typeof experimental_createMCPClient>
  > | null = null;
  private orgId: string;
  private token: string;
  private pipelineId: string;
  private isConnected: boolean = false;

  constructor(config: MCPClientConfig & { orgId: string; pipelineId: string }) {
    this.orgId = config.orgId;
    this.token = config.apiKey;
    this.pipelineId = config.pipelineId;
  }

  /**
   * Initialize the MCP client connection
   */
  async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      console.log("🔗 Vectorize MCP client already connected");
      return;
    }

    try {
      console.log("🚀 Connecting to Vectorize MCP server via stdio...");

      const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@vectorize-io/vectorize-mcp-server@latest"],
        env: {
          ...process.env,
          VECTORIZE_ORG_ID: this.orgId,
          VECTORIZE_TOKEN: this.token,
          VECTORIZE_PIPELINE_ID: this.pipelineId,
        },
      });

      this.client = await experimental_createMCPClient({
        transport,
      });

      this.isConnected = true;
      console.log("✅ Vectorize MCP client connected successfully");
    } catch (error) {
      console.error("💥 Failed to connect to Vectorize MCP server:", error);
      throw new Error(
        `Failed to connect to Vectorize MCP server: ${
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
      console.log("🔌 Vectorize MCP client disconnected");
    } catch (error) {
      console.error("⚠️ Error during MCP client disconnect:", error);
    }
  }

  /**
   * Get all available Vectorize tools
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
      console.log("🔧 Retrieving Vectorize MCP tools...");
      const tools = await this.client.tools();
      console.log(`✅ Retrieved ${Object.keys(tools).length} Vectorize tools`);
      return tools;
    } catch (error) {
      console.error("💥 Failed to retrieve Vectorize tools:", error);
      throw new Error(
        `Failed to retrieve Vectorize tools: ${
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
 * Singleton instance for Vectorize MCP client
 */
let vectorizeClientInstance: VectorizeMCPClient | null = null;

/**
 * Get or create a Vectorize MCP client instance
 */
export function getVectorizeMCPClient(
  orgId?: string,
  token?: string,
  pipelineId?: string
): VectorizeMCPClient {
  if (!vectorizeClientInstance) {
    const org = orgId || process.env.VECTORIZE_ORG_ID;
    const tok = token || process.env.VECTORIZE_ACCESS_TOKEN;
    const pipeline = pipelineId || process.env.VECTORIZE_PIPELINE_ID;

    if (!org || !tok || !pipeline) {
      throw new Error(
        "VECTORIZE_ORG_ID, VECTORIZE_ACCESS_TOKEN, and VECTORIZE_PIPELINE_ID are required. Please set them in .env.local or pass them to getVectorizeMCPClient()"
      );
    }

    vectorizeClientInstance = new VectorizeMCPClient({
      orgId: org,
      apiKey: tok,
      pipelineId: pipeline,
    });
  }

  return vectorizeClientInstance;
}

/**
 * Reset the singleton instance (useful for testing or reconfiguration)
 */
export function resetVectorizeMCPClient(): void {
  if (vectorizeClientInstance) {
    vectorizeClientInstance.disconnect().catch(console.error);
    vectorizeClientInstance = null;
  }
}
