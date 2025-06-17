/**
 * Data source configuration for the application
 * This allows easy switching between mock data and real FRED data
 */

export type DataSourceType = 'mock' | 'real';

/**
 * Configuration for the data source
 * 
 * To switch data sources:
 * - 'mock': Uses simulated data from mockFredData.ts (good for development/testing)
 * - 'real': Uses real FRED data from the CSV file (production use)
 */
export const DATA_SOURCE_CONFIG = {
  // Main toggle - change this to switch between data sources
  USE_REAL_DATA: true, // Set to true to use real FRED data
  
  // Fallback behavior when real data fails to load
  FALLBACK_TO_MOCK_ON_ERROR: true,
  
  // Debug mode - logs data source information
  DEBUG_DATA_SOURCE: true,
  
  // Cache real data after first load
  CACHE_REAL_DATA: true
} as const;

/**
 * Get the current data source type
 */
export function getDataSourceType(): DataSourceType {
  return DATA_SOURCE_CONFIG.USE_REAL_DATA ? 'real' : 'mock';
}

/**
 * Check if we should use real data
 */
export function shouldUseRealData(): boolean {
  return DATA_SOURCE_CONFIG.USE_REAL_DATA;
}

/**
 * Check if we should fallback to mock data on errors
 */
export function shouldFallbackToMock(): boolean {
  return DATA_SOURCE_CONFIG.FALLBACK_TO_MOCK_ON_ERROR;
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return DATA_SOURCE_CONFIG.DEBUG_DATA_SOURCE;
}

/**
 * Log data source information (only in debug mode)
 */
export function logDataSourceInfo(message: string): void {
  if (isDebugMode()) {
    console.log(`[DATA SOURCE] ${message}`);
  }
}

/**
 * Environment-based configuration override
 * Allows setting data source via environment variables
 */
export function getDataSourceFromEnvironment(): DataSourceType | null {
  // Check for environment variable (useful for different environments)
  if (typeof window !== 'undefined') {
    // Browser environment - check localStorage for override
    const stored = localStorage.getItem('FRED_DATA_SOURCE');
    if (stored === 'real' || stored === 'mock') {
      return stored as DataSourceType;
    }
  }
  
  // Check for URL parameter override (useful for testing)
  if (typeof window !== 'undefined' && window.location) {
    const urlParams = new URLSearchParams(window.location.search);
    const dataSource = urlParams.get('dataSource');
    if (dataSource === 'real' || dataSource === 'mock') {
      return dataSource as DataSourceType;
    }
  }
  
  return null;
}

/**
 * Get the effective data source (considering environment overrides)
 */
export function getEffectiveDataSource(): DataSourceType {
  const envOverride = getDataSourceFromEnvironment();
  if (envOverride) {
    logDataSourceInfo(`Using environment override: ${envOverride}`);
    return envOverride;
  }
  
  const configSource = getDataSourceType();
  logDataSourceInfo(`Using config default: ${configSource}`);
  return configSource;
} 