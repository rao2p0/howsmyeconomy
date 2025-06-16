import { Demographics, WalletMoodQuestion, ScoreResult, FredData, IndicatorMood } from '../types';
import { fredData } from '../data/fredData';

// Mapping of FRED series to human-readable names
const seriesNames: { [key: string]: string } = {
  'MORTGAGE30US': 'Mortgage Rates',
  'CSUSHPINSA': 'Home Prices',
  'CUSR0000SEHA': 'Rent Costs',
  'HOUST': 'Housing Starts',
  'MEHOINUSA672N': 'Median Income',
  'CUSR0000SETA01': 'Car Prices',
  'CUSR0000SETB': 'Gas Prices',
  'UNRATE': 'Unemployment',
  'CUSR0000SAF11': 'Food Prices',
  'CUSR0000SAM': 'Healthcare Costs',
  'CUSR0000SEEB01': 'Tuition Costs',
  'PSAVERT': 'Savings Rate',
  'CUSR0000SEHF01': 'Electricity Costs'
};

// Calculate percentage change between two values
function calculatePercentageChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

// Calculate point change between two values
function calculatePointChange(current: number, previous: number): number {
  return current - previous;
}

// Get mood for home affordability question using specific rules
function getHomeMood(series: string, currentValue: number, previousValue: number): 'good' | 'neutral' | 'bad' {
  switch (series) {
    case 'MORTGAGE30US':
      // Mortgage rates: ↓ > 0.5pp = Yay, ±0.5pp = Meh, ↑ > 0.5pp = Nay
      const mortgageChange = calculatePointChange(currentValue, previousValue);
      if (mortgageChange <= -0.5) return 'good';
      if (mortgageChange >= 0.5) return 'bad';
      return 'neutral';
      
    case 'CSUSHPINSA':
      // Home prices: ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
      const homePriceChange = calculatePercentageChange(currentValue, previousValue);
      if (homePriceChange < 0) return 'good';
      if (homePriceChange > 2) return 'bad';
      return 'neutral';
      
    case 'CUSR0000SEHA':
      // Rent: ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
      const rentChange = calculatePercentageChange(currentValue, previousValue);
      if (rentChange < 0) return 'good';
      if (rentChange > 2) return 'bad';
      return 'neutral';
      
    case 'HOUST':
      // Housing starts: ↑ > 5% YoY = Yay, ±5% = Meh, ↓ > 5% YoY = Nay
      const housingStartsChange = calculatePercentageChange(currentValue, previousValue);
      if (housingStartsChange > 5) return 'good';
      if (housingStartsChange < -5) return 'bad';
      return 'neutral';
      
    case 'MEHOINUSA672N':
      // Median income: ↑ > 3% YoY = Yay, ±3% = Meh, ↓ > 3% = Nay
      const incomeChange = calculatePercentageChange(currentValue, previousValue);
      if (incomeChange > 3) return 'good';
      if (incomeChange < -3) return 'bad';
      return 'neutral';
      
    default:
      return 'neutral';
  }
}

// Generic mood calculation for other questions (keeping existing logic)
function getGenericMood(question: WalletMoodQuestion, value: number): 'good' | 'neutral' | 'bad' {
  const { excellent, good, fair, poor } = question.benchmarks;
  
  // For savings-related questions, higher is better
  const isHigherBetter = question.id === 'nest-egg' || question.id === 'paycheck-power' || question.id === 'rainy-day';
  
  if (isHigherBetter) {
    if (value >= excellent) return 'good';
    else if (value >= good) return 'neutral';
    else return 'bad';
  } else {
    if (value <= excellent) return 'good';
    else if (value <= good) return 'neutral';
    else return 'bad';
  }
}

export function calculateScore(
  question: WalletMoodQuestion,
  demographics: Demographics
): ScoreResult {
  // Get the most recent data point and year-over-year comparison for each series
  const indicatorBreakdown: IndicatorMood[] = question.fredSeries.map(series => {
    const data = fredData[series];
    if (!data || data.length < 12) {
      return {
        series,
        mood: 'neutral' as const,
        value: 0,
        name: seriesNames[series] || series
      };
    }
    
    const currentValue = data[data.length - 1].value;
    const previousYearValue = data[data.length - 13]?.value || data[0].value; // 12 months ago
    
    let mood: 'good' | 'neutral' | 'bad';
    
    // Use specific home affordability logic for the first question
    if (question.id === 'home-hunt') {
      mood = getHomeMood(series, currentValue, previousYearValue);
    } else {
      // Use generic logic for other questions
      mood = getGenericMood(question, currentValue);
    }
    
    return {
      series,
      mood,
      value: currentValue,
      name: seriesNames[series] || series
    };
  });

  // Count indicators by mood
  const goodCount = indicatorBreakdown.filter(ind => ind.mood === 'good').length;
  const neutralCount = indicatorBreakdown.filter(ind => ind.mood === 'neutral').length;
  const badCount = indicatorBreakdown.filter(ind => ind.mood === 'bad').length;

  // Calculate overall score based on indicator distribution
  const totalIndicators = indicatorBreakdown.length;
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