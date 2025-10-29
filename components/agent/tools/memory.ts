import { tool } from 'ai';
import { z } from 'zod';
import { MemoryService } from '@/lib/memory/memory-service';

/**
 * Tool for retrieving user memory and context
 */
export const retrieveMemory = tool({
  description: 'Retrieve user memory, preferences, and context from previous conversations. Use this to personalize responses and remember user information.',
  inputSchema: z.object({
    userId: z.string().optional().describe('The user ID to retrieve memories for'),
    sessionId: z.string().describe('The session ID to retrieve context for'),
    memoryType: z.enum(['preference', 'fact', 'context', 'goal']).optional().describe('Filter by specific memory type')
  }),
  execute: async ({ userId, sessionId, memoryType }) => {
    console.log(`🧠 Retrieving memory for session: ${sessionId}, user: ${userId || 'unknown'}, type: ${memoryType || 'all'}`);

    try {
      const memoryService = new MemoryService();

      // Build comprehensive context
      const context = await memoryService.buildContextForSession(sessionId, userId);

      // Get specific memories if userId provided
      let memories = [];
      if (userId) {
        memories = await memoryService.getUserMemories(userId, sessionId, memoryType);
      }

      console.log(`✅ Retrieved ${memories.length} memories`);

      return {
        context,
        memories,
        summary: `Found ${memories.length} relevant memories and context for this session.`
      };
    } catch (error) {
      console.error(`💥 Memory retrieval error:`, error);
      return {
        context: '',
        memories: [],
        summary: 'Unable to retrieve memory at this time.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});

/**
 * Tool for saving user memory and facts
 */
export const saveMemory = tool({
  description: 'Save important user information, preferences, facts, or goals to memory for future reference. Use this when the user shares personal information.',
  inputSchema: z.object({
    userId: z.string().describe('The user ID to save memory for'),
    sessionId: z.string().optional().describe('The session ID (optional)'),
    memoryKey: z.string().describe('A short key/label for this memory (e.g., "favorite_destination", "travel_style")'),
    memoryValue: z.string().describe('The actual memory content or value'),
    memoryType: z.enum(['preference', 'fact', 'context', 'goal']).describe('The type of memory being saved'),
    relevanceScore: z.number().min(0).max(1).optional().describe('Relevance score (0-1), default 1.0')
  }),
  execute: async ({ userId, sessionId, memoryKey, memoryValue, memoryType, relevanceScore }) => {
    console.log(`💾 Saving memory: ${memoryKey} = ${memoryValue} (type: ${memoryType})`);

    try {
      const memoryService = new MemoryService();

      const savedMemory = await memoryService.saveUserMemory({
        user_id: userId,
        session_id: sessionId,
        memory_key: memoryKey,
        memory_value: memoryValue,
        memory_type: memoryType,
        relevance_score: relevanceScore
      });

      console.log(`✅ Memory saved successfully`);

      return {
        success: true,
        memory: savedMemory,
        summary: `Saved ${memoryType}: ${memoryKey}`
      };
    } catch (error) {
      console.error(`💥 Memory save error:`, error);
      return {
        success: false,
        summary: 'Unable to save memory at this time.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});

/**
 * Tool for saving conversation messages
 */
export const saveConversationMessage = tool({
  description: 'Save a message to the conversation history in the database.',
  inputSchema: z.object({
    sessionId: z.string().describe('The session ID for this conversation'),
    role: z.enum(['user', 'assistant', 'system', 'tool']).describe('The role of the message sender'),
    content: z.string().describe('The message content'),
    metadata: z.record(z.string(), z.any()).optional().describe('Optional metadata about the message')
  }),
  execute: async ({ sessionId, role, content, metadata }) => {
    console.log(`💬 Saving ${role} message for session: ${sessionId}`);

    try {
      const memoryService = new MemoryService();

      // Get or create conversation
      let conversation = await memoryService.getConversation(sessionId);
      if (!conversation) {
        conversation = await memoryService.createConversation(sessionId);
      }

      // Save message
      const savedMessage = await memoryService.saveMessage(conversation.id, {
        role,
        content,
        metadata
      });

      console.log(`✅ Message saved successfully`);

      return {
        success: true,
        messageId: savedMessage.id,
        summary: `Saved ${role} message to conversation history`
      };
    } catch (error) {
      console.error(`💥 Message save error:`, error);
      return {
        success: false,
        summary: 'Unable to save message at this time.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
