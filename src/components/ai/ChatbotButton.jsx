import React from 'react';
import { Bot } from 'lucide-react';

export default function ChatbotButton({ onClick, open }) {
  return (
    <button
      className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-white shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/25 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-400/30 sm:bottom-6 sm:right-6" 
      title="AI Assistant" 
      aria-label={open ? 'Fermer AI Assistant' : 'Ouvrir AI Assistant'} 
      aria-expanded={open}
      onClick={onClick}
    >
      <Bot size={25} />
    </button>
  );
}