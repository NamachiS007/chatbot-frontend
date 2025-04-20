import { Outlet, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/ASidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const MainLayout = () => {
  // Store the active chat ID
  const [activeChat, setActiveChat] = useState(1);
  
  // Store chat histories for each chat ID
  const [chatHistories, setChatHistories] = useState({
    1: [{ text: "Hello! I'm Gemini, your AI assistant. How can I help you today?", sender: 'bot' }]
  });
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    
    // Initialize a new chat history if it doesn't exist
    if (!chatHistories[chatId]) {
      setChatHistories(prev => ({
        ...prev,
        [chatId]: [{ text: "Hello! I'm Gemini, your AI assistant. How can I help you today?", sender: 'bot' }]
      }));
    }
    
    // Close sidebar on mobile after selecting a chat
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Add a message to the current active chat
  const addMessage = (message) => {
    setChatHistories(prev => ({
      ...prev,
      [activeChat]: [...prev[activeChat], message]
    }));
  };

  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile by default */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-30 transition-transform duration-300 transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Sidebar 
          onChatSelect={handleChatSelect} 
          activeChat={activeChat} 
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar with mobile menu toggle */}
        <Navbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen}
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ 
            chatId: activeChat,
            messages: chatHistories[activeChat] || [],
            addMessage
          }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;