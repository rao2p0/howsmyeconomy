import { Demographics, WalletMoodQuestion, ScoreResult, FredData } from '../types';
import { fredData } from '../data/fredData';

export function calculateScore(
  question: WalletMoodQuestion,
  demographics: Demographics
): ScoreResult {
  // Get the most recent data point for each series
  const latestValues = question.fredSeries.map(series => {
    const data = fredData[series];
    if (!data || data.length === 0) return 0;
    return data[data.length - 1].value;
  });

  // Calculate weighted average
  let weightedSum = 0;
  for (let i = 0; i < latestValues.length; i++) {
    weightedSum += latestValues[i] * question.weights[i];
  }

  // Normalize to 0-100 scale based on benchmarks
  let baseScore = 0;
  const { excellent, good, fair, poor } = question.benchmarks;

  // For most questions, lower values are better (except for savings rate)
  const isHigherBetter = question.id === 'nest-egg' || question.id === 'paycheck-power' || question.id === 'rainy-day';
  
  if (isHigherBetter) {
    if (weightedSum >= excellent) baseScore = 90;
    else if (weightedSum >= good) baseScore = 75;
    else if (weightedSum >= fair) baseScore = 55;
    else if (weightedSum >= poor) baseScore = 25;
    else baseScore = 10;
  } else {
    if (weightedSum <= excellent) baseScore = 90;
    else if (weightedSum <= good) baseScore = 75;
    else if (weightedSum <= fair) baseScore = 55;
    else if (weightedSum <= poor) baseScore = 25;
    else baseScore = 10;
  }

  // Apply demographic adjustments
  let adjustedScore = baseScore;

  // Age adjustments
  if (demographics.ageGroup === '18-24') {
    if (question.id === 'job-jolt') adjustedScore += 5;
    if (question.id === 'nest-egg') adjustedScore -= 5;
  } else if (demographics.ageGroup === '55-64' || demographics.ageGroup === '65+') {
    if (question.id === 'nest-egg') adjustedScore += 5;
    if (question.id === 'job-jolt') adjustedScore -= 5;
  }

  // Income adjustments
  if (demographics.householdIncome === '$150K+' || demographics.householdIncome === '$100-150K') {
    adjustedScore += 10;
  } else if (demographics.householdIncome === '<$30K') {
    adjustedScore -= 10;
  }

  // Geography adjustments
  if (demographics.geography === 'California' && question.id === 'home-hunt') {
    adjustedScore -= 15;
  } else if (demographics.geography === 'New York' && question.id === 'home-hunt') {
    adjustedScore -= 10;
  }

  // Household size adjustments
  if (demographics.householdSize > 3 && question.id === 'grocery-gauge') {
    adjustedScore -= 5;
  }

  // Ensure score stays within 0-100 range
  adjustedScore = Math.max(0, Math.min(100, adjustedScore));

  // Determine emoji, mood, and color based on score
  let emoji, mood, color;
  if (adjustedScore >= 80) {
    emoji = '🥳';
    mood = 'Thriving!';
    color = '#4CAF50';
  } else if (adjustedScore >= 60) {
    emoji = '😊';
    mood = 'Solid!';
    color = '#2196F3';
  } else if (adjustedScore >= 40) {
    emoji = '😬';
    mood = 'Tight!';
    color = '#FF9800';
  } else {
    emoji = '😣';
    mood = 'Pinched!';
    color = '#F44336';
  }

  // Generate insight based on the question and latest data
  const insight = generateInsight(question, latestValues);

  return {
    score: Math.round(adjustedScore),
    emoji,
    mood,
    insight,
    color
  };
}

function generateInsight(question: WalletMoodQuestion, values: number[]): string {
  const mainValue = values[0];
  
  switch (question.id) {
    case 'home-hunt':
      return `Mortgage rates at ${mainValue.toFixed(2)}%`;
    case 'car-cost':
      return `Vehicle prices up ${((mainValue - 150) / 150 * 100).toFixed(1)}%`;
    case 'job-jolt':
      return `Unemployment at ${mainValue.toFixed(1)}%`;
    case 'grocery-gauge':
      return `Food prices up ${((mainValue - 280) / 280 * 100).toFixed(1)}%`;
    case 'health-bill':
      return `Medical costs up ${((mainValue - 450) / 450 * 100).toFixed(1)}%`;
    case 'tuition-tracker':
      return `Tuition up ${((mainValue - 700) / 700 * 100).toFixed(1)}%`;
    case 'nest-egg':
      return `Saving rate at ${mainValue.toFixed(1)}%`;
    case 'bills-breakdown':
      return `Utility costs up ${((mainValue - 350) / 350 * 100).toFixed(1)}%`;
    case 'paycheck-power':
      return `Saving rate at ${mainValue.toFixed(1)}%`;
    case 'rainy-day':
      return `Emergency fund at ${mainValue.toFixed(1)}%`;
    default:
      return 'Economic data updated';
  }
}