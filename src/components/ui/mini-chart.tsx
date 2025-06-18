import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { FredDataPoint } from '../../types';

interface MiniChartProps {
  data: FredDataPoint[];
  mood: 'good' | 'neutral' | 'bad';
  seriesName: string;
  units: string;
}

interface YearlyDataPoint {
  year: string;
  value: number;
  originalDate: string;
}

export function MiniChart({ data, mood, seriesName, units }: MiniChartProps) {
  // Process data to show yearly trends
  const yearlyData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group data by year and take the most recent point for each year
    const yearlyMap = new Map<number, FredDataPoint>();
    
    data.forEach(point => {
      const date = new Date(point.date);
      const year = date.getFullYear();
      
      // Only include data from 2020 onwards for clean yearly trend
      if (year >= 2020 && !isNaN(point.value)) {
        const existing = yearlyMap.get(year);
        if (!existing || new Date(point.date) > new Date(existing.date)) {
          yearlyMap.set(year, point);
        }
      }
    });

    // Convert to array and sort by year
    return Array.from(yearlyMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, point]) => ({
        year: year.toString(),
        value: point.value,
        originalDate: point.date
      }));
  }, [data]);

  // Determine color based on mood
  const getColor = () => {
    switch (mood) {
      case 'good': return '#22c55e';  // green-500
      case 'neutral': return '#f59e0b';  // amber-500
      case 'bad': return '#ef4444';  // red-500
      default: return '#6b7280';  // gray-500
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const value = payload[0].value;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-600">
            <span className="font-medium" style={{ color: getColor() }}>
              {typeof value === 'number' 
                ? value.toLocaleString(undefined, { 
                    minimumFractionDigits: 1, 
                    maximumFractionDigits: 2 
                  })
                : value
              }
            </span>
            {units && ` ${units}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (yearlyData.length < 2) {
    return (
      <div className="h-16 flex items-center justify-center text-xs text-gray-400">
        Insufficient data for trend
      </div>
    );
  }

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={yearlyData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            interval={'preserveStartEnd'}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getColor()}
            strokeWidth={2}
            dot={{ r: 2, fill: getColor() }}
            activeDot={{ r: 3, fill: getColor(), stroke: '#fff', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 