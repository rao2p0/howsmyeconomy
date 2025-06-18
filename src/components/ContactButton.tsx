import React, { useState } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { ContactModal } from './ContactModal';
import { Button } from './ui/button';

interface ContactButtonProps {
  variant?: 'header' | 'footer' | 'floating';
  defaultTab?: 'contact' | 'subscribe';
  className?: string;
}

export function ContactButton({ variant = 'header', defaultTab = 'contact', className = '' }: ContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonContent = () => {
    switch (variant) {
      case 'header':
        return (
          <Button
            variant="ghost"
            onClick={() => setIsModalOpen(true)}
            className={`text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 transition-colors ${className}`}
          >
            <MessageCircle size={16} className="mr-2" />
            Contact
          </Button>
        );
      
      case 'footer':
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`text-blue-300 hover:text-blue-200 underline underline-offset-2 transition-colors duration-200 text-sm ${className}`}
          >
            💬 Contact & Subscribe
          </button>
        );
      
      case 'floating':
        return (
          <button
            onClick={() => setIsModalOpen(true)}
            className={`fixed bottom-6 left-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group ${className}`}
            title="Contact & Subscribe"
          >
            <div className="relative">
              <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
              <Bell size={12} className="absolute -top-1 -right-1 bg-purple-400 rounded-full p-0.5" />
            </div>
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {getButtonContent()}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTab={defaultTab}
      />
    </>
  );
} 