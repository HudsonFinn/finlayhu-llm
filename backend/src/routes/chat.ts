import express, { RequestHandler } from 'express';
import { ChatController } from '../controllers/chat';

export const chatRouter = express.Router();
const chatController = new ChatController();

// Get available models
chatRouter.get('/models', chatController.getAvailableModels as RequestHandler);

// Send message to LLM
chatRouter.post('/message', chatController.sendMessage as RequestHandler);

// Get chat history
chatRouter.get('/history', chatController.getChatHistory as RequestHandler); 