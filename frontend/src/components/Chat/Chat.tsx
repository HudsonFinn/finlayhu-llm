import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, ModelType } from './types';
import { ModelSelector } from './ModelSelector';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { DarkModeToggle } from './DarkModeToggle';
import { ChatTabs } from './ChatTabs';
import { useChat } from '../../contexts/ChatContext';

export function Chat() {
  const navigate = useNavigate();
  const {
    tabs,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    updateTab,
  } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tabs.find(tab => tab.id === activeTabId)?.messages]);

  const handleCloseTab = (tabId: string) => {
    closeTab(tabId);
    if (tabs.length === 1) {
      // If this was the last tab, navigate to history
      navigate('/history');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const handleModelChange = (model: ModelType) => {
    updateTab(activeTabId, { model });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const activeTab = tabs.find(tab => tab.id === activeTabId);
      if (!activeTab) return;

      const newMessage: ChatMessage = {
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...activeTab.messages, newMessage];
      updateTab(activeTabId, { messages: updatedMessages });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: activeTab.model,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      updateTab(activeTabId, { 
        messages: [...updatedMessages, assistantMessage]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ChatTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onNewTab={addTab}
        onCloseTab={handleCloseTab}
      />
      <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <ModelSelector
          selectedModel={activeTab?.model || 'gpt-3.5-turbo'}
          onModelSelect={handleModelChange}
        />
        <DarkModeToggle />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab && <MessageList messages={activeTab.messages} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 border-t border-gray-200 dark:border-gray-700">
        {error && (
          <div className="text-red-500 dark:text-red-400 mb-2">
            {error}
          </div>
        )}
        <MessageInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 