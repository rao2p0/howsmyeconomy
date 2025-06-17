import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { walletMoodQuestions } from '../data/questions';
import { calculateScore } from '../utils/scoreCalculator';

// Default demographics for consistent scoring
const defaultDemographics = {
  ageGroup: '35-44',
  householdIncome: '$60-100K',
  geography: 'US Average',
  householdSize: 2.5,
};

export function CategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const question = useMemo(() => {
    return walletMoodQuestions.find(q => q.id === categoryId);
  }, [categoryId]);

  const scoreResult = useMemo(() => {
    if (!question) return null;
    return calculateScore(question, defaultDemographics);
  }, [question]);

  if (!question || !scoreResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Category Not Found 😕</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We couldn't find the economic category you're looking for.</p>
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use mood_score_system.md rules: +0.5+ = Yay, -0.5 to +0.5 = Meh, <-0.5 = Nay
  const getOverallTrendIcon = (score: number) => {
    if (score >= 0.5) return <TrendingUp className="text-green-500" size={24} />;
    if (score >= -0.5) return <Minus className="text-yellow-500" size={24} />;
    return <TrendingDown className="text-red-500" size={24} />;
  };

  const getOverallMood = (score: number) => {
    if (score >= 0.5) return { emoji: '😀', mood: 'Yay!', color: 'from-green-400 to-emerald-500' };
    if (score >= -0.5) return { emoji: '😐', mood: 'Meh', color: 'from-yellow-400 to-orange-500' };
    return { emoji: '😒', mood: 'Nay', color: 'from-red-400 to-pink-500' };
  };

  const overallMood = getOverallMood(scoreResult.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-4 gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              {getOverallTrendIcon(scoreResult.score)}
              <h1 className="text-4xl md:text-5xl font-playful font-bold text-shadow-fun">
                {question.title}
              </h1>
              <span className="text-4xl animate-wiggle">
                {overallMood.emoji}
              </span>
            </div>
            <p className="text-xl text-blue-200 font-medium mb-2">
              {question.question}
            </p>
                         <div className={`inline-block bg-gradient-to-r ${overallMood.color} px-6 py-2 rounded-full font-bold text-lg`}>
               {scoreResult.goodCount}/{scoreResult.goodCount + scoreResult.neutralCount + scoreResult.badCount} indicators looking good - {overallMood.mood}
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview */}
        <Card className="mb-8 border-4 border-white/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-playful text-center">
              📊 Economic Indicators Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{scoreResult.goodCount}</div>
                <div className="text-sm font-medium text-gray-600">Good Indicators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{scoreResult.neutralCount}</div>
                <div className="text-sm font-medium text-gray-600">Neutral Indicators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{scoreResult.badCount}</div>
                <div className="text-sm font-medium text-gray-600">Bad Indicators</div>
              </div>
            </div>
            <p className="text-center text-lg font-medium text-gray-700 bg-gray-50 p-4 rounded-lg">
              {scoreResult.insight}
            </p>
          </CardContent>
        </Card>

        {/* Individual Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoreResult.indicatorBreakdown.map((indicator, index) => (
            <MetricCard 
              key={indicator.series} 
              indicator={indicator}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Metric Card Component
interface MetricCardProps {
  indicator: {
    series: string;
    mood: 'good' | 'neutral' | 'bad';
    value: number;
    name: string;
  };
  index: number;
}

function MetricCard({ indicator, index }: MetricCardProps) {
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'good': return 'from-green-100 to-emerald-100 border-green-200';
      case 'neutral': return 'from-yellow-100 to-orange-100 border-orange-200';
      case 'bad': return 'from-red-100 to-pink-100 border-red-200';
      default: return 'from-gray-100 to-gray-200 border-gray-200';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'good': return { icon: '📈', color: 'text-green-600', text: 'Good' };
      case 'neutral': return { icon: '📊', color: 'text-orange-600', text: 'Neutral' };
      case 'bad': return { icon: '📉', color: 'text-red-600', text: 'Bad' };
      default: return { icon: '❓', color: 'text-gray-600', text: 'Unknown' };
    }
  };

  const moodInfo = getMoodIcon(indicator.mood);

  return (
    <Card 
      className={`border-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${getMoodColor(indicator.mood)} animate-bounce-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-playful font-medium text-gray-900 flex items-center gap-2">
          <span className="text-2xl">{moodInfo.icon}</span>
          {indicator.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric Value */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">
            {typeof indicator.value === 'number' 
              ? indicator.value.toLocaleString(undefined, { 
                  minimumFractionDigits: 1, 
                  maximumFractionDigits: 2 
                })
              : indicator.value
            }
          </div>
          <div className="text-sm text-gray-600 font-medium">Current Value</div>
        </div>

        {/* Mood Status */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${moodInfo.color} bg-white/80 backdrop-blur-sm`}>
            <span className="text-lg">{moodInfo.icon}</span>
            <span>{moodInfo.text}</span>
          </div>
        </div>

        {/* Quick Interpretation */}
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-white/40">
          <p className="text-sm font-medium text-gray-700 text-center">
            {getMetricInterpretation(indicator.series, indicator.mood, indicator.value)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to provide quick interpretations
function getMetricInterpretation(series: string, mood: string, value: number): string {
  const interpretations: { [key: string]: { [key: string]: string } } = {
    'MORTGAGE30US': {
      good: 'Mortgage rates are favorable for home buyers',
      neutral: 'Mortgage rates are stable but not ideal',
      bad: 'High mortgage rates are hurting affordability'
    },
    'CSUSHPINSA': {
      good: 'Home price growth is moderate and sustainable',
      neutral: 'Home prices are rising at a moderate pace',
      bad: 'Rapid home price increases are reducing affordability'
    },
    'CUSR0000SEHA': {
      good: 'Rent costs are stable or declining',
      neutral: 'Rent costs are rising moderately',
      bad: 'Rent costs are increasing rapidly'
    },
    'HOUST': {
      good: 'Strong housing construction is helping supply',
      neutral: 'Housing construction is steady',
      bad: 'Low housing construction is limiting supply'
    },
    'UNRATE': {
      good: 'Low unemployment means more job opportunities',
      neutral: 'Unemployment is at moderate levels',
      bad: 'High unemployment limits job prospects'
    },
    'PAYEMS': {
      good: 'Strong job growth indicates a healthy economy',
      neutral: 'Job growth is moderate',
      bad: 'Weak job growth signals economic concerns'
    },
    'CUSR0000SAF11': {
      good: 'Food prices are stable or declining',
      neutral: 'Food prices are rising moderately',
      bad: 'Food prices are increasing rapidly'
    },
    'CES0500000003': {
      good: 'Wages are growing faster than inflation',
      neutral: 'Wage growth is keeping pace with costs',
      bad: 'Wages are not keeping up with rising costs'
    }
  };

  return interpretations[series]?.[mood] || `This ${mood} indicator reflects current economic conditions`;
} 