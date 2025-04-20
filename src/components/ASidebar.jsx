'use client';

import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPlus, FaComment, FaEllipsisV, FaShare, FaEdit, FaTrash, FaLink, FaCheck, FaCopy, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from './Modal'; // Import the Modal component

export default function ASidebar({ onChatSelect, activeChat, onCloseMobile }) {
  const navigate = useNavigate();
  const [chatTabs, setChatTabs] = useState([
    { id: 1, label: 'Chat 1' }
  ]);
  const [nextId, setNextId] = useState(2);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [hoveredChat, setHoveredChat] = useState(null);
  const dropdownRef = useRef(null);
  
  // State for modals
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatName, setNewChatName] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNewChat = () => {
    const newChatId = nextId;
    const newChat = { id: newChatId, label: `Chat ${newChatId}` };
    setChatTabs(prev => [...prev, newChat]);
    setNextId(prev => prev + 1);
    onChatSelect(newChatId);
    setDropdownOpen(null);
  };

  const openRenameModal = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering chat selection
    const chat = chatTabs.find(chat => chat.id === chatId);
    setSelectedChat(chatId);
    setNewChatName(chat.label);
    setRenameModalOpen(true);
    setDropdownOpen(null);
  };

  const handleRenameChat = () => {
    if (!newChatName.trim()) return;
    
    setChatTabs(prev => 
      prev.map(chat => 
        chat.id === selectedChat ? { ...chat, label: newChatName } : chat
      )
    );
    setRenameModalOpen(false);
  };

  const openDeleteModal = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering chat selection
    setSelectedChat(chatId);
    setDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteChat = () => {
    setChatTabs(prev => prev.filter(chat => chat.id !== selectedChat));
    if (activeChat === selectedChat && chatTabs.length > 1) {
      const remainingChats = chatTabs.filter(chat => chat.id !== selectedChat);
      onChatSelect(remainingChats[0].id);
    }
    setDeleteModalOpen(false);
  };

  const openShareModal = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering chat selection
    setSelectedChat(chatId);
    
    // Generate a unique shareable link
    const host = window.location.origin;
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    setShareLink(`${host}/shared-chat/${chatId}/${uniqueId}`);
    
    setShareModalOpen(true);
    setDropdownOpen(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleDropdown = (chatId, e) => {
    e.stopPropagation(); // Prevent triggering chat selection
    setDropdownOpen(dropdownOpen === chatId ? null : chatId);
  };

  return (
    <>
      <motion.div 
        className="flex flex-col h-screen w-64 text-gray-100 overflow-y-auto px-3 py-4" 
        style={{background: "linear-gradient(to bottom, #1a1c2e, #2d3047)"}}
      >
        {/* Mobile close button - visible only on mobile */}
        <div className="md:hidden flex justify-end mb-2">
          <motion.button 
            onClick={onCloseMobile}
            className="p-2 text-indigo-300 hover:text-indigo-100"
            aria-label="Close sidebar"
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="h-5 w-5" />
          </motion.button>
        </div>
        
        {/* Header */}
        <motion.div 
          className="flex justify-center items-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-xl p-3 w-full bg-indigo-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src="/My Current Photo.jpg" 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                  }}
                />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-indigo-100">
                  Gemini Chatbot
                </h5>
                <p className="text-xs text-indigo-300">
                  Powered by AI
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Chat Button */}
        <motion.button 
          onClick={handleNewChat}
          className="flex items-center px-2 py-2.5 rounded-lg text-sm bg-indigo-600/70 backdrop-blur-sm font-semibold hover:bg-indigo-500/80 transition-all duration-200 mb-4 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-8 flex justify-center">
            <FaPlus className="h-4 w-4" />
          </div>
          <span className="ml-3">New Chat</span>
        </motion.button>

        {/* Chat Tabs */}
        <div className="mb-4">
          <motion.div 
            className="flex justify-between items-center mb-2 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-indigo-200 font-medium">Your Chats</p>
          </motion.div>
          <nav className="flex flex-col gap-1.5">
            <AnimatePresence>
              {chatTabs.map((chat, index) => (
                <motion.div 
                  key={chat.id} 
                  className="relative group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.1 * (index + 1), type: "spring" }}
                  layout
                >
                  {/* Using a div instead of button to contain both the chat item and menu button */}
                  <motion.div 
                    className={`flex items-center justify-between px-2 py-2.5 rounded-lg text-sm font-medium w-full transition-all duration-200 cursor-pointer
                      ${activeChat === chat.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                        : hoveredChat === chat.id
                          ? 'bg-indigo-800/50 text-indigo-100'
                          : 'bg-indigo-900/30 text-indigo-200 hover:bg-indigo-800/40'
                      }`}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    whileHover={activeChat !== chat.id ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Chat label - clickable area */}
                    <div 
                      className="flex items-center flex-1"
                      onClick={() => {
                        onChatSelect(chat.id);
                        setDropdownOpen(null);
                      }}
                    >
                      <div className="w-8 flex justify-center">
                        <FaComment className={`h-4 w-4 ${activeChat === chat.id ? 'text-indigo-100' : 'text-indigo-300'}`} />
                      </div>
                      <span className="ml-3 truncate">{chat.label}</span>
                    </div>
                    
                    {/* Dropdown menu button - separate clickable element */}
                    <motion.div 
                      onClick={(e) => toggleDropdown(chat.id, e)}
                      className={`p-1.5 rounded-full cursor-pointer
                        ${hoveredChat === chat.id || dropdownOpen === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                         transition-opacity duration-200`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaEllipsisV className="h-3 w-3" />
                    </motion.div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {dropdownOpen === chat.id && (
                      <motion.div 
                        ref={dropdownRef}
                        className="absolute right-0 mt-1 w-40 bg-[#212121]/20 backdrop-blur-sm rounded-md shadow-lg z-10 border border-indigo-800"
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      >
                        <div className="py-1">
                          <motion.div 
                            onClick={(e) => openShareModal(chat.id, e)}
                            className="flex items-center px-4 py-2 text-sm text-indigo-100 w-full text-left cursor-pointer"
                            whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.3)" }}
                          >
                            <FaShare className="h-3 w-3 mr-2" />
                            Share
                          </motion.div>
                          <motion.div 
                            onClick={(e) => openRenameModal(chat.id, e)}
                            className="flex items-center px-4 py-2 text-sm text-indigo-100 w-full text-left cursor-pointer"
                            whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.3)" }}
                          >
                            <FaEdit className="h-3 w-3 mr-2" />
                            Rename
                          </motion.div>
                          <motion.div 
                            onClick={(e) => openDeleteModal(chat.id, e)}
                            className="flex items-center px-4 py-2 text-sm text-red-300 w-full text-left cursor-pointer"
                            whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.3)" }}
                          >
                            <FaTrash className="h-3 w-3 mr-2" />
                            Delete
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
        </div>
      </motion.div>

      {/* Modals with portal - these will be rendered at the body level */}
      <Modal 
        isOpen={renameModalOpen} 
        onClose={() => setRenameModalOpen(false)}
        title="Rename Chat"
      >
        <div className="mt-2">
          <input
            type="text"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter new name"
            autoFocus
          />
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <motion.button
            onClick={() => setRenameModalOpen(false)}
            className="px-4 py-2 rounded-lg text-indigo-300 hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleRenameChat}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Rename
          </motion.button>
        </div>
      </Modal>

      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Chat"
      >
        <div className="mt-2">
          <p className="text-indigo-100">
            Are you sure you want to delete this chat? This action cannot be undone.
          </p>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <motion.button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg text-indigo-300 hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleDeleteChat}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        </div>
      </Modal>

      <Modal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)}
        title="Share Chat"
      >
        <div className="mt-2">
          <p className="text-indigo-100 mb-2">
            Share this link with others to give them access to this chat:
          </p>
          <div className="flex items-center mt-3">
            <div className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-3 py-2 text-indigo-100 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">
              {shareLink}
            </div>
            <motion.button
              onClick={copyToClipboard}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg px-3 py-2 min-w-[40px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? <FaCheck className="h-4 w-4" /> : <FaCopy className="h-4 w-4" />}
            </motion.button>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <motion.button
            onClick={() => setShareModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Done
          </motion.button>
        </div>
      </Modal>
    </>
  );
}