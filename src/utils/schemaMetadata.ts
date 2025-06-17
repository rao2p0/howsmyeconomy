/**
 * Schema metadata utilities for FRED series
 * Provides access to units, descriptions, and other metadata from schema.json
 */

interface SeriesMetadata {
  name: string;
  description: string;
  units: string;
  update_frequency: string;
  category: string;
}

// Cache for schema data
let schemaCache: { [seriesId: string]: SeriesMetadata } | null = null;

/**
 * Load schema metadata from schema.json
 */
export async function loadSchemaMetadata(): Promise<{ [seriesId: string]: SeriesMetadata }> {
  if (schemaCache) {
    return schemaCache;
  }

  try {
    const response = await fetch('/schema.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.status}`);
    }
    
    const schema = await response.json();
    const metadata: { [seriesId: string]: SeriesMetadata } = {};
    
    // Extract metadata for each series
    if (schema.indicators && Array.isArray(schema.indicators)) {
      schema.indicators.forEach((indicator: any) => {
        if (indicator.id) {
          metadata[indicator.id] = {
            name: indicator.name || indicator.id,
            description: indicator.description || '',
            units: indicator.units || '',
            update_frequency: indicator.update_frequency || 'unknown',
            category: indicator.category || 'uncategorized'
          };
        }
      });
    }
    
    schemaCache = metadata;
    console.log(`✅ Loaded schema metadata for ${Object.keys(metadata).length} series`);
    return metadata;
    
  } catch (error) {
    console.error('❌ Failed to load schema metadata:', error);
    return {};
  }
}

/**
 * Get metadata for a specific FRED series
 */
export async function getSeriesMetadata(seriesId: string): Promise<SeriesMetadata | null> {
  const metadata = await loadSchemaMetadata();
  return metadata[seriesId] || null;
}

/**
 * Get FRED URL for a specific series
 */
export function getFredUrl(seriesId: string): string {
  return `https://fred.stlouisfed.org/series/${seriesId}`;
}

/**
 * Format units for display (convert technical units to user-friendly format)
 */
export function formatUnitsForDisplay(units: string): string {
  if (!units) return '';
  
  // Common unit conversions for better readability
  const unitMappings: { [key: string]: string } = {
    'Percent': '%',
    'Dollars per Hour': '$/hr',
    'Thousands of Persons': 'K persons',
    'Thousands of Units, SAAR': 'K units',
    'Millions of Units, Seasonally Adjusted Annual Rate': 'M units',
    'Billions of Dollars': '$B',
    'Billions of Dollars, Seasonally Adjusted Annual Rate': '$B',
    'Chained 2012 Dollars, SAAR': '2012$',
    '2022 CPI-U-RS Adjusted Dollars': '2022$',
    'Ratio': 'ratio'
  };
  
  // Check for exact matches first
  if (unitMappings[units]) {
    return unitMappings[units];
  }
  
  // Handle index units
  if (units.includes('Index')) {
    if (units.includes('1982')) return 'Index (1982=100)';
    if (units.includes('2000')) return 'Index (2000=100)';
    if (units.includes('2005')) return 'Index (2005=100)';
    if (units.includes('2012')) return 'Index (2012=100)';
    return 'Index';
  }
  
  // Return original if no mapping found
  return units;
} 