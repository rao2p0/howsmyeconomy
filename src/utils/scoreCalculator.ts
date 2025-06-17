import { Demographics, WalletMoodQuestion, ScoreResult, IndicatorMood } from '../types';
import { getFredData } from '../data/fredDataProvider';
import { loadSchemaMetadata, getFredUrl, formatUnitsForDisplay } from './schemaMetadata';

// Mapping of FRED series to human-readable names
const seriesNames: { [key: string]: string } = {
  'MORTGAGE30US': 'Mortgage Rates',
  'CSUSHPINSA': 'Home Prices',
  'CUSR0000SEHA': 'Rent Costs',
  'HOUST': 'Housing Starts',
  'MEHOINUSA672N': 'Median Income',
  'CUSR0000SETA01': 'New Car Prices',
  'CUSR0000SETA02': 'Used Car Prices',
  'CUSR0000SETB': 'Gas Prices',
  'TERMCBAUTO48NS': 'Auto Loan Rates',
  'DAUTOSAAR': 'Domestic Auto Sales',
  'UNRATE': 'Unemployment',
  'PAYEMS': 'Job Growth',
  'JTSJOL': 'Job Openings',
  'JTSQUR': 'Quit Rate',
  'CES0500000003': 'Wages',
  'CUSR0000SAF11': 'Food Prices',
  'CPILFESL': 'Core Inflation',
  'PCEPI': 'PCE Inflation',
  'DSPIC96': 'Real Disposable Income',
  'CPIMEDSL': 'Healthcare Costs',
  'PCU4461104461101': 'Drug Wholesale Prices',
  'DHLCRC1Q027SBEA': 'Health Care Spending',
  'ECIBEN': 'Health Benefits',
  'CUSR0000SEMD': 'Medical Goods',
  'CUUR0000SEEB': 'Education & Childcare',
  'SLOAS': 'Student Loans',
  'CUSR0000SEEA': 'Educational Books',


  'PSAVERT': 'Savings Rate',
  'SP500': 'Stock Market',
  'DGS10': '10-Year Treasury',
  'CPIAUCSL': 'Inflation',
  'CUSR0000SEHF01': 'Electricity',

  'CUSR0000SEHF02': 'Gas Utilities',
  'CUUR0000SEHF01': 'Electricity Index',
  'PPIACO': 'Producer Prices',
  'CUSR0000SETD': 'Shelter Costs',
  'HDTGPDUSQ163N': 'Household Debt'
};

// Get the most recent data point for a given date
function getMostRecentDataPoint(data: any[], targetDate: Date) {
  // Find the data point for the same month/year or the closest previous one
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1; // getMonth() returns 0-11
  
  // Look for exact month match first
  const exactMatch = data.find(point => {
    const pointDate = new Date(point.date);
    return pointDate.getFullYear() === targetYear && pointDate.getMonth() + 1 === targetMonth;
  });
  
  if (exactMatch) return exactMatch;
  
  // If no exact match, find the most recent data point before the target date
  const validPoints = data.filter(point => new Date(point.date) <= targetDate);
  return validPoints[validPoints.length - 1];
}

// Get data point from exactly 12 months ago
function getYearAgoDataPoint(data: any[], currentDate: Date) {
  const yearAgo = new Date(currentDate);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  
  return getMostRecentDataPoint(data, yearAgo);
}

