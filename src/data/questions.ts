import { WalletMoodQuestion } from '../types';

export const walletMoodQuestions: WalletMoodQuestion[] = [
  {
    id: 'home-hunt',
    title: 'Home Hunt Helper',
    question: 'Can I afford to buy a home or keep up with rent?',
    fredSeries: ['MORTGAGE30US', 'CSUSHPINSA', 'CUSR0000SEHA', 'HOUST', 'MEHOINUSA672N']
  },
  {
    id: 'car-cost',
    title: 'Car Cost Calculator',
    question: 'Is buying or maintaining a car affordable?',
    fredSeries: ['CUSR0000SETA01', 'CUSR0000SETB']
  },
  {
    id: 'job-jolt',
    title: 'Job Jolt',
    question: 'Will I lose my job or find a better one?',
    fredSeries: ['UNRATE']
  },
  {
    id: 'grocery-gauge',
    title: 'Grocery Gauge',
    question: 'Can I afford groceries, gas, or other daily expenses?',
    fredSeries: ['CUSR0000SAF11', 'CUSR0000SETB']
  },
  {
    id: 'health-bill',
    title: 'Health Bill Barometer',
    question: 'Will healthcare or prescription drugs be affordable?',
    fredSeries: ['CUSR0000SAM']
  },
  {
    id: 'tuition-tracker',
    title: 'Tuition Tracker',
    question: 'Is college or trade school affordable for me or my kids?',
    fredSeries: ['CUSR0000SEEB01']
  },
  {
    id: 'nest-egg',
    title: 'Nest Egg Nugget',
    question: 'Will I be able to retire comfortably?',
    fredSeries: ['PSAVERT']
  },
  {
    id: 'bills-breakdown',
    title: 'Bills Breakdown',
    question: 'Can I keep up with utility bills or childcare costs?',
    fredSeries: ['CUSR0000SEHF01']
  },
  {
    id: 'paycheck-power',
    title: 'Paycheck Power',
    question: 'Will my wages or savings keep up with rising prices?',
    fredSeries: ['PSAVERT']
  },
  {
    id: 'rainy-day',
    title: 'Rainy Day Radar',
    question: 'Can I handle unexpected expenses like medical bills or repairs?',
    fredSeries: ['PSAVERT', 'CUSR0000SAM']
  }
];