// FRED API utilities for fetching real economic data
// Note: This is a client-side implementation. In production, you'd want to use a backend service
// to avoid exposing API keys and handle CORS issues.

export interface FredApiResponse {
  observations: Array<{
    date: string;
    value: string;
  }>;
}

// For now, we'll use a proxy service or mock the API calls
// In a real implementation, you'd need to set up a backend service to call FRED API
export async function fetchFredSeries(seriesId: string, startDate: string): Promise<FredApiResponse> {
  // This would be replaced with actual FRED API calls through a backend service
  // For now, we'll return the static data but structured as if from API
  
  // Mock response structure - in reality this would come from:
  // https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&start_date=${startDate}
  
  throw new Error('FRED API integration requires backend service to avoid CORS and API key exposure');
}

// Helper to get date range for fetching (current date minus 24 months for YoY calculations)
export function getFredDateRange(): { startDate: string; endDate: string } {
  const currentDate = new Date();
  const startDate = new Date(currentDate);
  startDate.setMonth(startDate.getMonth() - 24); // Get 24 months of data for proper YoY
  
  return {
    startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
    endDate: currentDate.toISOString().split('T')[0]
  };
}