// Calculate percentage change between two values
function calculatePercentageChange(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

// Calculate point change between two values
function calculatePointChange(current: number, previous: number): number {
  return current - previous;
}

// Get mood score for each indicator based on comprehensive rules from the document
// Returns: +1 for Yay, 0 for Meh, -1 for Nay
function getMoodScore(questionId: string, series: string, currentValue: number, previousValue: number): number {
  const yoyChange = calculatePercentageChange(currentValue, previousValue);
  const pointChange = calculatePointChange(currentValue, previousValue);

  switch (questionId) {
    case 'home-hunt':
      switch (series) {
        case 'MORTGAGE30US':
          // ↓ > 0.5pp = Yay, ±0.5pp = Meh, ↑ > 0.5pp = Nay
          if (pointChange <= -0.5) return 1;
          if (pointChange >= 0.5) return -1;
          return 0;
        case 'CSUSHPINSA':
          // ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'CUSR0000SEHA':
          // ↓ YoY = Yay, ±2% YoY = Meh, ↑ > 2% YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'HOUST':
          // ↑ > 5% YoY = Yay, ±5% = Meh, ↓ > 5% YoY = Nay
          if (yoyChange > 5) return 1;
          if (yoyChange < -5) return -1;
          return 0;
        case 'MEHOINUSA672N':
          // ↑ > 3% YoY = Yay, ±3% = Meh, ↓ > 3% = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < -3) return -1;
          return 0;
      }
      break;

    case 'car-cost':
      switch (series) {
        case 'CUSR0000SETA01':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'CUSR0000SETA02':
          // ↓ YoY = Yay, ±3% = Meh, ↑ > 3% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'CUSR0000SETB':
          // ↓ > 5% YoY = Yay, ±5% = Meh, ↑ > 5% = Nay
          if (yoyChange < -5) return 1;
          if (yoyChange > 5) return -1;
          return 0;
        case 'TERMCBAUTO48NS':
          // ↓ > 0.5pp = Yay, ±0.5pp = Meh, ↑ > 0.5pp = Nay
          if (pointChange <= -0.5) return 1;
          if (pointChange >= 0.5) return -1;
          return 0;
        case 'DAUTOSAAR':
          // ↑ YoY = Yay, Flat = Meh, ↓ YoY = Nay
          if (yoyChange > 0) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'job-jolt':
      switch (series) {
        case 'UNRATE':
          // ↓ > 0.3pp = Yay, ±0.3pp = Meh, ↑ > 0.3pp = Nay
          if (pointChange <= -0.3) return 1;
          if (pointChange >= 0.3) return -1;
          return 0;
        case 'PAYEMS':
          // ↑ > 200k/month = Yay, ±100k = Meh, < 100k = Nay
          const monthlyChange = pointChange; // Already in thousands
          if (monthlyChange > 200) return 1;
          if (monthlyChange < 100) return -1;
          return 0;
        case 'JTSJOL':
          // ↑ > 5% YoY = Yay, Flat = Meh, ↓ > 5% = Nay
          if (yoyChange > 5) return 1;
          if (yoyChange < -5) return -1;
          return 0;
        case 'JTSQUR':
          // ↑ > 2.5% = Yay, 2%–2.5% = Meh, < 2% = Nay
          if (currentValue > 2.5) return 1;
          if (currentValue < 2.0) return -1;
          return 0;
        case 'CES0500000003':
          // ↑ > 3.5% YoY = Yay, ±1% = Meh, ↓ YoY = Nay
          if (yoyChange > 3.5) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'grocery-gauge':
      switch (series) {
        case 'CUSR0000SAF11':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'CUSR0000SETB':
          // ↓ > 5% = Yay, Flat = Meh, ↑ > 5% = Nay
          if (yoyChange < -5) return 1;
          if (yoyChange > 5) return -1;
          return 0;
        case 'CPILFESL':
          // < 2% = Yay, 2–3% = Meh, > 3% = Nay
          if (yoyChange < 2) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'PCEPI':
          // < 2% = Yay, 2–3% = Meh, > 3% = Nay
          if (yoyChange < 2) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'DSPIC96':
          // ↑ > 3% YoY = Yay, Flat = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'health-bill':
      switch (series) {
        case 'CPIMEDSL':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'PCU4461104461101':
          // ↓ YoY = Yay, ±3% = Meh, ↑ > 3% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'DHLCRC1Q027SBEA':
          // ↑ < 4% YoY = Yay, 4-6% = Meh, ↑ > 6% YoY = Nay
          if (yoyChange < 4) return 1;
          if (yoyChange > 6) return -1;
          return 0;
        case 'ECIBEN':
          // ↑ > 3% YoY = Yay, ±2% = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
        case 'CUSR0000SEMD':
          // ↓ YoY = Yay, ±3% = Meh, ↑ > 3% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 3) return -1;
          return 0;
      }
      break;

    case 'tuition-tracker':
      switch (series) {
        case 'CUUR0000SEEB':
          // ↓ YoY = Yay, Flat = Meh, ↑ > 2% YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'SLOAS':
          // ↓ YoY = Yay, Flat = Meh, ↑ YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 0) return -1;
          return 0;
        case 'CUSR0000SEEA':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;

        case 'PSAVERT':
          // > 6% = Yay, 4–6% = Meh, < 4% = Nay
          if (currentValue > 6) return 1;
          if (currentValue < 4) return -1;
          return 0;
      }
      break;

    case 'nest-egg':
      switch (series) {
        case 'PSAVERT':
          // > 6% = Yay, 4–6% = Meh, < 4% = Nay
          if (currentValue > 6) return 1;
          if (currentValue < 4) return -1;
          return 0;
        case 'SP500':
          // ↑ > 5% YoY = Yay, Flat = Meh, ↓ YoY = Nay
          if (yoyChange > 5) return 1;
          if (yoyChange < 0) return -1;
          return 0;
        case 'DGS10':
          // 3–4% = Yay, 2–3% = Meh, <2% or >4% = Nay
          if (currentValue >= 3 && currentValue <= 4) return 1;
          if (currentValue < 2 || currentValue > 4) return -1;
          return 0;
        case 'CPIAUCSL':
          // < 2% = Yay, 2–3% = Meh, > 3% = Nay
          if (yoyChange < 2) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'DSPIC96':
          // ↑ > 3% = Yay, ±1% = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'bills-breakdown':
      switch (series) {
        case 'CUSR0000SEHF01':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;

        case 'CUSR0000SEHF02':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'CUUR0000SEHF01':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'DSPIC96':
          // ↑ > 3% = Yay, Flat = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'paycheck-power':
      switch (series) {
        case 'CES0500000003':
          // ↑ > 3.5% = Yay, ±1% = Meh, ↓ YoY = Nay
          if (yoyChange > 3.5) return 1;
          if (yoyChange < 0) return -1;
          return 0;
        case 'CPIAUCSL':
          // < 2% = Yay, 2–3% = Meh, > 3% = Nay
          if (yoyChange < 2) return 1;
          if (yoyChange > 3) return -1;
          return 0;
        case 'PSAVERT':
          // > 6% = Yay, 4–6% = Meh, < 4% = Nay
          if (currentValue > 6) return 1;
          if (currentValue < 4) return -1;
          return 0;
        case 'PPIACO':
          // ↓ YoY = Yay, Flat = Meh, ↑ YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 0) return -1;
          return 0;
        case 'DSPIC96':
          // ↑ > 3% = Yay, ±1% = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;

    case 'rainy-day':
      switch (series) {
        case 'PSAVERT':
          // > 6% = Yay, 4–6% = Meh, < 4% = Nay
          if (currentValue > 6) return 1;
          if (currentValue < 4) return -1;
          return 0;
        case 'CPIMEDSL':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'CUSR0000SETD':
          // ↓ YoY = Yay, ±2% = Meh, ↑ > 2% = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 2) return -1;
          return 0;
        case 'HDTGPDUSQ163N':
          // ↓ YoY = Yay, Flat = Meh, ↑ YoY = Nay
          if (yoyChange < 0) return 1;
          if (yoyChange > 0) return -1;
          return 0;
        case 'DSPIC96':
          // ↑ > 3% = Yay, Flat = Meh, ↓ YoY = Nay
          if (yoyChange > 3) return 1;
          if (yoyChange < 0) return -1;
          return 0;
      }
      break;
  }

  // Default fallback (should not reach here with proper implementation)
  return 0;
}

// Convert mood score to mood string
function moodScoreToMood(score: number): 'good' | 'neutral' | 'bad' {
  if (score > 0) return 'good';
  if (score < 0) return 'bad';
  return 'neutral';
}

export async function calculateScore(
  question: WalletMoodQuestion,
  demographics: Demographics
): Promise<ScoreResult> {
  const currentDate = new Date(); // Use actual current date
  
  // Load FRED data (mock or real based on configuration)
  const fredData = await getFredData();
  
  // Load schema metadata for units and other info
  const schemaMetadata = await loadSchemaMetadata();
  
  // Get mood scores for each indicator
  const moodScores: number[] = [];
  const indicatorBreakdown: IndicatorMood[] = question.fredSeries.map(series => {
    const data = fredData[series];
    if (!data || data.length < 12) {
      moodScores.push(0); // Neutral if no data
      const metadata = schemaMetadata[series];
      return {
        series,
        mood: 'neutral' as const,
        value: 0,
        name: seriesNames[series] || series,
        timestamp: 'No data',
        units: metadata ? formatUnitsForDisplay(metadata.units) : '',
        fredUrl: getFredUrl(series)
      };
    }
    
    // Get current and year-ago data points based on today's date
    const currentDataPoint = getMostRecentDataPoint(data, currentDate);
    const yearAgoDataPoint = getYearAgoDataPoint(data, currentDate);
    
    if (!currentDataPoint || !yearAgoDataPoint) {
      moodScores.push(0);
      const metadata = schemaMetadata[series];
      return {
        series,
        mood: 'neutral' as const,
        value: currentDataPoint?.value || 0,
        name: seriesNames[series] || series,
        timestamp: currentDataPoint?.date || 'No data',
        units: metadata ? formatUnitsForDisplay(metadata.units) : '',
        fredUrl: getFredUrl(series)
      };
    }
    
    const currentValue = currentDataPoint.value;
    const previousValue = yearAgoDataPoint.value;
    
    const moodScore = getMoodScore(question.id, series, currentValue, previousValue);
    moodScores.push(moodScore);
    
    const metadata = schemaMetadata[series];
    return {
      series,
      mood: moodScoreToMood(moodScore),
      value: currentValue,
      name: seriesNames[series] || series,
      timestamp: currentDataPoint.date,
      units: metadata ? formatUnitsForDisplay(metadata.units) : '',
      fredUrl: getFredUrl(series)
    };
  });

  // Calculate average mood score
  const averageMoodScore = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;

  // Interpret the average score using mood_score_system.md rules:
  // +0.5 or more → Yay 🟢
  // -0.5 to +0.5 → Meh 🟡  
  // Less than -0.5 → Nay 🔴
  let emoji, mood, color;
  
  if (averageMoodScore >= 0.5) {
    emoji = '😀';
    mood = 'Yay!';
    color = '#4CAF50';
  } else if (averageMoodScore >= -0.5) {
    emoji = '😐';
    mood = 'Meh';
    color = '#FF9800';
  } else {
    emoji = '😒';
    mood = 'Nay';
    color = '#F44336';
  }

  // Count indicators by mood for the doughnut chart
  const goodCount = indicatorBreakdown.filter(ind => ind.mood === 'good').length;
  const neutralCount = indicatorBreakdown.filter(ind => ind.mood === 'neutral').length;
  const badCount = indicatorBreakdown.filter(ind => ind.mood === 'bad').length;

  // Generate insight
  const insight = generateInsight(goodCount, neutralCount, badCount, averageMoodScore);

  return {
    score: averageMoodScore, // Return actual averaged mood score (-1 to +1)
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