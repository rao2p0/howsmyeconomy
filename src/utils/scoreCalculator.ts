import { Demographics, WalletMoodQuestion, ScoreResult, FredData, IndicatorMood } from '../types';
import { fredData } from '../data/fredData';

// Mapping of FRED series to human-readable names
const seriesNames: { [key: string]: string } = {
  'MORTGAGE30US': 'Mortgage Rates',
  'CSUSHPINSA': 'Home Prices',
  'CUSR0000SEHA': 'Rent Costs',
  'CUSR0000SETA01': 'Car Prices',
  'CUSR0000SETB': 'Gas Prices',
  'UNRATE': 'Unemployment',
  'CUSR0000SAF11': 'Food Prices',
  'CUSR0000SAM': 'Healthcare Costs',
  'CUSR0000SEEB01': 'Tuition Costs',
  'PSAVERT': 'Savings Rate',
  'CUSR0000SEHF01': 'Electricity Costs'
};

export function calculateScore(
  question: WalletMoodQuestion,
  demographics: Demographics
): ScoreResult {
  // Get the most recent data point for each series and calculate individual moods
  const indicatorBreakdown: IndicatorMood[] = question.fredSeries.map(series => {
    const data = fredData[series];
    const value = data && data.length > 0 ? data[data.length - 1].value : 0;
    
    // Determine mood for this specific indicator
    let mood: 'good' | 'neutral' | 'bad';
    const { excellent, good, fair, poor } = question.benchmarks;
    
    // For most questions, lower values are better (except for savings rate)
    const isHigherBetter = question.id === 'nest-egg' || question.id === 'paycheck-power' || question.id === 'rainy-day';
    
    if (isHigherBetter) {
      if (value >= excellent) mood = 'good';
      else if (value >= good) mood = 'neutral';
      else mood = 'bad';
    } else {
      if (value <= excellent) mood = 'good';
      else if (value <= good) mood = 'neutral';
      else mood = 'bad';
    }
    
    return {
      series,
      mood,
      value,
      name: seriesNames[series] || series
    };
  });

  // Count indicators by mood
  const goodCount = indicatorBreakdown.filter(ind => ind.mood === 'good').length;
  const neutralCount = indicatorBreakdown.filter(ind => ind.mood === 'neutral').length;
  const badCount = indicatorBreakdown.filter(ind => ind.mood === 'bad').length;

  // Calculate overall score based on indicator distribution
  const totalIndicators = indicatorBreakdown.length;
  const goodPercentage = (goodCount / totalIndicators) * 100;
  const badPercentage = (badCount / totalIndicators) * 100;
  
  // Score calculation: good indicators add points, bad indicators subtract
  let adjustedScore = (goodCount * 80) + (neutralCount * 50) + (badCount * 20);
  adjustedScore = adjustedScore / totalIndicators;

  // Ensure score stays within 0-100 range
  adjustedScore = Math.max(0, Math.min(100, adjustedScore));

  // Determine emoji, mood, and color based on simplified 3-tier system
  let emoji, mood, color;
  if (adjustedScore >= 60) {
    emoji = '😀';
    mood = 'Yay!';
    color = '#4CAF50';
  } else if (adjustedScore >= 40) {
    emoji = '😐';
    mood = 'Meh';
    color = '#FF9800';
  } else {
    emoji = '😒';
    mood = 'Nay';
    color = '#F44336';
  }

  // Generate insight based on the indicator breakdown
  const insight = generateInsight(question, indicatorBreakdown, goodCount, neutralCount, badCount);

  return {
    score: Math.round(adjustedScore),
    emoji,
    mood,
    insight,
    color,
    indicatorBreakdown,
    goodCount,
    neutralCount,
    badCount
  };
}

function generateInsight(
  question: WalletMoodQuestion, 
  indicators: IndicatorMood[], 
  goodCount: number, 
  neutralCount: number, 
  badCount: number
): string {
  const total = indicators.length;
  
  if (goodCount === total) {
    return `All ${total} indicators looking good!`;
  } else if (badCount === total) {
    return `All ${total} indicators concerning`;
  } else if (goodCount > badCount) {
    return `${goodCount}/${total} indicators positive`;
  } else if (badCount > goodCount) {
    return `${badCount}/${total} indicators concerning`;
  } else {
    return `Mixed signals across ${total} indicators`;
  }
}