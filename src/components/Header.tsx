import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-rainbow text-white py-12 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-4 left-4 text-yellow-300 animate-bounce">
        <Sparkles size={24} />
      </div>
      <div className="absolute top-8 right-8 text-pink-300 animate-pulse">
        <Sparkles size={20} />
      </div>
      <div className="absolute bottom-4 left-1/4 text-blue-300 animate-wiggle">
        <Sparkles size={16} />
      </div>
      <div className="absolute bottom-8 right-1/3 text-green-300 animate-bounce" style={{ animationDelay: '0.5s' }}>
        <Sparkles size={18} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="animate-wiggle">
            <Wallet size={48} className="text-yellow-300 drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-playful font-bold text-shadow-fun animate-bounce-in">
            HowsMyWallet.com
          </h1>
          <div className="animate-wiggle" style={{ animationDelay: '0.3s' }}>
            <span className="text-5xl">💰</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-2xl md:text-3xl font-playful font-medium text-yellow-100 animate-fade-in">
            🎉 Your Personal Economic Vibe Check! 🎉
          </p>
          <p className="text-lg md:text-xl font-modern text-blue-100 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover how the economy affects YOUR wallet with 10 super fun Mood Scores! 
            Based on real Federal Reserve data, but way more exciting! ✨
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🏠 Housing Vibes
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🚗 Car Costs
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🛒 Grocery Game
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              💼 Job Market
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}