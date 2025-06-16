import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Share, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WalletMoodQuestion, ScoreResult } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
            borderWidth: 2,
            borderColor: '#ffffff',
            cutout: '65%',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: Math.PI, // 180 degrees
        rotation: Math.PI, // Start from bottom
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
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
    const tweetText = `The economy's ${scoreResult.emoji} ${scoreResult.mood.toLowerCase()} at ${scoreResult.score}/100 for "${question.question}" Check the full economic mood at HowsMyEconomy.com #EconomyMood #EconomicData`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const getTrendIcon = () => {
    if (scoreResult.score >= 60) return <TrendingUp className="text-green-500" size={16} />;
    if (scoreResult.score >= 40) return <Minus className="text-yellow-500" size={16} />;
    return <TrendingDown className="text-red-500" size={16} />;
  };

  return (
    <Card className={cn(
      "relative h-[520px] overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-bounce-in border-4 border-white/50 shadow-xl hover:shadow-2xl",
      `bg-gradient-to-br ${bgGradient}`
    )}>
      {/* Header - Fixed Height Container */}
      <CardHeader className="text-center h-32 pb-0">
        <div className="flex items-center justify-center gap-2 mb-3">
          {getTrendIcon()}
          <CardTitle className="text-xl font-playful font-semibold text-gray-800 text-shadow-fun">
            {question.title}
          </CardTitle>
          <span className="text-2xl animate-wiggle">
            {scoreResult.score >= 60 ? '😀' : scoreResult.score >= 40 ? '😐' : '😒'}
          </span>
        </div>
        <div className="h-16 flex items-center justify-center">
          <CardDescription className="text-sm font-modern text-gray-700 leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-3 border-2 border-white/30">
            {question.question}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Chart and Breakdown - Fixed Height Container */}
      <CardContent className="relative flex flex-col items-center h-80 px-6">
        {/* Chart container with proper dimensions for 180° arc */}
        <div className="relative w-40 h-20 mb-6">
          <canvas
            ref={chartRef}
            className="w-full h-full drop-shadow-lg"
            aria-describedby={`breakdown-${question.id}`}
          />
          {/* Center text positioned below the arc */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="text-2xl mb-1 animate-bounce" style={{ animationDuration: '2s' }}>
              {scoreResult.emoji}
            </div>
            <div className="text-sm font-playful font-bold text-gray-800 text-shadow-fun">
              {scoreResult.mood}
            </div>
          </div>
        </div>
        
        {/* Indicator Breakdown */}
        <div className="text-center space-y-3 w-full">
          <div className="flex justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">{scoreResult.goodCount} Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-700">{scoreResult.neutralCount} Neutral</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-700">{scoreResult.badCount} Bad</span>
            </div>
          </div>
          
          <div className="h-16 flex items-center justify-center">
            <p 
              id={`breakdown-${question.id}`}
              className="text-sm font-medium text-gray-600 bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30"
            >
              {scoreResult.insight}
            </p>
          </div>
        </div>
      </CardContent>

      {/* CENTERED BUTTON - FIXED POSITION ON ALL CARDS */}
      <Button
        onClick={handleShare}
        variant="playful"
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-64 font-playful font-bold gap-3 py-4 px-4 rounded-2xl shadow-lg hover:shadow-xl"
        aria-label={`Share ${question.title} economic data on X`}
      >
        <Share size={18} className="animate-pulse" />
        Share the Data! 📊
      </Button>
    </Card>
  );
}