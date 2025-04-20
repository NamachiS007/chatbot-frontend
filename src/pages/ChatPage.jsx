import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function ChatPage() {
  const { chatId, messages, addMessage } = useOutletContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false); // Track if welcome message was sent
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send welcome message on first load if no messages exist
  useEffect(() => {
    if (messages.length === 0 && !hasWelcomed) {
      const welcomeMessage = { 
        text: "Hello! I'm Gemini, your AI assistant. How can I help you today?", 
        sender: 'bot' 
      };
      addMessage(welcomeMessage);
      setHasWelcomed(true);
    }
  }, [messages, hasWelcomed, addMessage]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = { text: input, sender: 'user' };
    addMessage(userMessage);
    
    try {
      // Use absolute URL to Flask backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input,
          chatId: chatId
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addMessage({ text: data.response, sender: 'bot' });
      } else {
        addMessage({ text: `Error: ${data.error || response.statusText}`, sender: 'bot' });
      }
    } catch (error) {
      console.error('Connection error:', error);
      addMessage({ text: `Error connecting to chatbot: ${error.message}`, sender: 'bot' });
    } finally {
      setIsLoading(false);
      setInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full" 
      style={{ backgroundColor: "#171929" }}
    >
      <motion.div 
        className="text-xl font-bold mb-4 text-indigo-200 p-4"
      >
        Chat {chatId}
      </motion.div>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 sm:px-4">
        {messages.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-full"
          >
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation by typing a message below</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'bg-gray-800/50 backdrop-blur-sm text-gray-200 border border-gray-700'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-indigo-300" {...props} />,
                          em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                          code: ({node, ...props}) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-3 italic my-2" {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <motion.div 
        className="px-2 sm:px-4 pb-4"
      >
        <div className="flex space-x-2 p-2 sm:p-3">
          <motion.input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <motion.button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center min-w-[60px] sm:min-w-[80px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="hidden sm:inline">Sending...</span>
              </span>
            ) : (
              <span className="flex items-center">
                <span className="hidden sm:inline">Send</span>
                <FaPaperPlane className="ml-0 sm:ml-2 h-4 w-4" />
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}