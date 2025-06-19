import React from 'react';
import { Share } from 'lucide-react';
import { Button } from './ui/button';

interface OverallShareButtonProps {
  /** Overall mood score (-1 to 1) */
  overallScore?: number;
  /** Total number of good indicators */
  goodCount?: number;
  /** Total number of indicators */
  totalCount?: number;
  /** Page context for customized sharing */
  context?: 'homepage' | 'detail';
  /** Category name for detail page context */
  categoryName?: string;
  /** Custom styling classes */
  className?: string;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
}

export function OverallShareButton({
  overallScore = 0,
  goodCount = 0,
  totalCount = 0,
  context = 'homepage',
  categoryName,
  className = '',
  size = 'md'
}: OverallShareButtonProps) {
  
  const handleShare = () => {
    // Determine mood based on score using mood_score_system.md rules
    const getMoodData = (score: number) => {
      if (score >= 0.5) return { emoji: '😀', mood: 'looking good', vibe: 'Yay' };
      if (score >= -0.5) return { emoji: '😐', mood: 'mixed signals', vibe: 'Meh' };
      return { emoji: '😒', mood: 'needs attention', vibe: 'Nay' };
    };

    const moodData = getMoodData(overallScore);
    
    // Create context-specific share messages
    let shareMessage = '';
    
    if (context === 'detail' && categoryName) {
      shareMessage = `Just checked "${categoryName}" on the economy ${moodData.emoji} - ${moodData.mood}! ${goodCount}/${totalCount} indicators looking positive. Get the full economic picture at HowsMyEconomy.com #EconomyMood #EconomicData`;
    } else {
      // Homepage context
      const percentage = totalCount > 0 ? Math.round((goodCount / totalCount) * 100) : 0;
      shareMessage = `The economy is ${moodData.mood} ${moodData.emoji} - ${goodCount}/${totalCount} indicators positive (${percentage}%)! Check out the full economic breakdown at HowsMyEconomy.com #EconomyMood #EconomicData #Economy`;
    }
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  // Button size configurations
  const sizeConfig = {
    sm: {
      button: 'px-4 py-2 text-sm',
      icon: 14,
      text: 'Share Economy 📊'
    },
    md: {
      button: 'px-6 py-3 text-base',
      icon: 16,
      text: 'Share the Economy! 📊'
    },
    lg: {
      button: 'px-8 py-4 text-lg',
      icon: 18,
      text: 'Share Economic Data! 📊'
    }
  };

  const config = sizeConfig[size];

  return (
    <Button
      onClick={handleShare}
      variant="playful"
      className={`font-playful font-bold gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${config.button} ${className}`}
      aria-label="Share overall economic data on X"
    >
      <Share size={config.icon} className="animate-pulse text-white" />
      {config.text}
    </Button>
  );
}