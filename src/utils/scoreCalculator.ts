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

// Get mood score for home affordability question using specific rules
// Returns: +1 for Yay, 0 for Meh, -1 for Nay
function getHomeMoodScore(series: string, currentValue: number, previousValue: number): number {
  switch (series) {
    case 'MORTGAGE30US':
      // Mortgage rates: ↓ > 0.5pp = Yay, ±0.5pp = Meh, ↑ > 0.5pp = Nay
      const mortgageChange = calculatePointChange(currentValue, previousValue);
      if (mortgageChange <= -0.5) return 1; // Yay
      if (mortgageChange >= 0.5) return -1; // Nay
      return 0; // Meh
      
    case 'CSUSHPINSA':
      // Home prices: ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
      const homePriceChange = calculatePercentageChange(currentValue, previousValue);
      if (homePriceChange < 0) return 1; // Yay
      if (homePriceChange > 2) return -1; // Nay
      return 0; // Meh
      
    case 'CUSR0000SEHA':
      // Rent: ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
      const rentChange = calculatePercentageChange(currentValue, previousValue);
      if (rentChange < 0) return 1; // Yay
      if (rentChange > 2) return -1; // Nay
      return 0; // Meh
      
    case 'HOUST':
      // Housing starts: ↑ > 5% YoY = Yay, ±5% = Meh, ↓ > 5% YoY = Nay
      const housingStartsChange = calculatePercentageChange(currentValue, previousValue);
      if (housingStartsChange > 5) return 1; // Yay
      if (housingStartsChange < -5) return -1; // Nay
      return 0; // Meh
      
    case 'MEHOINUSA672N':
      // Median income: ↑ > 3% YoY = Yay, ±3% = Meh, ↓ > 3% = Nay
      const incomeChange = calculatePercentageChange(currentValue, previousValue);
      if (incomeChange > 3) return 1; // Yay
      if (incomeChange < -3) return -1; // Nay
      return 0; // Meh
      
    default:
      return 0; // Meh
  }
}

// Generic mood score calculation for other questions (keeping existing logic)
// Returns: +1 for Yay, 0 for Meh, -1 for Nay
function getGenericMoodScore(question: WalletMoodQuestion, value: number): number {
  const { excellent, good, fair, poor } = question.benchmarks;
  
  // For savings-related questions, higher is better
  const isHigherBetter = question.id === 'nest-egg' || question.id === 'paycheck-power' || question.id === 'rainy-day';
  
  if (isHigherBetter) {
    if (value >= excellent) return 1; // Yay
    else if (value >= good) return 0; // Meh
    else return -1; // Nay
  } else {
    if (value <= excellent) return 1; // Yay
    else if (value <= good) return 0; // Meh
    else return -1; // Nay
  }
}

// Convert mood score to mood string
function moodScoreToMood(score: number): 'good' | 'neutral' | 'bad' {
  if (score > 0) return 'good';
  if (score < 0) return 'bad';
  return 'neutral';
}

export function calculateScore(
  question: WalletMoodQuestion,
  demographics: Demographics
): ScoreResult {
  // Get mood scores for each indicator
  const moodScores: number[] = [];
  const indicatorBreakdown: IndicatorMood[] = question.fredSeries.map(series => {
    const data = fredData[series];
    if (!data || data.length < 12) {
      moodScores.push(0); // Neutral if no data
      return {
        series,
        mood: 'neutral' as const,
        value: 0,
        name: seriesNames[series] || series
      };
    }
    
    const currentValue = data[data.length - 1].value;
    const previousYearValue = data[data.length - 13]?.value || data[0].value; // 12 months ago
    
    let moodScore: number;
    
    // Use specific home affordability logic for the first question
    if (question.id === 'home-hunt') {
      moodScore = getHomeMoodScore(series, currentValue, previousYearValue);
    } else {
      // Use generic logic for other questions
      moodScore = getGenericMoodScore(question, currentValue);
    }
    
    moodScores.push(moodScore);
    
    return {
      series,
      mood: moodScoreToMood(moodScore),
      value: currentValue,
      name: seriesNames[series] || series
    };
  });

  // Calculate average mood score
  const averageMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;

  // Interpret the average score according to your rules:
  // +0.5 or more → Yay 🟢
  // -0.5 to +0.5 → Meh 🟡  
  // Less than -0.5 → Nay 🔴
  let emoji, mood, color, overallScore;
  
  if (averageMoodScore >= 0.5) {
    emoji = '😀';
    mood = 'Yay!';
    color = '#4CAF50';
    overallScore = 80; // High score for Yay
  } else if (averageMoodScore >= -0.5) {
    emoji = '😐';
    mood = 'Meh';
    color = '#FF9800';
    overallScore = 50; // Medium score for Meh
  } else {
    emoji = '😒';
    mood = 'Nay';
    color = '#F44336';
    overallScore = 20; // Low score for Nay
  }

  // Count indicators by mood for the doughnut chart
  const goodCount = indicatorBreakdown.filter(ind => ind.mood === 'good').length;
  const neutralCount = indicatorBreakdown.filter(ind => ind.mood === 'neutral').length;
  const badCount = indicatorBreakdown.filter(ind => ind.mood === 'bad').length;

  // Generate insight based on the indicator breakdown
  const insight = generateInsight(question, indicatorBreakdown, goodCount, neutralCount, badCount, averageMoodScore);

  return {
    score: overallScore,
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
  badCount: number,
  averageScore: number
): string {
  const total = indicators.length;
  
  // More detailed insights based on the average score
  if (averageScore >= 0.5) {
    return `Strong positive signals (${goodCount}/${total} good indicators)`;
  } else if (averageScore >= 0) {
    return `Mostly positive trends (${goodCount}/${total} good indicators)`;
  } else if (averageScore >= -0.5) {
    return `Mixed economic signals (${badCount}/${total} concerning)`;
  } else {
    return `Challenging conditions (${badCount}/${total} indicators concerning)`;
  }
}