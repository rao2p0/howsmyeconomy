import React, { useState } from 'react';
import { Palette, Briefcase, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function VisualModeToggle() {
  const { visualMode, toggleVisualMode, isFunMode, isSeriousMode } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Switch */}
      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200">
        {/* Fun Mode Icon */}
        <div className={`transition-all duration-200 ${isFunMode ? 'text-purple-600' : 'text-gray-400'}`}>
          <Palette size={18} />
        </div>
        
        {/* Toggle Switch */}
        <button
          onClick={toggleVisualMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isFunMode ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'
          }`}
          aria-label={`Switch to ${isFunMode ? 'serious' : 'fun'} mode`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
              isFunMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        
        {/* Serious Mode Icon */}
        <div className={`transition-all duration-200 ${isSeriousMode ? 'text-gray-700' : 'text-gray-400'}`}>
          <Briefcase size={18} />
        </div>
        
        {/* Info Icon with Tooltip */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info 
            size={16} 
            className="text-gray-400 hover:text-gray-600 cursor-help transition-colors duration-200" 
          />
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                {isFunMode 
                  ? "Switch to a more professional look" 
                  : "Switch to a more colorful, fun look"
                }
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mode Label */}
      <div className="text-center mt-2">
        <span className={`text-xs font-medium transition-colors duration-200 ${
          isFunMode ? 'text-purple-600' : 'text-gray-600'
        }`}>
          {isFunMode ? "Make It Fun" : "I'm Serious"}
        </span>
      </div>
    </div>
  );
} 