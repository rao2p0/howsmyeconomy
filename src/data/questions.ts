import { WalletMoodQuestion } from '../types';

export const walletMoodQuestions: WalletMoodQuestion[] = [
  {
    id: 'home-hunt',
    title: 'Home Hunt Helper',
    question: 'Can I afford to buy a home or keep up with rent?',
    fredSeries: ['MORTGAGE30US', 'CSUSHPINSA', 'CUSR0000SEHA'],
    weights: [0.4, 0.3, 0.3],
    benchmarks: {
      excellent: 4.0,   // Mortgage rate < 4%
      good: 6.0,        // Mortgage rate < 6%
      fair: 8.0,        // Mortgage rate < 8%
      poor: 10.0        // Mortgage rate >= 8%
    }
  },
  {
    id: 'car-cost',
    title: 'Car Cost Calculator',
    question: 'Is buying or maintaining a car affordable?',
    fredSeries: ['CUSR0000SETA01', 'CUSR0000SETB'],
    weights: [0.6, 0.4],
    benchmarks: {
      excellent: 150,   // Vehicle CPI < 150
      good: 160,        // Vehicle CPI < 160
      fair: 170,        // Vehicle CPI < 170
      poor: 180         // Vehicle CPI >= 170
    }
  },
  {
    id: 'job-jolt',
    title: 'Job Jolt',
    question: 'Will I lose my job or find a better one?',
    fredSeries: ['UNRATE'],
    weights: [1.0],
    benchmarks: {
      excellent: 4.0,   // Unemployment < 4%
      good: 6.0,        // Unemployment < 6%
      fair: 8.0,        // Unemployment < 8%
      poor: 10.0        // Unemployment >= 8%
    }
  },
  {
    id: 'grocery-gauge',
    title: 'Grocery Gauge',
    question: 'Can I afford groceries, gas, or other daily expenses?',
    fredSeries: ['CUSR0000SAF11', 'CUSR0000SETB'],
    weights: [0.6, 0.4],
    benchmarks: {
      excellent: 300,   // Food CPI < 300
      good: 320,        // Food CPI < 320
      fair: 340,        // Food CPI < 340
      poor: 360         // Food CPI >= 340
    }
  },
  {
    id: 'health-bill',
    title: 'Health Bill Barometer',
    question: 'Will healthcare or prescription drugs be affordable?',
    fredSeries: ['CUSR0000SAM'],
    weights: [1.0],
    benchmarks: {
      excellent: 500,   // Medical CPI < 500
      good: 550,        // Medical CPI < 550
      fair: 600,        // Medical CPI < 600
      poor: 650         // Medical CPI >= 600
    }
  },
  {
    id: 'tuition-tracker',
    title: 'Tuition Tracker',
    question: 'Is college or trade school affordable for me or my kids?',
    fredSeries: ['CUSR0000SEEB01'],
    weights: [1.0],
    benchmarks: {
      excellent: 800,   // Tuition CPI < 800
      good: 900,        // Tuition CPI < 900
      fair: 1000,       // Tuition CPI < 1000
      poor: 1100        // Tuition CPI >= 1000
    }
  },
  {
    id: 'nest-egg',
    title: 'Nest Egg Nugget',
    question: 'Will I be able to retire comfortably?',
    fredSeries: ['PSAVERT'],
    weights: [1.0],
    benchmarks: {
      excellent: 8.0,   // Saving rate > 8%
      good: 6.0,        // Saving rate > 6%
      fair: 4.0,        // Saving rate > 4%
      poor: 2.0         // Saving rate <= 4%
    }
  },
  {
    id: 'bills-breakdown',
    title: 'Bills Breakdown',
    question: 'Can I keep up with utility bills or childcare costs?',
    fredSeries: ['CUSR0000SEHF01'],
    weights: [1.0],
    benchmarks: {
      excellent: 380,   // Electricity CPI < 380
      good: 400,        // Electricity CPI < 400
      fair: 420,        // Electricity CPI < 420
      poor: 440         // Electricity CPI >= 420
    }
  },
  {
    id: 'paycheck-power',
    title: 'Paycheck Power',
    question: 'Will my wages or savings keep up with rising prices?',
    fredSeries: ['PSAVERT'],
    weights: [1.0],
    benchmarks: {
      excellent: 6.0,   // Saving rate > 6%
      good: 4.0,        // Saving rate > 4%
      fair: 2.0,        // Saving rate > 2%
      poor: 1.0         // Saving rate <= 2%
    }
  },
  {
    id: 'rainy-day',
    title: 'Rainy Day Radar',
    question: 'Can I handle unexpected expenses like medical bills or repairs?',
    fredSeries: ['PSAVERT', 'CUSR0000SAM'],
    weights: [0.7, 0.3],
    benchmarks: {
      excellent: 8.0,   // Saving rate > 8%
      good: 6.0,        // Saving rate > 6%
      fair: 4.0,        // Saving rate > 4%
      poor: 2.0         // Saving rate <= 4%
    }
  }
];