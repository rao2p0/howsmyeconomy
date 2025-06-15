import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Share, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { WalletMoodQuestion, ScoreResult } from '../types';

Chart.register(...registerables);

interface WalletMoodCardProps {
  question: WalletMoodQuestion;
  scoreResult: ScoreResult;
}

const cardBackgrounds = [
  'bg-gradient-to-br from-pink-100 to-purple-100',
  'bg-gradient-to-br from-blue-100 to-cyan-100',
  'bg-gradient-to-br from-green-100 to-emerald-100',
  'bg-gradient-to-br from-yellow-100 to-orange-100',
  'bg-gradient-to-br from-red-100 to-pink-100',
  'bg-gradient-to-br from-indigo-100 to-purple-100',
  'bg-gradient-to-br from-teal-100 to-green-100',
  'bg-gradient-to-br from-orange-100 to-red-100',
  'bg-gradient-to-br from-purple-100 to-pink-100',
  'bg-gradient-to-br from-cyan-100 to-blue-100',
];

export function WalletMoodCard({ question, scoreResult }: WalletMoodCardProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const cardIndex = parseInt(question.id.slice(-1)) || 0;
  const bgClass = cardBackgrounds[cardIndex % cardBackgrounds.length];

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, scoreResult.color);
    gradient.addColorStop(1, scoreResult.color + '80');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [scoreResult.score, 100 - scoreResult.score],
            backgroundColor: [gradient, '#F1F5F9'],
            borderWidth: 0,
            cutout: '75%',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
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
  }, [scoreResult.score, scoreResult.color]);

  const handleShare = () => {
    const tweetText = `My wallet's ${scoreResult.emoji} ${scoreResult.mood.toLowerCase()} at ${scoreResult.score}/100 for "${question.question}" Check yours at HowsMyWallet.com #WalletMood #EconomicVibes`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const getTrendIcon = () => {
    if (scoreResult.score >= 70) return <TrendingUp className="text-green-500" size={16} />;
    if (scoreResult.score >= 40) return <Minus className="text-yellow-500" size={16} />;
    return <TrendingDown className="text-red-500" size={16} />;
  };

  return (
    <div className={`card-playful ${bgClass} p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-bounce-in border-4 border-white/50 h-[520px] flex flex-col`}>
      {/* Header - Fixed height */}
      <div className="text-center mb-6 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-3">
          {getTrendIcon()}
          <h3 className="text-xl font-playful font-bold text-gray-800 text-shadow-fun">
            {question.title}
          </h3>
          <span className="text-2xl animate-wiggle">{scoreResult.score >= 70 ? '🎉' : scoreResult.score >= 40 ? '🤔' : '😅'}</span>
        </div>
        <div className="h-20 flex items-center justify-center">
          <p className="text-sm font-modern text-gray-700 leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-3 border-2 border-white/30">
            {question.question}
          </p>
        </div>
      </div>

      {/* Score and Chart - Fixed height */}
      <div className="relative flex flex-col items-center mb-6 flex-shrink-0">
        <div className="relative w-36 h-36 mb-4">
          <canvas
            ref={chartRef}
            className="w-full h-full drop-shadow-lg"
            aria-describedby={`insight-${question.id}`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2 animate-bounce" style={{ animationDuration: '2s' }}>
              {scoreResult.emoji}
            </div>
            <div className="text-2xl font-playful font-bold text-gray-800 text-shadow-fun">
              {scoreResult.score}/100
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <div className="inline-block bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/50">
            <div className="text-lg font-playful font-bold text-gray-800">
              {scoreResult.mood}
            </div>
          </div>
          <div className="h-16 flex items-center justify-center">
            <p 
              id={`insight-${question.id}`}
              className="text-sm font-medium text-gray-600 bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30"
            >
              {scoreResult.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Share Button - Fixed at bottom with padding */}
      <div className="mt-auto flex-shrink-0 px-2 pb-2">
        <button
          onClick={handleShare}
          className="w-full btn-playful flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-playful font-bold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          aria-label={`Share ${question.title} score on X`}
        >
          <Share size={18} className="animate-pulse" />
          Share the Vibes! 🚀
        </button>
      </div>
    </div>
  );
}