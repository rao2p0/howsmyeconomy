import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
// import { SubscriptionBar } from './SubscriptionBar';

export function Footer() {
  return (
    <footer className="mt-16 relative overflow-hidden">
      {/* Subscription Bar - Temporarily commented out */}
      {/* <SubscriptionBar /> */}
      
      {/* Footer Content */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl animate-bounce">📊</span>
          <p className="text-lg font-playful font-semibold text-purple-300">
            Data sourced from Federal Reserve Economic Data (FRED)
          </p>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>💫</span>
        </div>
        <p className="text-sm font-modern text-gray-400 max-w-2xl mx-auto mb-6">
           Made with ❤️ to make economics accessible and fun!
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-400">
            🎯 Real Data
          </span>
          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-400">
            📈 Live Updates
          </span>
          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-400">
            🎉 Easy to Understand
          </span>
        </div>
        

        
        {/* Footer Links */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-sm text-gray-300">
                © 2025 HowsMyEconomy.com
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link 
                to="/disclaimer" 
                className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
              >
                📋 Disclaimer
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">
                Not Financial Advice 🎭
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
} 