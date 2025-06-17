import { FredData } from '../types';

// Cache for loaded data to avoid re-parsing
let cachedRealData: FredData | null = null;

/**
 * Load real FRED data from CSV file and convert to expected format
 * This function reads the CSV data and transforms it into the FredData structure
 * expected by the application
 */
export async function loadRealFredData(): Promise<FredData> {
  // Return cached data if already loaded
  if (cachedRealData) {
    return cachedRealData;
  }

  try {
    // Fetch the CSV file from the public directory
    const response = await fetch('/data/fred_data.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.status}`);
    }
    
    const csvText = await response.text();
    const fredData: FredData = {};
    
    // Parse CSV (skip header row)
    const lines = csvText.trim().split('\n');
    const header = lines[0];
    
    // Verify we have the expected CSV structure
    if (!header.includes('series_id') || !header.includes('date') || !header.includes('value')) {
      throw new Error('Invalid CSV format: missing required columns');
    }
    
    // Parse each data row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV row (handle quoted fields that might contain commas)
      const fields = parseCSVRow(line);
      
      if (fields.length < 8) continue; // Skip malformed rows
      
      const seriesId = fields[0];
      const date = fields[6]; // date column
      const valueStr = fields[7]; // value column
      
      // Skip rows with missing values
      if (!valueStr || valueStr === 'null' || valueStr === '') continue;
      
      const value = parseFloat(valueStr);
      if (isNaN(value)) continue;
      
      // Initialize series array if it doesn't exist
      if (!fredData[seriesId]) {
        fredData[seriesId] = [];
      }
      
      // Add data point to series
      fredData[seriesId].push({
        date: date,
        value: value
      });
    }
    
    // Sort each series by date to ensure chronological order
    Object.keys(fredData).forEach(seriesId => {
      fredData[seriesId].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    
    // Cache the loaded data
    cachedRealData = fredData;
    
    console.log(`✅ Loaded real FRED data for ${Object.keys(fredData).length} series`);
    return fredData;
    
  } catch (error) {
    console.error('❌ Failed to load real FRED data:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load real FRED data: ${errorMessage}`);
  }
}

/**
 * Parse a CSV row handling quoted fields that might contain commas
 */
function parseCSVRow(row: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  fields.push(current.trim());
  
  return fields;
}

/**
 * Clear the cached data (useful for testing or forcing reload)
 */
export function clearRealDataCache(): void {
  cachedRealData = null;
}

/**
 * Check if real data is available for a given series
 */
export function hasRealDataForSeries(fredData: FredData, seriesId: string): boolean {
  return fredData[seriesId] && fredData[seriesId].length > 0;
}

/**
 * Get data summary for debugging
 */
export function getRealDataSummary(fredData: FredData): { [seriesId: string]: { count: number, latestDate: string, latestValue: number } } {
  const summary: { [seriesId: string]: { count: number, latestDate: string, latestValue: number } } = {};
  
  Object.entries(fredData).forEach(([seriesId, data]) => {
    if (data.length > 0) {
      const latest = data[data.length - 1];
      summary[seriesId] = {
        count: data.length,
        latestDate: latest.date,
        latestValue: latest.value
      };
    }
  });
  
  return summary;
} 