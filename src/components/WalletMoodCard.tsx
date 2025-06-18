import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { Share, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WalletMoodQuestion, ScoreResult } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

Chart.register(...registerables);

interface WalletMoodCardProps {
  question: WalletMoodQuestion;
  scoreResult: ScoreResult;
}

const cardBackgrounds = [
  'from-pink-100 to-purple-100',
  'from-blue-100 to-cyan-100',
  'from-green-100 to-emerald-100',
  'from-yellow-100 to-orange-100',
  'from-red-100 to-pink-100',
  'from-indigo-100 to-purple-100',
  'from-teal-100 to-green-100',
  'from-orange-100 to-red-100',
  'from-purple-100 to-pink-100',
  'from-cyan-100 to-blue-100',
];

export function WalletMoodCard({ question, scoreResult }: WalletMoodCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const cardIndex = parseInt(question.id.slice(-1)) || 0;
  const bgGradient = cardBackgrounds[cardIndex % cardBackgrounds.length];

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data for 180° doughnut chart
    const data = [scoreResult.goodCount, scoreResult.neutralCount, scoreResult.badCount];
    const colors = ['#4CAF50', '#FF9800', '#F44336']; // Green, Orange, Red
    const labels = ['Good', 'Neutral', 'Bad'];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 3,
            borderColor: '#ffffff',
          },
        ],
      },
              options: {
          responsive: true,
          maintainAspectRatio: false,
          circumference: Math.PI, // 180 degrees
          rotation: Math.PI, // Start from bottom
          cutout: '60%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = scoreResult.goodCount + scoreResult.neutralCount + scoreResult.badCount;
                  return `${label}: ${value}/${total} indicators`;
                }
              }
            },
          },
          animation: {
            duration: 1200,
            easing: 'easeOutBounce',
          },
        },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [scoreResult.goodCount, scoreResult.neutralCount, scoreResult.badCount]);

  const handleShare = () => {
    const tweetText = `The economy's ${scoreResult.emoji} ${scoreResult.mood.toLowerCase()} for "${question.question}" - ${scoreResult.goodCount}/${scoreResult.goodCount + scoreResult.neutralCount + scoreResult.badCount} indicators looking good! Check the full economic mood at HowsMyEconomy.com #EconomyMood #EconomicData`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  // Use mood_score_system.md rules: +0.5+ = Yay, -0.5 to +0.5 = Meh, <-0.5 = Nay
  const getTrendIcon = () => {
    if (scoreResult.score >= 0.5) return <TrendingUp className="text-green-500" size={16} />;
    if (scoreResult.score >= -0.5) return <Minus className="text-yellow-500" size={16} />;
    return <TrendingDown className="text-red-500" size={16} />;
  };

  return (
    <Link 
      to={`/category/${question.id}`}
      className="block h-[520px] transition-all duration-300 hover:scale-105 transform"
    >
      <Card className={cn(
        "relative h-full overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border-4 border-white/50 shadow-xl hover:shadow-2xl flex flex-col cursor-pointer",
        `bg-gradient-to-br ${bgGradient}`
      )}>
        {/* Header - Fixed Height */}
        <CardHeader className="text-center pb-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getTrendIcon()}
            <CardTitle className="text-xl font-playful font-medium text-gray-900 text-shadow-fun">
              {question.title}
            </CardTitle>
            <span className="text-xl animate-wiggle">
              {scoreResult.score >= 0.5 ? '😀' : scoreResult.score >= -0.5 ? '😐' : '😒'}
            </span>
          </div>
          <CardDescription className="text-sm font-modern text-gray-900 leading-relaxed bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-white/40 font-medium">
            {question.question}
          </CardDescription>
        </CardHeader>

        {/* Main Content - Flexible Height */}
        <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          {/* Chart Container - Proper size for visibility */}
          <div className="relative w-48 h-24 mb-4">
            <canvas
              ref={chartRef}
              width="192"
              height="96"
              className="w-full h-full drop-shadow-lg"
              aria-describedby={`breakdown-${question.id}`}
            />
            {/* Emoji and mood positioned below the arc */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <div className="text-3xl mb-1 animate-bounce" style={{ animationDuration: '2s' }}>
                {scoreResult.emoji}
              </div>
              <div className="text-lg font-playful font-bold text-gray-900 text-shadow-fun">
                {scoreResult.mood}
              </div>
            </div>
          </div>
          
          {/* Indicator Breakdown - Compact */}
          <div className="text-center space-y-3 w-full mt-8">
            <div className="flex justify-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-800 font-semibold">{scoreResult.goodCount} Good</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-800 font-semibold">{scoreResult.neutralCount} Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-800 font-semibold">{scoreResult.badCount} Bad</span>
              </div>
            </div>
            
            {/* Click to explore hint */}
            <div className="text-xs text-gray-600 font-medium mt-2 opacity-75">
              👆 Click to explore details
            </div>
          </div>
        </CardContent>

        {/* Share Button - Fixed Position at Bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex-shrink-0">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
            variant="playful"
            className="w-56 font-playful font-bold gap-2 py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl"
            aria-label={`Share ${question.title} economic data on X`}
          >
            <Share size={16} className="animate-pulse" />
            Share the Data! 📊
          </Button>
        </div>
      </Card>
    </Link>
  );
}