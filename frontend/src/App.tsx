import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Chat } from './components/Chat/Chat';
import { ChatHistory } from './components/Chat/ChatHistory';
import { DarkModeToggle } from './components/Chat/DarkModeToggle';
import { ChatProvider } from './contexts/ChatContext';
import './App.css';

function App() {
  return (
    <Router>
      <ChatProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <nav className="border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link
                    to="/chat"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Chat
                  </Link>
                  <Link
                    to="/history"
                    className="ml-8 inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    History
                  </Link>
                </div>
                <div className="flex items-center">
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route path="/history" element={<ChatHistory />} />
            <Route path="/" element={<Chat />} />
          </Routes>
        </div>
      </ChatProvider>
    </Router>
  );
}

export default App;
