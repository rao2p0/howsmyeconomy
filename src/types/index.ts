export interface Demographics {
  ageGroup: string;
  householdIncome: string;
  geography: string;
  householdSize: number;
}

export interface FredDataPoint {
  date: string;
  value: number;
}

export interface FredData {
  [key: string]: FredDataPoint[];
}

export interface WalletMoodQuestion {
  id: string;
  title: string;
  question: string;
  fredSeries: string[];
  weights: number[];
  benchmarks: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
}

export interface IndicatorMood {
  series: string;
  mood: 'good' | 'neutral' | 'bad';
  value: number;
  name: string;
}

export interface ScoreResult {
  score: number;
  emoji: string;
  mood: string;
  insight: string;
  color: string;
  indicatorBreakdown: IndicatorMood[];
  goodCount: number;
  neutralCount: number;
  badCount: number;
}