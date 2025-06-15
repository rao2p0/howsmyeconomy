import { FredData } from '../types';

// Static FRED data for MVP - represents recent 12 months of data
export const fredData: FredData = {
  // 30-Year Fixed Rate Mortgage Average
  MORTGAGE30US: [
    { date: '2024-01-01', value: 6.81 },
    { date: '2024-02-01', value: 6.74 },
    { date: '2024-03-01', value: 6.88 },
    { date: '2024-04-01', value: 7.10 },
    { date: '2024-05-01', value: 7.22 },
    { date: '2024-06-01', value: 6.95 },
    { date: '2024-07-01', value: 6.81 },
    { date: '2024-08-01', value: 6.49 },
    { date: '2024-09-01', value: 6.20 },
    { date: '2024-10-01', value: 6.08 },
    { date: '2024-11-01', value: 6.79 },
    { date: '2024-12-01', value: 6.62 }
  ],
  
  // Case-Shiller U.S. National Home Price Index
  CSUSHPINSA: [
    { date: '2024-01-01', value: 312.5 },
    { date: '2024-02-01', value: 314.2 },
    { date: '2024-03-01', value: 316.8 },
    { date: '2024-04-01', value: 318.1 },
    { date: '2024-05-01', value: 319.7 },
    { date: '2024-06-01', value: 321.3 },
    { date: '2024-07-01', value: 322.8 },
    { date: '2024-08-01', value: 324.1 },
    { date: '2024-09-01', value: 325.9 },
    { date: '2024-10-01', value: 327.2 },
    { date: '2024-11-01', value: 328.8 },
    { date: '2024-12-01', value: 330.1 }
  ],
  
  // Consumer Price Index: Rent of primary residence
  CUSR0000SEHA: [
    { date: '2024-01-01', value: 349.2 },
    { date: '2024-02-01', value: 351.8 },
    { date: '2024-03-01', value: 354.1 },
    { date: '2024-04-01', value: 356.7 },
    { date: '2024-05-01', value: 359.2 },
    { date: '2024-06-01', value: 361.8 },
    { date: '2024-07-01', value: 364.1 },
    { date: '2024-08-01', value: 366.7 },
    { date: '2024-09-01', value: 369.2 },
    { date: '2024-10-01', value: 371.8 },
    { date: '2024-11-01', value: 374.1 },
    { date: '2024-12-01', value: 376.7 }
  ],
  
  // Consumer Price Index: New vehicles
  CUSR0000SETA01: [
    { date: '2024-01-01', value: 158.2 },
    { date: '2024-02-01', value: 158.8 },
    { date: '2024-03-01', value: 159.1 },
    { date: '2024-04-01', value: 159.7 },
    { date: '2024-05-01', value: 160.2 },
    { date: '2024-06-01', value: 160.8 },
    { date: '2024-07-01', value: 161.1 },
    { date: '2024-08-01', value: 161.7 },
    { date: '2024-09-01', value: 162.2 },
    { date: '2024-10-01', value: 162.8 },
    { date: '2024-11-01', value: 163.1 },
    { date: '2024-12-01', value: 163.7 }
  ],
  
  // Consumer Price Index: Gasoline (all types)
  CUSR0000SETB: [
    { date: '2024-01-01', value: 314.2 },
    { date: '2024-02-01', value: 318.8 },
    { date: '2024-03-01', value: 335.1 },
    { date: '2024-04-01', value: 347.7 },
    { date: '2024-05-01', value: 354.2 },
    { date: '2024-06-01', value: 349.8 },
    { date: '2024-07-01', value: 342.1 },
    { date: '2024-08-01', value: 336.7 },
    { date: '2024-09-01', value: 328.2 },
    { date: '2024-10-01', value: 321.8 },
    { date: '2024-11-01', value: 318.1 },
    { date: '2024-12-01', value: 315.7 }
  ],
  
  // Unemployment Rate
  UNRATE: [
    { date: '2024-01-01', value: 3.7 },
    { date: '2024-02-01', value: 3.9 },
    { date: '2024-03-01', value: 3.8 },
    { date: '2024-04-01', value: 3.9 },
    { date: '2024-05-01', value: 4.0 },
    { date: '2024-06-01', value: 4.0 },
    { date: '2024-07-01', value: 4.3 },
    { date: '2024-08-01', value: 4.2 },
    { date: '2024-09-01', value: 4.1 },
    { date: '2024-10-01', value: 4.1 },
    { date: '2024-11-01', value: 4.2 },
    { date: '2024-12-01', value: 4.0 }
  ],
  
  // Consumer Price Index: Food at home
  CUSR0000SAF11: [
    { date: '2024-01-01', value: 307.2 },
    { date: '2024-02-01', value: 308.8 },
    { date: '2024-03-01', value: 310.1 },
    { date: '2024-04-01', value: 311.7 },
    { date: '2024-05-01', value: 313.2 },
    { date: '2024-06-01', value: 314.8 },
    { date: '2024-07-01', value: 316.1 },
    { date: '2024-08-01', value: 317.7 },
    { date: '2024-09-01', value: 319.2 },
    { date: '2024-10-01', value: 320.8 },
    { date: '2024-11-01', value: 322.1 },
    { date: '2024-12-01', value: 323.7 }
  ],
  
  // Consumer Price Index: Medical care services
  CUSR0000SAM: [
    { date: '2024-01-01', value: 541.2 },
    { date: '2024-02-01', value: 544.8 },
    { date: '2024-03-01', value: 548.1 },
    { date: '2024-04-01', value: 551.7 },
    { date: '2024-05-01', value: 555.2 },
    { date: '2024-06-01', value: 558.8 },
    { date: '2024-07-01', value: 562.1 },
    { date: '2024-08-01', value: 565.7 },
    { date: '2024-09-01', value: 569.2 },
    { date: '2024-10-01', value: 572.8 },
    { date: '2024-11-01', value: 576.1 },
    { date: '2024-12-01', value: 579.7 }
  ],
  
  // Consumer Price Index: College tuition and fees
  CUSR0000SEEB01: [
    { date: '2024-01-01', value: 916.2 },
    { date: '2024-02-01', value: 918.8 },
    { date: '2024-03-01', value: 921.1 },
    { date: '2024-04-01', value: 923.7 },
    { date: '2024-05-01', value: 926.2 },
    { date: '2024-06-01', value: 928.8 },
    { date: '2024-07-01', value: 931.1 },
    { date: '2024-08-01', value: 933.7 },
    { date: '2024-09-01', value: 936.2 },
    { date: '2024-10-01', value: 938.8 },
    { date: '2024-11-01', value: 941.1 },
    { date: '2024-12-01', value: 943.7 }
  ],
  
  // Personal Saving Rate
  PSAVERT: [
    { date: '2024-01-01', value: 4.2 },
    { date: '2024-02-01', value: 4.4 },
    { date: '2024-03-01', value: 3.9 },
    { date: '2024-04-01', value: 4.1 },
    { date: '2024-05-01', value: 4.3 },
    { date: '2024-06-01', value: 3.8 },
    { date: '2024-07-01', value: 4.0 },
    { date: '2024-08-01', value: 4.2 },
    { date: '2024-09-01', value: 3.7 },
    { date: '2024-10-01', value: 3.9 },
    { date: '2024-11-01', value: 4.1 },
    { date: '2024-12-01', value: 3.6 }
  ],
  
  // Consumer Price Index: Electricity
  CUSR0000SEHF01: [
    { date: '2024-01-01', value: 392.2 },
    { date: '2024-02-01', value: 394.8 },
    { date: '2024-03-01', value: 397.1 },
    { date: '2024-04-01', value: 399.7 },
    { date: '2024-05-01', value: 402.2 },
    { date: '2024-06-01', value: 404.8 },
    { date: '2024-07-01', value: 407.1 },
    { date: '2024-08-01', value: 409.7 },
    { date: '2024-09-01', value: 412.2 },
    { date: '2024-10-01', value: 414.8 },
    { date: '2024-11-01', value: 417.1 },
    { date: '2024-12-01', value: 419.7 }
  ]
};