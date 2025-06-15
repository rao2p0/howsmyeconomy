import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-bounce-in">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border-3 border-white/30 backdrop-blur-sm">
        <CheckCircle size={24} className="animate-spin" style={{ animationDuration: '2s' }} />
        <span className="font-playful font-bold text-lg">{message}</span>
        <Sparkles size={20} className="animate-pulse text-yellow-300" />
      </div>
    </div>
  );
}