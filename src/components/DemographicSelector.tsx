import React from 'react';
import { Demographics } from '../types';
import { RotateCcw, Settings, Sparkles } from 'lucide-react';

interface DemographicSelectorProps {
  demographics: Demographics;
  onDemographicsChange: (demographics: Demographics) => void;
  onReset: () => void;
}

export function DemographicSelector({ demographics, onDemographicsChange, onReset }: DemographicSelectorProps) {
  const handleChange = (field: keyof Demographics, value: string | number) => {
    onDemographicsChange({
      ...demographics,
      [field]: value
    });
  };

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-2xl border-b-4 border-white/30">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings className="text-white animate-spin" size={20} style={{ animationDuration: '3s' }} />
          <h2 className="text-xl font-playful font-bold text-white text-shadow-fun">
            Customize Your Vibe! ✨
          </h2>
          <Sparkles className="text-yellow-300 animate-pulse" size={20} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
          {/* Age Group */}
          <div className="space-y-2">
            <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm" htmlFor="age-group">
              🎂 Age Vibes
            </label>
            <select
              id="age-group"
              value={demographics.ageGroup}
              onChange={(e) => handleChange('ageGroup', e.target.value)}
              className="w-full border-3 border-white/30 rounded-2xl p-3 focus:ring-4 focus:ring-yellow-300 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              aria-label="Select age group"
            >
              <option value="18-24">18-24 (Gen Z Energy! 🚀)</option>
              <option value="25-34">25-34 (Millennial Hustle 💪)</option>
              <option value="35-44">35-44 (Peak Power! ⭐)</option>
              <option value="45-54">45-54 (Wisdom Mode 🧠)</option>
              <option value="55-64">55-64 (Almost There! 🎯)</option>
              <option value="65+">65+ (Living the Dream! 🌴)</option>
            </select>
          </div>

          {/* Household Income */}
          <div className="space-y-2">
            <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm" htmlFor="income">
              💰 Money Mood
            </label>
            <select
              id="income"
              value={demographics.householdIncome}
              onChange={(e) => handleChange('householdIncome', e.target.value)}
              className="w-full border-3 border-white/30 rounded-2xl p-3 focus:ring-4 focus:ring-yellow-300 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              aria-label="Select household income"
            >
              <option value="<$30K">Under $30K (Starter Pack 🌱)</option>
              <option value="$30-60K">$30-60K (Getting There! 📈)</option>
              <option value="$60-100K">$60-100K (Solid Vibes ✨)</option>
              <option value="$100-150K">$100-150K (Doing Great! 🎉)</option>
              <option value="$150K+">$150K+ (Living Large! 👑)</option>
            </select>
          </div>

          {/* Geography */}
          <div className="space-y-2">
            <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm" htmlFor="geography">
              🗺️ Location Vibes
            </label>
            <select
              id="geography"
              value={demographics.geography}
              onChange={(e) => handleChange('geography', e.target.value)}
              className="w-full border-3 border-white/30 rounded-2xl p-3 focus:ring-4 focus:ring-yellow-300 focus:border-transparent bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              aria-label="Select geography"
            >
              <option value="US Average">🇺🇸 US Average</option>
              <option value="California">🌴 California</option>
              <option value="Texas">🤠 Texas</option>
              <option value="New York">🗽 New York</option>
              <option value="Florida">🏖️ Florida</option>
            </select>
          </div>

          {/* Household Size */}
          <div className="space-y-2">
            <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm" htmlFor="household-size">
              👨‍👩‍👧‍👦 Squad Size: {demographics.householdSize}
            </label>
            <div className="relative">
              <input
                id="household-size"
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={demographics.householdSize}
                onChange={(e) => handleChange('householdSize', parseFloat(e.target.value))}
                className="w-full h-3 slider appearance-none cursor-pointer rounded-full shadow-lg"
                aria-label="Select household size"
              />
              <div className="flex justify-between text-xs text-white/80 mt-1 font-medium">
                <span>Solo 🙋</span>
                <span>Big Fam! 👨‍👩‍👧‍👦</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={onReset}
              className="btn-playful flex items-center gap-2 font-playful font-semibold text-white px-6 py-3 rounded-full hover:scale-105 transform transition-all duration-300 shadow-lg animate-pulse-glow"
              aria-label="Reset to median household"
            >
              <RotateCcw size={18} className="animate-spin" style={{ animationDuration: '2s' }} />
              Reset Magic! ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}