import React, { useState } from 'react';
import { Demographics } from '../types';
import { RotateCcw, Settings, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DemographicSelectorProps {
  demographics: Demographics;
  onDemographicsChange: (demographics: Demographics) => void;
  onReset: () => void;
}

export function DemographicSelector({ demographics, onDemographicsChange, onReset }: DemographicSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof Demographics, value: string | number) => {
    onDemographicsChange({
      ...demographics,
      [field]: value
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-2xl border-b-4 border-white/30">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with toggle button */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings className="text-white animate-spin" size={20} style={{ animationDuration: '3s' }} />
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 text-xl font-playful font-bold text-white text-shadow-fun hover:scale-105 transition-transform duration-200"
            aria-expanded={isExpanded}
            aria-controls="demographic-controls"
          >
            Customize Your Vibe! ✨
            {isExpanded ? (
              <ChevronUp className="text-white animate-bounce" size={24} />
            ) : (
              <ChevronDown className="text-white animate-bounce" size={24} />
            )}
          </button>
          <Sparkles className="text-yellow-300 animate-pulse" size={20} />
        </div>
        
        {/* Collapsible content */}
        <div
          id="demographic-controls"
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end">
                {/* Age Group */}
                <div className="space-y-2">
                  <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm">
                    🎂 Age Vibes
                  </label>
                  <Select value={demographics.ageGroup} onValueChange={(value) => handleChange('ageGroup', value)}>
                    <SelectTrigger className="w-full border-3 border-white/30 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24 (Gen Z Energy! 🚀)</SelectItem>
                      <SelectItem value="25-34">25-34 (Millennial Hustle 💪)</SelectItem>
                      <SelectItem value="35-44">35-44 (Peak Power! ⭐)</SelectItem>
                      <SelectItem value="45-54">45-54 (Wisdom Mode 🧠)</SelectItem>
                      <SelectItem value="55-64">55-64 (Almost There! 🎯)</SelectItem>
                      <SelectItem value="65+">65+ (Living the Dream! 🌴)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Household Income */}
                <div className="space-y-2">
                  <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm">
                    💰 Money Mood
                  </label>
                  <Select value={demographics.householdIncome} onValueChange={(value) => handleChange('householdIncome', value)}>
                    <SelectTrigger className="w-full border-3 border-white/30 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$30K">Under $30K (Starter Pack 🌱)</SelectItem>
                      <SelectItem value="$30-60K">$30-60K (Getting There! 📈)</SelectItem>
                      <SelectItem value="$60-100K">$60-100K (Solid Vibes ✨)</SelectItem>
                      <SelectItem value="$100-150K">$100-150K (Doing Great! 🎉)</SelectItem>
                      <SelectItem value="$150K+">$150K+ (Living Large! 👑)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Geography */}
                <div className="space-y-2">
                  <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm">
                    🗺️ Location Vibes
                  </label>
                  <Select value={demographics.geography} onValueChange={(value) => handleChange('geography', value)}>
                    <SelectTrigger className="w-full border-3 border-white/30 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-800 font-medium shadow-lg transition-all duration-300 hover:shadow-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US Average">🇺🇸 US Average</SelectItem>
                      <SelectItem value="California">🌴 California</SelectItem>
                      <SelectItem value="Texas">🤠 Texas</SelectItem>
                      <SelectItem value="New York">🗽 New York</SelectItem>
                      <SelectItem value="Florida">🏖️ Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Household Size */}
                <div className="space-y-2">
                  <label className="block text-sm font-playful font-semibold text-white drop-shadow-sm">
                    👨‍👩‍👧‍👦 Squad Size: {demographics.householdSize}
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={demographics.householdSize}
                      onChange={(e) => handleChange('householdSize', parseFloat(e.target.value))}
                      className="w-full h-3 slider appearance-none cursor-pointer rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500"
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
                  <Button
                    onClick={onReset}
                    variant="playful"
                    className="font-playful font-semibold text-white px-6 py-3 rounded-full shadow-lg animate-pulse-glow gap-2"
                    aria-label="Reset to median household"
                  >
                    <RotateCcw size={18} className="animate-spin" style={{ animationDuration: '2s' }} />
                    Reset Magic! ✨
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}