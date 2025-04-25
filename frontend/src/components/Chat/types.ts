export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-2'; 