import { FredData } from '../types';

// Static FRED data for MVP - represents recent 24 months of data for proper YoY calculations
export const fredData: FredData = {
  // 30-Year Fixed Rate Mortgage Average
  MORTGAGE30US: [
    // 2023 data
    { date: '2023-01-01', value: 6.09 },
    { date: '2023-02-01', value: 6.32 },
    { date: '2023-03-01', value: 6.73 },
    { date: '2023-04-01', value: 6.27 },
    { date: '2023-05-01', value: 6.43 },
    { date: '2023-06-01', value: 6.71 },
    { date: '2023-07-01', value: 6.81 },
    { date: '2023-08-01', value: 7.09 },
    { date: '2023-09-01', value: 7.18 },
    { date: '2023-10-01', value: 7.63 },
    { date: '2023-11-01', value: 7.44 },
    { date: '2023-12-01', value: 6.81 },
    // 2024 data
    { date: '2024-01-01', value: 6.62 },
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
    // 2023 data
    { date: '2023-01-01', value: 295.8 },
    { date: '2023-02-01', value: 298.2 },
    { date: '2023-03-01', value: 301.1 },
    { date: '2023-04-01', value: 304.5 },
    { date: '2023-05-01', value: 307.2 },
    { date: '2023-06-01', value: 309.8 },
    { date: '2023-07-01', value: 311.9 },
    { date: '2023-08-01', value: 313.2 },
    { date: '2023-09-01', value: 314.8 },
    { date: '2023-10-01', value: 316.1 },
    { date: '2023-11-01', value: 317.5 },
    { date: '2023-12-01', value: 318.9 },
    // 2024 data
    { date: '2024-01-01', value: 320.5 },
    { date: '2024-02-01', value: 322.2 },
    { date: '2024-03-01', value: 324.8 },
    { date: '2024-04-01', value: 326.1 },
    { date: '2024-05-01', value: 327.7 },
    { date: '2024-06-01', value: 329.3 },
    { date: '2024-07-01', value: 330.8 },
    { date: '2024-08-01', value: 332.1 },
    { date: '2024-09-01', value: 333.9 },
    { date: '2024-10-01', value: 335.2 },
    { date: '2024-11-01', value: 336.8 },
    { date: '2024-12-01', value: 338.1 }
  ],
  
  // Consumer Price Index: Rent of primary residence
  CUSR0000SEHA: [
    // 2023 data
    { date: '2023-01-01', value: 332.3 },
    { date: '2023-02-01', value: 334.8 },
    { date: '2023-03-01', value: 337.1 },
    { date: '2023-04-01', value: 339.7 },
    { date: '2023-05-01', value: 342.2 },
    { date: '2023-06-01', value: 344.8 },
    { date: '2023-07-01', value: 347.1 },
    { date: '2023-08-01', value: 349.7 },
    { date: '2023-09-01', value: 352.2 },
    { date: '2023-10-01', value: 354.8 },
    { date: '2023-11-01', value: 357.1 },
    { date: '2023-12-01', value: 359.7 },
    // 2024 data
    { date: '2024-01-01', value: 362.2 },
    { date: '2024-02-01', value: 364.8 },
    { date: '2024-03-01', value: 367.1 },
    { date: '2024-04-01', value: 369.7 },
    { date: '2024-05-01', value: 372.2 },
    { date: '2024-06-01', value: 374.8 },
    { date: '2024-07-01', value: 377.1 },
    { date: '2024-08-01', value: 379.7 },
    { date: '2024-09-01', value: 382.2 },
    { date: '2024-10-01', value: 384.8 },
    { date: '2024-11-01', value: 387.1 },
    { date: '2024-12-01', value: 389.7 }
  ],

  // Housing Starts: Total: New Privately Owned Housing Units Started (thousands of units, SAAR)
  HOUST: [
    // 2023 data
    { date: '2023-01-01', value: 1309 },
    { date: '2023-02-01', value: 1450 },
    { date: '2023-03-01', value: 1420 },
    { date: '2023-04-01', value: 1401 },
    { date: '2023-05-01', value: 1631 },
    { date: '2023-06-01', value: 1434 },
    { date: '2023-07-01', value: 1452 },
    { date: '2023-08-01', value: 1283 },
    { date: '2023-09-01', value: 1358 },
    { date: '2023-10-01', value: 1372 },
    { date: '2023-11-01', value: 1560 },
    { date: '2023-12-01', value: 1460 },
    // 2024 data
    { date: '2024-01-01', value: 1331 },
    { date: '2024-02-01', value: 1521 },
    { date: '2024-03-01', value: 1321 },
    { date: '2024-04-01', value: 1360 },
    { date: '2024-05-01', value: 1277 },
    { date: '2024-06-01', value: 1353 },
    { date: '2024-07-01', value: 1238 },
    { date: '2024-08-01', value: 1142 },
    { date: '2024-09-01', value: 1354 },
    { date: '2024-10-01', value: 1311 },
    { date: '2024-11-01', value: 1289 },
    { date: '2024-12-01', value: 1499 }
  ],

  // Real Median Household Income in the United States (2022 dollars)
  MEHOINUSA672N: [
    // Annual data - using same value for all months in each year
    { date: '2023-01-01', value: 70181 },
    { date: '2023-02-01', value: 70181 },
    { date: '2023-03-01', value: 70181 },
    { date: '2023-04-01', value: 70181 },
    { date: '2023-05-01', value: 70181 },
    { date: '2023-06-01', value: 70181 },
    { date: '2023-07-01', value: 70181 },
    { date: '2023-08-01', value: 70181 },
    { date: '2023-09-01', value: 70181 },
    { date: '2023-10-01', value: 70181 },
    { date: '2023-11-01', value: 70181 },
    { date: '2023-12-01', value: 70181 },
    // 2024 estimated data (slight increase)
    { date: '2024-01-01', value: 71286 },
    { date: '2024-02-01', value: 71286 },
    { date: '2024-03-01', value: 71286 },
    { date: '2024-04-01', value: 71286 },
    { date: '2024-05-01', value: 71286 },
    { date: '2024-06-01', value: 71286 },
    { date: '2024-07-01', value: 71286 },
    { date: '2024-08-01', value: 71286 },
    { date: '2024-09-01', value: 71286 },
    { date: '2024-10-01', value: 71286 },
    { date: '2024-11-01', value: 71286 },
    { date: '2024-12-01', value: 71286 }
  ],
  
  // Consumer Price Index: New vehicles
  CUSR0000SETA01: [
    // 2023 data
    { date: '2023-01-01', value: 152.1 },
    { date: '2023-02-01', value: 152.8 },
    { date: '2023-03-01', value: 153.4 },
    { date: '2023-04-01', value: 154.1 },
    { date: '2023-05-01', value: 154.7 },
    { date: '2023-06-01', value: 155.3 },
    { date: '2023-07-01', value: 155.9 },
    { date: '2023-08-01', value: 156.4 },
    { date: '2023-09-01', value: 156.9 },
    { date: '2023-10-01', value: 157.3 },
    { date: '2023-11-01', value: 157.7 },
    { date: '2023-12-01', value: 158.0 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 322.1 },
    { date: '2023-02-01', value: 325.8 },
    { date: '2023-03-01', value: 329.4 },
    { date: '2023-04-01', value: 333.1 },
    { date: '2023-05-01', value: 336.7 },
    { date: '2023-06-01', value: 340.4 },
    { date: '2023-07-01', value: 344.0 },
    { date: '2023-08-01', value: 347.7 },
    { date: '2023-09-01', value: 351.3 },
    { date: '2023-10-01', value: 355.0 },
    { date: '2023-11-01', value: 358.6 },
    { date: '2023-12-01', value: 362.3 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 3.4 },
    { date: '2023-02-01', value: 3.6 },
    { date: '2023-03-01', value: 3.5 },
    { date: '2023-04-01', value: 3.4 },
    { date: '2023-05-01', value: 3.7 },
    { date: '2023-06-01', value: 3.6 },
    { date: '2023-07-01', value: 3.5 },
    { date: '2023-08-01', value: 3.8 },
    { date: '2023-09-01', value: 3.8 },
    { date: '2023-10-01', value: 3.9 },
    { date: '2023-11-01', value: 3.7 },
    { date: '2023-12-01', value: 3.7 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 298.1 },
    { date: '2023-02-01', value: 299.7 },
    { date: '2023-03-01', value: 301.4 },
    { date: '2023-04-01', value: 303.0 },
    { date: '2023-05-01', value: 304.6 },
    { date: '2023-06-01', value: 306.3 },
    { date: '2023-07-01', value: 307.9 },
    { date: '2023-08-01', value: 309.5 },
    { date: '2023-09-01', value: 311.2 },
    { date: '2023-10-01', value: 312.8 },
    { date: '2023-11-01', value: 314.4 },
    { date: '2023-12-01', value: 316.1 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 519.8 },
    { date: '2023-02-01', value: 522.4 },
    { date: '2023-03-01', value: 525.1 },
    { date: '2023-04-01', value: 527.7 },
    { date: '2023-05-01', value: 530.3 },
    { date: '2023-06-01', value: 533.0 },
    { date: '2023-07-01', value: 535.6 },
    { date: '2023-08-01', value: 538.2 },
    { date: '2023-09-01', value: 540.9 },
    { date: '2023-10-01', value: 543.5 },
    { date: '2023-11-01', value: 546.1 },
    { date: '2023-12-01', value: 548.8 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 891.4 },
    { date: '2023-02-01', value: 893.9 },
    { date: '2023-03-01', value: 896.5 },
    { date: '2023-04-01', value: 899.0 },
    { date: '2023-05-01', value: 901.6 },
    { date: '2023-06-01', value: 904.1 },
    { date: '2023-07-01', value: 906.7 },
    { date: '2023-08-01', value: 909.2 },
    { date: '2023-09-01', value: 911.8 },
    { date: '2023-10-01', value: 914.3 },
    { date: '2023-11-01', value: 916.9 },
    { date: '2023-12-01', value: 919.4 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 4.7 },
    { date: '2023-02-01', value: 4.5 },
    { date: '2023-03-01', value: 4.2 },
    { date: '2023-04-01', value: 4.6 },
    { date: '2023-05-01', value: 4.4 },
    { date: '2023-06-01', value: 4.1 },
    { date: '2023-07-01', value: 4.5 },
    { date: '2023-08-01', value: 4.3 },
    { date: '2023-09-01', value: 4.0 },
    { date: '2023-10-01', value: 4.4 },
    { date: '2023-11-01', value: 4.2 },
    { date: '2023-12-01', value: 3.9 },
    // 2024 data
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
    // 2023 data
    { date: '2023-01-01', value: 378.1 },
    { date: '2023-02-01', value: 380.7 },
    { date: '2023-03-01', value: 383.4 },
    { date: '2023-04-01', value: 386.0 },
    { date: '2023-05-01', value: 388.6 },
    { date: '2023-06-01', value: 391.3 },
    { date: '2023-07-01', value: 393.9 },
    { date: '2023-08-01', value: 396.5 },
    { date: '2023-09-01', value: 399.2 },
    { date: '2023-10-01', value: 401.8 },
    { date: '2023-11-01', value: 404.4 },
    { date: '2023-12-01', value: 407.1 },
    // 2024 data
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