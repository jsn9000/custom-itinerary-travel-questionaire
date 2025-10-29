import { createServerClient } from '@/lib/supabase';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata?: Record<string, any>;
}

export interface UserMemory {
  id?: string;
  user_id: string;
  session_id?: string;
  memory_key: string;
  memory_value: string;
  memory_type: 'preference' | 'fact' | 'context' | 'goal';
  relevance_score?: number;
  metadata?: Record<string, any>;
}

export interface QuestionnaireResponse {
  session_id: string;
  user_id?: string;
  responses: Record<string, any>;
  status?: 'in_progress' | 'completed' | 'abandoned';
}

export class MemoryService {
  private supabase;

  constructor() {
    this.supabase = createServerClient();
  }

  // ========== Conversation Management ==========

  async createConversation(sessionId: string, userId?: string, metadata?: Record<string, any>) {
    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        session_id: sessionId,
        user_id: userId,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }

    return data;
  }

  async getConversation(sessionId: string) {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching conversation:', error);
      throw error;
    }

    return data;
  }

  // ========== Message Management ==========

  async saveMessage(conversationId: string, message: Message) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        metadata: message.metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }

    return data;
  }

  async getConversationHistory(conversationId: string, limit: number = 50) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }

    return data || [];
  }

  async getRecentMessages(conversationId: string, count: number = 10) {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }

    return (data || []).reverse(); // Return in chronological order
  }

  // ========== User Memory Management ==========

  async saveUserMemory(memory: UserMemory) {
    const { data, error } = await this.supabase
      .from('user_memory')
      .upsert({
        user_id: memory.user_id,
        session_id: memory.session_id,
        memory_key: memory.memory_key,
        memory_value: memory.memory_value,
        memory_type: memory.memory_type,
        relevance_score: memory.relevance_score || 1.0,
        metadata: memory.metadata || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving user memory:', error);
      throw error;
    }

    return data;
  }

  async getUserMemories(userId: string, sessionId?: string, memoryType?: string) {
    let query = this.supabase
      .from('user_memory')
      .select('*')
      .eq('user_id', userId);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    if (memoryType) {
      query = query.eq('memory_type', memoryType);
    }

    const { data, error } = await query.order('relevance_score', { ascending: false });

    if (error) {
      console.error('Error fetching user memories:', error);
      throw error;
    }

    return data || [];
  }

  async formatMemoriesForContext(memories: any[]): Promise<string> {
    if (!memories.length) {
      return '';
    }

    const grouped = memories.reduce((acc, memory) => {
      if (!acc[memory.memory_type]) {
        acc[memory.memory_type] = [];
      }
      acc[memory.memory_type].push(memory);
      return acc;
    }, {} as Record<string, any[]>);

    let context = '\n## User Context & Memory:\n';

    if (grouped.preference) {
      context += '\n### Preferences:\n';
      grouped.preference.forEach((m: any) => {
        context += `- ${m.memory_key}: ${m.memory_value}\n`;
      });
    }

    if (grouped.fact) {
      context += '\n### Facts:\n';
      grouped.fact.forEach((m: any) => {
        context += `- ${m.memory_key}: ${m.memory_value}\n`;
      });
    }

    if (grouped.goal) {
      context += '\n### Goals:\n';
      grouped.goal.forEach((m: any) => {
        context += `- ${m.memory_key}: ${m.memory_value}\n`;
      });
    }

    if (grouped.context) {
      context += '\n### Context:\n';
      grouped.context.forEach((m: any) => {
        context += `- ${m.memory_key}: ${m.memory_value}\n`;
      });
    }

    return context;
  }

  // ========== Questionnaire Response Management ==========

  async saveQuestionnaireResponse(response: QuestionnaireResponse) {
    const { data, error } = await this.supabase
      .from('questionnaire_responses')
      .upsert({
        session_id: response.session_id,
        user_id: response.user_id,
        responses: response.responses,
        status: response.status || 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving questionnaire response:', error);
      throw error;
    }

    return data;
  }

  async getQuestionnaireResponse(sessionId: string) {
    const { data, error } = await this.supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching questionnaire response:', error);
      throw error;
    }

    return data;
  }

  async updateQuestionnaireStatus(sessionId: string, status: 'in_progress' | 'completed' | 'abandoned') {
    const { data, error } = await this.supabase
      .from('questionnaire_responses')
      .update({ status })
      .eq('session_id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating questionnaire status:', error);
      throw error;
    }

    return data;
  }

  // ========== Context Building ==========

  async buildContextForSession(sessionId: string, userId?: string) {
    let context = '';

    // Get conversation history
    const conversation = await this.getConversation(sessionId);
    if (conversation) {
      const recentMessages = await this.getRecentMessages(conversation.id, 10);
      if (recentMessages.length > 0) {
        context += '\n## Recent Conversation:\n';
        recentMessages.forEach(msg => {
          context += `${msg.role}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n`;
        });
      }
    }

    // Get user memories if userId provided
    if (userId) {
      const memories = await this.getUserMemories(userId, sessionId);
      const memoryContext = await this.formatMemoriesForContext(memories);
      context += memoryContext;
    }

    // Get questionnaire responses
    const questionnaireResponse = await this.getQuestionnaireResponse(sessionId);
    if (questionnaireResponse && Object.keys(questionnaireResponse.responses).length > 0) {
      context += '\n## Questionnaire Responses:\n';
      Object.entries(questionnaireResponse.responses).forEach(([key, value]) => {
        context += `- ${key}: ${JSON.stringify(value)}\n`;
      });
    }

    return context;
  }
}
