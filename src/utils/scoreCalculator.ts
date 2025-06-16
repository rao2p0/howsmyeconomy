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

  // No demographic adjustments - simplified scoring
  let adjustedScore = baseScore;

  // Ensure score stays within 0-100 range
  adjustedScore = Math.max(0, Math.min(100, adjustedScore));

  // Determine emoji, mood, and color based on simplified 3-tier system
  let emoji, mood, color;
  if (adjustedScore >= 60) {
    emoji = '🎉';
    mood = 'Yay!';
    color = '#4CAF50';
  } else if (adjustedScore >= 40) {
    emoji = '😐';
    mood = 'Meh';
    color = '#FF9800';
  } else {
    emoji = '😬';
    mood = 'Nay';
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