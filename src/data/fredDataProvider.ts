import { FredData } from '../types';
import { mockFredData } from './mockFredData';
import { loadRealFredData, getRealDataSummary } from './realFredData';
import { 
  getEffectiveDataSource, 
  shouldFallbackToMock, 
  logDataSourceInfo,
  isDebugMode 
} from '../config/dataSource';

// Global cache for the current data source
let currentFredData: FredData | null = null;
let currentDataSource: 'mock' | 'real' | null = null;

/**
 * Get FRED data based on the current configuration
 * This is the main function that components should use to get economic data
 */
export async function getFredData(): Promise<FredData> {
  const targetDataSource = getEffectiveDataSource();
  
  // If we already have data for the current source, return it
  if (currentFredData && currentDataSource === targetDataSource) {
    logDataSourceInfo(`Using cached ${currentDataSource} data`);
    return currentFredData;
  }
  
  logDataSourceInfo(`Loading ${targetDataSource} data...`);
  
  try {
    if (targetDataSource === 'real') {
      // Load real FRED data
      const realData = await loadRealFredData();
      currentFredData = realData;
      currentDataSource = 'real';
      
      if (isDebugMode()) {
        const summary = getRealDataSummary(realData);
        console.log('📊 Real FRED data summary:', summary);
      }
      
      logDataSourceInfo(`✅ Successfully loaded real FRED data with ${Object.keys(realData).length} series`);
      return realData;
      
    } else {
      // Use mock data
      currentFredData = mockFredData;
      currentDataSource = 'mock';
      
      logDataSourceInfo(`✅ Using mock FRED data with ${Object.keys(mockFredData).length} series`);
      return mockFredData;
    }
    
  } catch (error) {
    console.error(`❌ Failed to load ${targetDataSource} data:`, error);
    
    if (targetDataSource === 'real' && shouldFallbackToMock()) {
      logDataSourceInfo('⚠️ Falling back to mock data due to real data load failure');
      currentFredData = mockFredData;
      currentDataSource = 'mock';
      return mockFredData;
    }
    
    throw error;
  }
}

/**
 * Force reload of data (clears cache)
 */
export async function reloadFredData(): Promise<FredData> {
  logDataSourceInfo('🔄 Force reloading FRED data...');
  currentFredData = null;
  currentDataSource = null;
  return await getFredData();
}

/**
 * Get information about the current data source
 */
export function getCurrentDataSourceInfo(): {
  source: 'mock' | 'real' | null;
  seriesCount: number;
  isLoaded: boolean;
} {
  return {
    source: currentDataSource,
    seriesCount: currentFredData ? Object.keys(currentFredData).length : 0,
    isLoaded: currentFredData !== null
  };
}

/**
 * Check if a specific series is available in the current dataset
 */
export async function isSeriesAvailable(seriesId: string): Promise<boolean> {
  try {
    const data = await getFredData();
    return data[seriesId] && data[seriesId].length > 0;
  } catch (error) {
    console.error(`Error checking series availability for ${seriesId}:`, error);
    return false;
  }
}

/**
 * Get available series IDs in the current dataset
 */
export async function getAvailableSeries(): Promise<string[]> {
  try {
    const data = await getFredData();
    return Object.keys(data).filter(seriesId => data[seriesId] && data[seriesId].length > 0);
  } catch (error) {
    console.error('Error getting available series:', error);
    return [];
  }
}

/**
 * Validate that all required series are available
 */
export async function validateRequiredSeries(requiredSeries: string[]): Promise<{
  valid: boolean;
  missing: string[];
  available: string[];
}> {
  try {
    const data = await getFredData();
    const available: string[] = [];
    const missing: string[] = [];
    
    requiredSeries.forEach(seriesId => {
      if (data[seriesId] && data[seriesId].length > 0) {
        available.push(seriesId);
      } else {
        missing.push(seriesId);
      }
    });
    
    return {
      valid: missing.length === 0,
      missing,
      available
    };
    
  } catch (error) {
    console.error('Error validating required series:', error);
    return {
      valid: false,
      missing: requiredSeries,
      available: []
    };
  }
}

/**
 * Development helper: Switch data source dynamically
 * This is useful for debugging and testing
 */
export function setDataSourceOverride(source: 'mock' | 'real' | null): void {
  if (typeof window !== 'undefined') {
    if (source) {
      localStorage.setItem('FRED_DATA_SOURCE', source);
      logDataSourceInfo(`Set data source override to: ${source}`);
    } else {
      localStorage.removeItem('FRED_DATA_SOURCE');
      logDataSourceInfo('Removed data source override');
    }
    
    // Clear cache to force reload with new source
    currentFredData = null;
    currentDataSource = null;
  }
}

/**
 * Development helper: Get debug information
 */
export async function getDebugInfo(): Promise<{
  configuredSource: 'mock' | 'real';
  effectiveSource: 'mock' | 'real';
  currentSource: 'mock' | 'real' | null;
  isLoaded: boolean;
  seriesCount: number;
  availableSeries: string[];
  dataSourceInfo: any;
}> {
  const data = await getFredData();
  const info = getCurrentDataSourceInfo();
  
  return {
    configuredSource: getEffectiveDataSource(),
    effectiveSource: getEffectiveDataSource(),
    currentSource: info.source,
    isLoaded: info.isLoaded,
    seriesCount: info.seriesCount,
    availableSeries: Object.keys(data),
    dataSourceInfo: info
  };
} 