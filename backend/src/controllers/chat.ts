import { Request, Response } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-2';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ChatController {
  private models: Record<ModelType, ChatOpenAI | ChatAnthropic | null> = {
    'gpt-4': new ChatOpenAI({ modelName: 'gpt-4' }),
    'gpt-3.5-turbo': new ChatOpenAI({ modelName: 'gpt-3.5-turbo' }),
    'claude-2': process.env.ANTHROPIC_API_KEY 
      ? new ChatAnthropic({ modelName: 'claude-2' })
      : null,
  };

  getAvailableModels = (req: Request, res: Response) => {
    const availableModels = Object.entries(this.models)
      .filter(([_, model]) => model !== null)
      .map(([name]) => name);
    
    res.json({
      models: availableModels,
    });
  };

  sendMessage = async (req: Request, res: Response) => {
    try {
      const { messages, model } = req.body as { messages: ChatMessage[]; model: ModelType };
      
      if (!messages || !model || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array and model are required' });
      }

      const selectedModel = this.models[model];
      if (!selectedModel) {
        return res.status(400).json({ 
          error: 'This model is not available. Please check if you have provided the necessary API key.' 
        });
      }

      // Convert messages to LangChain message format
      const langchainMessages = messages.map(msg => 
        msg.role === 'user' 
          ? new HumanMessage({ content: msg.content })
          : new AIMessage({ content: msg.content })
      );

      const response = await selectedModel.invoke(langchainMessages);
      
      res.json({ response: response.content });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  };

  getChatHistory = (req: Request, res: Response) => {
    // TODO: Implement chat history storage and retrieval
    res.json({ history: [] });
  };
} 