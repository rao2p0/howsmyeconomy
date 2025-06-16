import { Demographics, WalletMoodQuestion, ScoreResult, IndicatorMood } from '../types';
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

// Get mood score for each indicator based on question-specific rules
// Returns: +1 for Yay, 0 for Meh, -1 for Nay
function getMoodScore(questionId: string, series: string, currentValue: number, previousValue: number): number {
  // Home affordability question - specific YoY and point change rules
  if (questionId === 'home-hunt') {
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
    }
  }
  
  // Generic rules for other questions based on simple thresholds
  // For most economic indicators, lower values are better (except savings rate)
  const isHigherBetter = series === 'PSAVERT' || series === 'HOUST' || series === 'MEHOINUSA672N';
  
  if (isHigherBetter) {
    // For savings rate, housing starts, income - higher is better
    if (currentValue >= 6.0) return 1; // Yay
    if (currentValue >= 4.0) return 0; // Meh
    return -1; // Nay
  } else {
    // For prices, rates, unemployment - lower is better
    const changePercent = calculatePercentageChange(currentValue, previousValue);
    if (changePercent < -2) return 1; // Yay - significant decrease
    if (changePercent > 2) return -1; // Nay - significant increase
    return 0; // Meh - stable
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
    
    const moodScore = getMoodScore(question.id, series, currentValue, previousYearValue);
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

  // Interpret the average score:
  // +0.5 or more → Yay 🟢
  // -0.5 to +0.5 → Meh 🟡  
  // Less than -0.5 → Nay 🔴
  let emoji, mood, color, overallScore;
  
  if (averageMoodScore >= 0.5) {
    emoji = '😀';
    mood = 'Yay!';
    color = '#4CAF50';
    overallScore = 80;
  } else if (averageMoodScore >= -0.5) {
    emoji = '😐';
    mood = 'Meh';
    color = '#FF9800';
    overallScore = 50;
  } else {
    emoji = '😒';
    mood = 'Nay';
    color = '#F44336';
    overallScore = 20;
  }

  // Count indicators by mood for the doughnut chart
  const goodCount = indicatorBreakdown.filter(ind => ind.mood === 'good').length;
  const neutralCount = indicatorBreakdown.filter(ind => ind.mood === 'neutral').length;
  const badCount = indicatorBreakdown.filter(ind => ind.mood === 'bad').length;

  // Generate insight
  const insight = generateInsight(goodCount, neutralCount, badCount, averageMoodScore);

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
  goodCount: number, 
  neutralCount: number, 
  badCount: number,
  averageScore: number
): string {
  const total = goodCount + neutralCount + badCount;
  
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