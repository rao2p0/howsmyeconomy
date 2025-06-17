import React, { useMemo } from 'react';
import { Header } from '../components/Header';
import { WalletMoodCard } from '../components/WalletMoodCard';
import { Toast, ToastProvider, ToastViewport } from '../components/Toast';
import { Toaster } from '../components/ui/toaster';
import { walletMoodQuestions } from '../data/questions';
import { calculateScore } from '../utils/scoreCalculator';

// Default demographics for consistent scoring (no personalization)
const defaultDemographics = {
  ageGroup: '35-44',
  householdIncome: '$60-100K',
  geography: 'US Average',
  householdSize: 2.5,
};

export function Dashboard() {
  const scoreResults = useMemo(() => {
    return walletMoodQuestions.map(question => ({
      question,
      scoreResult: calculateScore(question, defaultDemographics)
    }));
  }, []);

  const averageScore = Math.round(
    scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.score, 0) / scoreResults.length
  );

  const getOverallMood = (score: number) => {
    if (score >= 60) return { emoji: '😀', mood: 'The economy is looking good!', color: 'from-green-400 to-emerald-500', vibe: 'Yay!' };
    if (score >= 40) return { emoji: '😐', mood: 'The economy is so-so...', color: 'from-yellow-400 to-orange-500', vibe: 'Meh' };
    return { emoji: '😒', mood: 'The economy needs help!', color: 'from-red-400 to-pink-500', vibe: 'Nay' };
  };

  const overallMood = getOverallMood(averageScore);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        
        {/* Overall Score Banner */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`bg-gradient-to-r ${overallMood.color} text-white p-6 rounded-3xl shadow-2xl text-center mb-8 border-4 border-white/30 animate-pulse-glow`}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-4xl animate-bounce">{overallMood.emoji}</span>
              <h2 className="text-2xl md:text-3xl font-playful font-bold text-shadow-fun">
                Economy Mood: {overallMood.vibe} ({averageScore}/100)
              </h2>
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>{overallMood.emoji}</span>
            </div>
            <p className="text-xl font-playful font-medium">
              {overallMood.mood}
            </p>
          </div>
        </div>
        
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {scoreResults.map(({ question, scoreResult }, index) => (
              <div
                key={question.id}
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <WalletMoodCard
                  question={question}
                  scoreResult={scoreResult}
                />
              </div>
            ))}
          </div>
        </main>

        <Toaster />
        <ToastViewport />
      </div>
    </ToastProvider>
  );
} 