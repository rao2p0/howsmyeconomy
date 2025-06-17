import schemaData from '../../schema.json';

export interface MetricSchema {
  id: string;
  name: string;
  description: string;
  category: string;
  units: string;
  update_frequency: string;
  yay_message: string;
  meh_message: string;
  nay_message: string;
}

export interface SchemaData {
  schema_version: string;
  description: string;
  fields: Record<string, any>;
  metrics_to_track: MetricSchema[];
}

// Load the schema data
export const schema: SchemaData = schemaData as SchemaData;

// Create a lookup map for quick access to metrics by ID
export const metricLookup = new Map<string, MetricSchema>();
schema.metrics_to_track.forEach(metric => {
  metricLookup.set(metric.id, metric);
});

/**
 * Get mood message for a specific metric based on its current mood state
 */
export function getMetricMoodMessage(seriesId: string, mood: 'good' | 'neutral' | 'bad'): string {
  const metric = metricLookup.get(seriesId);
  
  if (!metric) {
    // Fallback for metrics not in schema
    switch (mood) {
      case 'good': return 'This indicator is performing well';
      case 'neutral': return 'This indicator is at moderate levels';
      case 'bad': return 'This indicator is showing concerning trends';
      default: return 'No data available for this indicator';
    }
  }

  // Return the appropriate message from schema
  switch (mood) {
    case 'good': return metric.yay_message;
    case 'neutral': return metric.meh_message;
    case 'bad': return metric.nay_message;
    default: return metric.meh_message;
  }
}

/**
 * Get metric details by series ID
 */
export function getMetricDetails(seriesId: string): MetricSchema | null {
  return metricLookup.get(seriesId) || null;
}

/**
 * Get all metrics for a specific category
 */
export function getMetricsByCategory(category: string): MetricSchema[] {
  return schema.metrics_to_track.filter(metric => metric.category === category);
}

/**
 * Get friendly name for a metric
 */
export function getMetricName(seriesId: string): string {
  const metric = metricLookup.get(seriesId);
  return metric?.name || seriesId;
}

/**
 * Get description for a metric
 */
export function getMetricDescription(seriesId: string): string {
  const metric = metricLookup.get(seriesId);
  return metric?.description || 'Economic indicator from FRED database';
} 