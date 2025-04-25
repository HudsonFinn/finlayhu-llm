import { useState } from 'react';

interface ChatTab {
  id: string;
  title: string;
}

interface ChatTabsProps {
  tabs: ChatTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onNewTab: () => void;
  onCloseTab: (tabId: string) => void;
}

export function ChatTabs({ tabs, activeTabId, onTabClick, onNewTab, onCloseTab }: ChatTabsProps) {
  return (
    <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-1 overflow-x-auto">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`group flex items-center px-3 py-2 cursor-pointer relative ${
              activeTabId === tab.id
                ? 'bg-white dark:bg-gray-800 rounded-t-lg border-l border-r border-t border-gray-200 dark:border-gray-700'
                : 'bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-t-lg border-l border-r border-t border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => onTabClick(tab.id)}
          >
            <span className="mr-1">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ×
            </button>
            {index === tabs.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNewTab();
                }}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 