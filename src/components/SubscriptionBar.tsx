import React, { useState } from 'react';
import { Bell, Send, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { tallyService } from '../services/tallyService';

export function SubscriptionBar() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // Open Tally form with prefilled data
    tallyService.openSubscriptionForm({
      email: email.trim(),
      source: 'Footer Subscription Bar',
      frequency: 'weekly'
    });

    // Show success message and reset form
    toast({
      title: "Opening subscription form! 📝",
      description: "Complete the form to receive economic updates.",
    });
    
    // Reset form
    setEmail('');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center text-white mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="text-yellow-300" size={24} />
            <h3 className="text-2xl font-playful font-bold">
              Stay Updated on the Economy!
            </h3>
            <Mail className="text-yellow-300" size={24} />
          </div>
          <p className="text-blue-100 font-medium">
            Get insights when economic indicators change
          </p>
        </div>
        
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-12 px-4 rounded-lg border-2 border-white/30 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 focus:outline-none transition-all duration-200"
              />
            </div>
            <Button
              type="submit"
              disabled={!email.trim()}
              className="h-12 px-6 bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-2">
                <Send size={18} />
                Subscribe
              </div>
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-xs text-blue-200">
            📈 No spam, just insights • Powered by Tally.so
          </p>
        </div>
      </div>
    </div>
  );
} 