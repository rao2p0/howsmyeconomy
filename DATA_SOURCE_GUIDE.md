# Data Source Configuration Guide

This guide explains how to switch between using mock data and real FRED economic data in the How's My Economy application.

## Quick Toggle

To switch between data sources, edit the configuration in `src/config/dataSource.ts`:

```typescript
export const DATA_SOURCE_CONFIG = {
  // Main toggle - change this to switch between data sources
  USE_REAL_DATA: true, // Set to false to use mock data
  // ... other config options
};
```

## Data Sources

### 🔴 Mock Data (`USE_REAL_DATA: false`)
- **Purpose**: Development, testing, and demonstration
- **Source**: Simulated data from `src/data/mockFredData.ts`
- **Pros**: 
  - Fast loading
  - Consistent data for testing
  - No API dependencies
  - Works offline
- **Cons**: 
  - Not real economic data
  - Should NOT be used for actual economic analysis
- **Use Cases**: Development, testing, demos

### 🟢 Real Data (`USE_REAL_DATA: true`)
- **Purpose**: Production use with real economic indicators
- **Source**: Federal Reserve Economic Data (FRED) via CSV files
- **Pros**: 
  - Real economic data from the Federal Reserve
  - Up-to-date indicators (when data is refreshed)
  - Accurate economic analysis
- **Cons**: 
  - Requires data refresh via Python scripts
  - May have missing values for some periods
  - Depends on CSV file availability
- **Use Cases**: Production, real economic analysis

## Data Loading Process

### Real Data Loading
1. App fetches `/public/data/fred_data.csv`
2. CSV is parsed and converted to expected format
3. Data is cached for performance
4. If loading fails, falls back to mock data (configurable)

### Mock Data Loading
1. Data is imported directly from TypeScript module
2. Instant loading, no network requests

## Configuration Options

In `src/config/dataSource.ts`:

```typescript
export const DATA_SOURCE_CONFIG = {
  // Main toggle
  USE_REAL_DATA: true,
  
  // Fallback to mock if real data fails to load
  FALLBACK_TO_MOCK_ON_ERROR: true,
  
  // Show debug info in console
  DEBUG_DATA_SOURCE: true,
  
  // Cache real data after first load
  CACHE_REAL_DATA: true
};
```

## User Interface Indicators

The app shows clear indicators of which data source is active:

- **🟢 Green Banner**: "Using REAL FRED economic data"
- **🟡 Yellow Banner**: "WARNING: Using MOCK data for development"

## Data Refresh

To update real FRED data:

1. Run the Python data collection script:
   ```bash
   cd scripts
   python3 refresh_fred_data.py
   ```

2. Copy updated data to public directory:
   ```bash
   cp data/fred_data.csv public/data/fred_data.csv
   ```

3. Restart the development server or rebuild for production

## Troubleshooting

### Real Data Not Loading
1. Check if `public/data/fred_data.csv` exists
2. Verify CSV format is correct
3. Check browser console for errors
4. Ensure fallback is enabled: `FALLBACK_TO_MOCK_ON_ERROR: true`

### Performance Issues
1. Enable caching: `CACHE_REAL_DATA: true`
2. Consider using mock data for development
3. Check CSV file size

### Missing Data Values
- Some FRED series have missing values (weekends, holidays, data gaps)
- This is normal and handled by the scoring algorithm
- See `DATA_MANAGEMENT.md` for more details on data quality

## Development Workflow

**Recommended approach:**

1. **Development**: Use mock data (`USE_REAL_DATA: false`)
   - Fast iteration
   - Consistent test data
   - No dependencies

2. **Testing**: Switch to real data (`USE_REAL_DATA: true`)
   - Test with actual data
   - Verify error handling
   - Check performance

3. **Production**: Use real data with regular updates
   - Schedule data refresh scripts
   - Monitor data quality
   - Set up fallback mechanisms

## API Integration

The system is designed to be extensible. Future enhancements could include:

- Direct FRED API integration
- Real-time data updates
- Multiple data source support
- Data source health monitoring

For now, the CSV-based approach provides a reliable foundation for real economic data analysis. 