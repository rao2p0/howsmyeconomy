import { WalletMoodQuestion } from '../types';

export const walletMoodQuestions: WalletMoodQuestion[] = [
  {
    id: 'home-hunt',
    title: 'Home Hunt Helper',
    question: 'Can I afford to buy a home or keep up with rent?',
    fredSeries: ['MORTGAGE30US', 'CSUSHPINSA', 'CUSR0000SEHA', 'HOUST', 'MEHOINUSA672N', 'MSPUS']
  },
  {
    id: 'car-cost',
    title: 'Car Cost Calculator',
    question: 'Is buying or maintaining a car affordable?',
    fredSeries: ['CUSR0000SETA01', 'CUSR0000SETA02', 'CUSR0000SETB', 'TERMCBAUTO48NS', 'DAUTOSAAR']
  },
  {
    id: 'job-jolt',
    title: 'Job Jolt',
    question: 'Will I lose my job or find a better one?',
    fredSeries: ['UNRATE', 'PAYEMS', 'JTSJOL', 'JTSQUR', 'CES0500000003']
  },
  {
    id: 'grocery-gauge',
    title: 'Grocery Gauge',
    question: 'Can I afford groceries, gas, or other daily expenses?',
    fredSeries: ['CUSR0000SAF11', 'CUSR0000SETB', 'CPILFESL', 'PCEPI', 'DSPIC96']
  },
  {
    id: 'health-bill',
    title: 'Health Bill Barometer',
    question: 'Will healthcare or prescription drugs be affordable?',
    fredSeries: ['CPIMEDSL', 'PCU4461104461101', 'DHLCRC1Q027SBEA', 'ECIBEN', 'CUSR0000SEMD']
  },
  {
    id: 'tuition-tracker',
    title: 'Tuition Tracker',
    question: 'Is college or trade school affordable?',
    fredSeries: ['CUUR0000SEEB', 'SLOAS', 'CUSR0000SEEA', 'PSAVERT']
  },
  {
    id: 'nest-egg',
    title: 'Nest Egg Nugget',
    question: 'Will I be able to retire comfortably?',
    fredSeries: ['PSAVERT', 'SP500', 'DGS10', 'CPIAUCSL', 'DSPIC96']
  },
  {
    id: 'bills-breakdown',
    title: 'Bills Breakdown',
    question: 'Can I keep up with utility bills or childcare costs?',
    fredSeries: ['CUSR0000SEHF01', 'CUSR0000SEHF02', 'DSPIC96']
  },
  {
    id: 'paycheck-power',
    title: 'Paycheck Power',
    question: 'Will my wages or savings keep up with rising prices?',
    fredSeries: ['CES0500000003', 'CPIAUCSL', 'PSAVERT', 'PPIACO', 'DSPIC96']
  },
  {
    id: 'rainy-day',
    title: 'Rainy Day Radar',
    question: 'Can I handle unexpected expenses like medical bills or repairs?',
    fredSeries: ['PSAVERT', 'CPIMEDSL', 'CUSR0000SETD', 'HDTGPDUSQ163N', 'DSPIC96']
  }
];