import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DemographicSelector } from './components/DemographicSelector';
import { WalletMoodCard } from './components/WalletMoodCard';
import { Toast, ToastProvider, ToastViewport } from './components/Toast';
import { Toaster } from '@/components/ui/toaster';
import { Demographics } from './types';
import { walletMoodQuestions } from './data/questions';
import { calculateScore } from './utils/scoreCalculator';

const defaultDemographics: Demographics = {
  ageGroup: '35-44',
  householdIncome: '$60-100K',
  geography: 'US Average',
  householdSize: 2.5,
};

function App() {
  const [demographics, setDemographics] = useState<Demographics>(defaultDemographics);
  const [showToast, setShowToast] = useState(false);

  const scoreResults = useMemo(() => {
    return walletMoodQuestions.map(question => ({
      question,
      scoreResult: calculateScore(question, demographics)
    }));
  }, [demographics]);

  const handleDemographicsChange = (newDemographics: Demographics) => {
    setDemographics(newDemographics);
    setShowToast(true);
  };

  const handleReset = () => {
    setDemographics(defaultDemographics);
    setShowToast(true);
  };

  const averageScore = Math.round(
    scoreResults.reduce((sum, { scoreResult }) => sum + scoreResult.score, 0) / scoreResults.length
  );

  const getOverallMood = (score: number) => {
    if (score >= 80) return { emoji: '🥳', mood: 'Your wallet is THRIVING!', color: 'from-green-400 to-emerald-500' };
    if (score >= 60) return { emoji: '😊', mood: 'Your wallet is doing solid!', color: 'from-blue-400 to-cyan-500' };
    if (score >= 40) return { emoji: '😬', mood: 'Your wallet is feeling tight!', color: 'from-yellow-400 to-orange-500' };
    return { emoji: '😣', mood: 'Your wallet needs some TLC!', color: 'from-red-400 to-pink-500' };
  };

  const overallMood = getOverallMood(averageScore);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Header />
        
        <DemographicSelector
          demographics={demographics}
          onDemographicsChange={handleDemographicsChange}
          onReset={handleReset}
        />
        
        {/* Overall Score Banner */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className={`bg-gradient-to-r ${overallMood.color} text-white p-6 rounded-3xl shadow-2xl text-center mb-8 border-4 border-white/30 animate-pulse-glow`}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-4xl animate-bounce">{overallMood.emoji}</span>
              <h2 className="text-2xl md:text-3xl font-playful font-bold text-shadow-fun">
                Overall Wallet Vibe: {averageScore}/100
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

        <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12 mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20"></div>
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl animate-bounce">📊</span>
              <p className="text-lg font-playful font-semibold text-purple-300">
                Data sourced from Federal Reserve Economic Data (FRED)
              </p>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>💫</span>
            </div>
            <p className="text-sm font-modern text-gray-400 max-w-2xl mx-auto">
              Economic indicators updated monthly. Scores are estimates for educational purposes. 
              Made with ❤️ to make economics fun and accessible!
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🎯 Accurate Data
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🚀 Real-time Updates
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                🎉 Fun Experience
              </span>
            </div>
          </div>
        </footer>

        <Toast
          message="Wallet vibes updated! ✨🎉"
          visible={showToast}
          onHide={() => setShowToast(false)}
        />
        
        <Toaster />
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

export default App;