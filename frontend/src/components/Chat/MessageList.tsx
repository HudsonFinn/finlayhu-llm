import { ChatMessage } from './types';

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={`${message.timestamp}-${index}`}
          className={`p-4 rounded-lg ${
            message.role === 'user'
              ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]'
              : 'bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]'
          }`}
        >
          <div className="font-medium mb-1">
            {message.role === 'user' ? 'You' : 'Assistant'}
          </div>
          <div className="whitespace-pre-wrap">{message.content}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
} 