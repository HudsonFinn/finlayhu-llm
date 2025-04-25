import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, ModelType } from './types';
import { useChat } from '../../contexts/ChatContext';
import { ChatTab } from '../../contexts/ChatContext';

interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: ModelType;
  lastUpdated: string;
}

export function ChatHistory() {
  const [chats, setChats] = useState<SavedChat[]>([]);
  const navigate = useNavigate();
  const { tabs, setActiveTabId, addTab, updateTab, setTabs } = useChat();

  useEffect(() => {
    // Load saved chats from localStorage
    const savedChats = localStorage.getItem('chatHistory');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation(); // Prevent triggering the chat click
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
  };

  const handleChatClick = (chat: SavedChat) => {
    // Check if the chat is already open in a tab
    const existingTab = tabs.find(tab => tab.id === chat.id);
    
    if (existingTab) {
      // If the chat is already open, switch to that tab
      setActiveTabId(chat.id);
    } else {
      // If the chat is not open, create a new tab with the chat data
      const newTab: ChatTab = {
        id: chat.id,
        title: chat.title,
        messages: chat.messages,
        model: chat.model,
        lastUpdated: chat.lastUpdated,
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(chat.id);
    }
    
    // Navigate to the chat page
    navigate('/chat');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getPreviewText = (messages: ChatMessage[]) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return 'No messages';
    return lastMessage.content.substring(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none p-2">
        <h1 className="text-xl font-bold">Chat History</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className="group p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
            >
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title="Delete chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-semibold text-sm">{chat.title}</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(chat.lastUpdated)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                {getPreviewText(chat.messages)}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-1">{chat.messages.length} messages</span>
                <span>•</span>
                <span className="ml-1">{chat.model}</span>
              </div>
            </div>
          ))}
          {chats.length === 0 && (
            <div className="col-span-full text-center py-2 text-gray-500 dark:text-gray-400">
              No chat history yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 