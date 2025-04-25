import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, ModelType } from '../components/Chat/types';
import { v4 as uuidv4 } from 'uuid';

export interface ChatTab {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: ModelType;
  lastUpdated: string;
}

interface ChatContextType {
  tabs: ChatTab[];
  activeTabId: string;
  setTabs: (tabs: ChatTab[]) => void;
  setActiveTabId: (id: string) => void;
  addTab: () => void;
  closeTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<ChatTab>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<ChatTab[]>(() => {
    // Try to load saved chat from localStorage
    const savedChat = localStorage.getItem('currentChat');
    if (savedChat) {
      const chat = JSON.parse(savedChat);
      return [chat];
    }
    // Default to a new chat if no saved chat exists
    return [{
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      model: 'gpt-3.5-turbo',
      lastUpdated: new Date().toISOString(),
    }];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    // If we have tabs, use the first one's ID
    if (tabs.length > 0) {
      return tabs[0].id;
    }
    // Otherwise create a new tab and use its ID
    const newTab: ChatTab = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      model: 'gpt-3.5-turbo',
      lastUpdated: new Date().toISOString(),
    };
    setTabs([newTab]);
    return newTab.id;
  });

  // Save chat history when tabs change
  useEffect(() => {
    const chatHistory = localStorage.getItem('chatHistory');
    const currentHistory = chatHistory ? JSON.parse(chatHistory) : [];
    
    // Update or add each tab to history
    const updatedHistory = tabs.reduce((history, tab) => {
      const existingIndex = history.findIndex((chat: ChatTab) => chat.id === tab.id);
      if (existingIndex >= 0) {
        history[existingIndex] = tab;
      } else {
        history.push(tab);
      }
      return history;
    }, currentHistory);

    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  }, [tabs]);

  const addTab = () => {
    const newTab: ChatTab = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      model: 'gpt-3.5-turbo',
      lastUpdated: new Date().toISOString(),
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTab = (tabId: string, updates: Partial<ChatTab>) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, ...updates, lastUpdated: new Date().toISOString() }
        : tab
    ));
  };

  return (
    <ChatContext.Provider value={{
      tabs,
      activeTabId,
      setTabs,
      setActiveTabId,
      addTab,
      closeTab,
      updateTab,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 