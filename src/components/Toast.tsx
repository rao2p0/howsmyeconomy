import React, { useEffect } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Toast as ShadcnToast, ToastDescription, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, visible, onHide }: ToastProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (visible) {
      toast({
        variant: "playful",
        description: (
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="animate-spin text-purple-600" style={{ animationDuration: '2s' }} />
            <span className="font-playful font-bold text-lg">{message}</span>
            <Sparkles size={20} className="animate-pulse text-yellow-500" />
          </div>
        ),
        duration: 3000,
      });
      
      // Call onHide after showing the toast
      const timer = setTimeout(() => {
        onHide();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, message, toast, onHide]);

  return null; // The actual toast is rendered by the ToastProvider
}

// Export the ToastProvider and Toaster for use in App
export { ToastProvider, ToastViewport };