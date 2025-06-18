import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { WalletMoodCard } from '../components/WalletMoodCard';
import { OverallShareButton } from '../components/OverallShareButton';
import { Toast, ToastProvider, ToastViewport } from '../components/Toast';
import { Toaster } from '../components/ui/toaster';
import { walletMoodQuestions } from '../data/questions';
import { calculateScore } from '../utils/scoreCalculator';
import { getCurrentDataSourceInfo } from '../data/fredDataProvider';
import type { ScoreResult } from '../types';

// Default demographics for consistent scoring (no personalization)
const defaultDemographics = {
  ageGroup: '35-44',
  householdIncome: '$60-100K',
  geography: 'US Average',
  householdSize: 2.5,
};

interface ScoreResultWithQuestion {
  question: typeof walletMoodQuestions[0];
  scoreResult: ScoreResult;
}

export function Dashboard() {
  const [scoreResults, setScoreResults] = useState<ScoreResultWithQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSourceInfo, setDataSourceInfo] = useState<{ source: 'mock' | 'real' | null }>({ source: null });

  useEffect(() => {
    async function loadScores() {
      try {
        setLoading(true);
        setError(null);
        
        // Get data source info for display
        const sourceInfo = getCurrentDataSourceInfo();
        setDataSourceInfo(sourceInfo);
        
        const results: ScoreResultWithQuestion[] = [];
        
        for (const question of walletMoodQuestions) {
          const scoreResult = await calculateScore(question, defaultDemographics);
          results.push({ question, scoreResult });
        }
        
        setScoreResults(results);
      } catch (err) {
        console.error('Failed to load scores:', err);
        setError(err instanceof Error ? err.message : 'Failed to load economic data');
      } finally {
        setLoading(false);
      }
    }
    
    loadScores();
  }, []);

  const averageScore = scoreResults.length > 0 
    ? scoreResults.reduce((sum: number, { scoreResult }: ScoreResultWithQuestion) => sum + scoreResult.score, 0) / scoreResults.length
    : 0;

  // Use mood_score_system.md rules: +0.5+ = Yay, -0.5 to +0.5 = Meh, <-0.5 = Nay
  const getOverallMood = (score: number) => {
    if (score >= 0.5) return { emoji: '😀', mood: 'The economy is looking good!', color: 'from-green-400 to-emerald-500', vibe: 'Yay!' };
    if (score >= -0.5) return { emoji: '😐', mood: 'The economy is so-so...', color: 'from-yellow-400 to-orange-500', vibe: 'Meh' };
    return { emoji: '😒', mood: 'The economy needs help!', color: 'from-red-400 to-pink-500', vibe: 'Nay' };
  };

  const overallMood = getOverallMood(averageScore);

  // Loading state
  if (loading) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Loading Economic Data...</h2>
              <p className="text-gray-600">
                {dataSourceInfo.source === 'real' ? 'Loading real FRED data' : 'Loading data'}
              </p>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <span className="text-6xl mb-4 block">😞</span>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Failed to Load Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        
        {/* Data Source Info Banner - Only show if using mock data */}
        {dataSourceInfo.source === 'mock' && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-bold">WARNING: Using MOCK data for development</p>
                  <p className="text-sm">Not real economic data. Do not use for financial decisions.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Score Banner */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className={`bg-gradient-to-r ${overallMood.color} text-white p-6 rounded-3xl shadow-2xl text-center mb-8 border-4 border-white/30 animate-pulse-glow`}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-4xl animate-bounce">{overallMood.emoji}</span>
              <h2 className="text-2xl md:text-3xl font-playful font-bold text-shadow-fun">
                Economy Mood: {overallMood.vibe} ({averageScore.toFixed(2)})
              </h2>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>{overallMood.emoji}</span>
            </div>
            <p className="text-xl font-playful font-medium mb-4">
              {overallMood.mood}
            </p>
            {/* Overall Share Button */}
            <OverallShareButton
              overallScore={averageScore}
              goodCount={scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.goodCount, 0)}
              totalCount={scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.goodCount + scoreResult.neutralCount + scoreResult.badCount, 0)}
              context="homepage"
              size="lg"
              className="bg-white/20 hover:bg-white/30 border-2 border-white/50"
            />
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {scoreResults.map(({ question, scoreResult }: ScoreResultWithQuestion) => (
              <WalletMoodCard
                key={question.id}
                question={question}
                scoreResult={scoreResult}
              />
            ))}
          </div>
        </main>

        <Toaster />
        <ToastViewport />
        
        {/* Floating Share Button - Fixed Position */}
        <div className="fixed bottom-6 right-6 z-50">
          <OverallShareButton
            overallScore={averageScore}
            goodCount={scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.goodCount, 0)}
            totalCount={scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.goodCount + scoreResult.neutralCount + scoreResult.badCount, 0)}
            context="homepage"
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl"
          />
        </div>
      </div>
    </ToastProvider>
  );
}