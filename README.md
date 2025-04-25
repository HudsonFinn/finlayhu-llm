# Chat Application

A modern chat application with a React frontend and Node.js backend, featuring tabbed chat interface, chat history, and support for multiple AI models.

## Features

- Tabbed chat interface similar to Chrome
- Chat history with ability to resume previous conversations
- Support for multiple AI models (GPT-3.5, GPT-4, Claude-2)
- Dark mode support
- Responsive design
- Real-time message updates

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- AI Integration: OpenAI API

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.template .env
   ```

4. Update the `.env` file with your OpenAI API key and other configurations.

5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.template .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- The application will open in your default browser at `http://localhost:5173`
- Create new chats using the "+" button in the tab bar
- Switch between chats by clicking on different tabs
- View chat history by clicking the "History" link in the navigation bar
- Delete chats from history using the delete button that appears on hover
- Toggle dark mode using the sun/moon icon in the top right

## Current State

The application is in a working state with all core features implemented:
- Tab management
- Chat history
- Message sending and receiving
- Model selection
- Dark mode
- Responsive design

## Future Improvements

- Add user authentication
- Implement real-time updates
- Add file upload support
- Improve error handling and user feedback
- Add more AI model options
- Implement chat search functionality 