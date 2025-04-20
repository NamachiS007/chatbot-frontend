import React, { useState } from 'react';
import { Menu, X, Bot } from 'lucide-react';

export default function Navbar({ onMenuToggle, isSidebarOpen }) {
  return (
    <div className="w-full p-3 bg-gradient-to-r from-slate-800 to-slate-700 shadow-md relative z-10 backdrop-blur-sm border-b border-indigo-900/30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle button */}
          <button 
            className="md:hidden p-2 text-indigo-300 hover:text-indigo-100 focus:outline-none transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar menu"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          
          <div className="bg-indigo-600/30 p-2 rounded-lg transition-all duration-200 hover:bg-indigo-600/40 hover:scale-105">
            <Bot className="h-5 w-5 text-indigo-300" />
          </div>
          <div className="hidden md:block text-indigo-300 font-medium text-sm">
            AI Assistant
          </div>
        </div>
        
        {/* Right side of navbar */}
        <div className="flex items-center space-x-1">
          <div className="flex flex-col">
            <h1 className="font-bold text-white text-sm sm:text-base md:text-lg">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">AMS Company</span>
              <span className="text-indigo-200"> | Chatbot</span>
            </h1> 
          </div>
        </div>
      </div>
    </div>
  );
}