#!/usr/bin/env python3
"""
FRED Data Refresh Script for HowsMyEconomy.com

This script manages the local database of FRED economic metrics by:
- Fetching data from FRED API
- Checking for new data since last refresh  
- Avoiding duplicates
- Handling errors gracefully
- Saving to CSV format

Usage:
    cd scripts
    python refresh_fred_data.py [--force] [--metrics METRIC1,METRIC2]
    
Example:
    cd scripts
    python refresh_fred_data.py --force --metrics MORTGAGE30US,UNRATE
    
Note: 
    - Script should be run from the scripts/ directory
    - FRED_API_KEY should be in .env file in project root
    - Schema file (schema.json) should be in project root
"""

import os
import csv
import json
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import argparse
import logging
from dataclasses import dataclass
from pathlib import Path
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fred_refresh.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class FredDataPoint:
    """Represents a single FRED data point"""
    date: str
    value: Optional[float]

@dataclass 
class MetricInfo:
    """Metric configuration from schema"""
    id: str
    name: str
    description: str
    category: str
    units: str
    update_frequency: str
    yay_message: str
    meh_message: str
    nay_message: str

class FredApiClient:
    """FRED API client with rate limiting and error handling"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.stlouisfed.org/fred"
        self.last_request_time = 0
        self.min_request_interval = 0.1  # 100ms between requests
        
    def _rate_limit(self):
        """Ensure we don't exceed API rate limits"""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.min_request_interval:
            time.sleep(self.min_request_interval - elapsed)
        self.last_request_time = time.time()
    
    def get_series_observations(self, series_id: str, start_date: str = "2024-01-01") -> List[FredDataPoint]:
        """
        Fetch observations for a FRED series
        
        Args:
            series_id: FRED series identifier
            start_date: Start date in YYYY-MM-DD format
            
        Returns:
            List of FredDataPoint objects
        """
        self._rate_limit()
        
        url = f"{self.base_url}/series/observations"
        params = {
            'series_id': series_id,
            'api_key': self.api_key,
            'file_type': 'json',
            'observation_start': start_date,
            'sort_order': 'asc'
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            observations = data.get('observations', [])
            
            data_points = []
            for obs in observations:
                # Handle missing values (marked as '.' in FRED)
                value = None if obs['value'] == '.' else float(obs['value'])
                data_points.append(FredDataPoint(
                    date=obs['date'],
                    value=value
                ))
            
            logger.info(f"Fetched {len(data_points)} observations for {series_id}")
            return data_points
            
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed for {series_id}: {e}")
            return []
        except (KeyError, ValueError, json.JSONDecodeError) as e:
            logger.error(f"Data parsing failed for {series_id}: {e}")
            return []
    
    def get_series_metadata(self, series_id: str) -> Dict:
        """Fetch metadata for a FRED series"""
        self._rate_limit()
        
        url = f"{self.base_url}/series"
        params = {
            'series_id': series_id,
            'api_key': self.api_key,
            'file_type': 'json'
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            series_info = data.get('seriess', [])
            
            if series_info:
                return series_info[0]
            else:
                logger.warning(f"No metadata found for {series_id}")
                return {}
                
        except Exception as e:
            logger.error(f"Metadata fetch failed for {series_id}: {e}")
            return {}

class FredDataManager:
    """Manages local FRED data storage and updates"""
    
    def __init__(self, csv_file: str = "fred_data.csv", schema_file: str = "schema.json"):
        self.csv_file = Path(csv_file)
        self.schema_file = Path(schema_file)
        self.data_dir = self.csv_file.parent
        self.data_dir.mkdir(exist_ok=True)
        
    def load_schema(self) -> Dict:
        """Load the schema configuration"""
        try:
            with open(self.schema_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load schema: {e}")
            return {}
    
    def get_metrics_to_track(self) -> List[MetricInfo]:
        """Get list of metrics from schema"""
        schema = self.load_schema()
        metrics = []
        
        for metric_config in schema.get('metrics_to_track', []):
            metrics.append(MetricInfo(
                id=metric_config['id'],
                name=metric_config['name'],
                description=metric_config['description'],
                category=metric_config['category'],
                units=metric_config['units'],
                update_frequency=metric_config['update_frequency'],
                yay_message=metric_config['yay_message'],
                meh_message=metric_config['meh_message'],
                nay_message=metric_config['nay_message']
            ))
        
        return metrics
    
    def load_existing_data(self) -> pd.DataFrame:
        """Load existing data from CSV"""
        if not self.csv_file.exists():
            logger.info("No existing data file found, starting fresh")
            return pd.DataFrame()
        
        try:
            df = pd.read_csv(self.csv_file)
            logger.info(f"Loaded {len(df)} existing records")
            return df
        except Exception as e:
            logger.error(f"Failed to load existing data: {e}")
            return pd.DataFrame()
    
    def get_last_update_date(self, series_id: str, existing_data: pd.DataFrame) -> Optional[str]:
        """Get the last update date for a specific series"""
        if existing_data.empty:
            return None
            
        series_data = existing_data[existing_data['series_id'] == series_id]
        if series_data.empty:
            return None
        
        # Return the most recent date
        return series_data['date'].max()
    
    def filter_new_data(self, series_id: str, data_points: List[FredDataPoint], 
                       existing_data: pd.DataFrame) -> List[FredDataPoint]:
        """Filter out data points that already exist"""
        last_date = self.get_last_update_date(series_id, existing_data)
        
        if last_date is None:
            logger.info(f"No existing data for {series_id}, keeping all {len(data_points)} points")
            return data_points
        
        # Convert to datetime for comparison
        last_datetime = datetime.strptime(last_date, '%Y-%m-%d')
        new_points = []
        
        for point in data_points:
            point_datetime = datetime.strptime(point.date, '%Y-%m-%d')
            if point_datetime > last_datetime:
                new_points.append(point)
        
        logger.info(f"Found {len(new_points)} new data points for {series_id} since {last_date}")
        return new_points
    
    def append_data_to_csv(self, series_id: str, metric_info: MetricInfo, 
                          data_points: List[FredDataPoint], metadata: Dict):
        """Append new data points to CSV"""
        if not data_points:
            return
        
        # Prepare records for CSV
        records = []
        current_timestamp = datetime.now().isoformat()
        
        for point in data_points:
            records.append({
                'series_id': series_id,
                'name': metric_info.name,
                'description': metric_info.description,
                'category': metric_info.category,
                'units': metric_info.units,
                'update_frequency': metric_info.update_frequency,
                'date': point.date,
                'value': point.value,
                'yay_message': metric_info.yay_message,
                'meh_message': metric_info.meh_message,
                'nay_message': metric_info.nay_message,
                'last_updated': current_timestamp,
                'fred_title': metadata.get('title', ''),
                'fred_frequency': metadata.get('frequency', ''),
                'fred_units': metadata.get('units', ''),
                'fred_notes': metadata.get('notes', '')
            })
        
        # Append to CSV
        file_exists = self.csv_file.exists()
        df = pd.DataFrame(records)
        
        df.to_csv(self.csv_file, mode='a', header=not file_exists, index=False)
        logger.info(f"Appended {len(records)} records for {series_id} to {self.csv_file}")
    
    def update_metric(self, metric_info: MetricInfo, fred_client: FredApiClient, 
                     existing_data: pd.DataFrame, force_update: bool = False) -> bool:
        """
        Update a single metric
        
        Returns:
            True if successful, False otherwise
        """
        series_id = metric_info.id
        logger.info(f"Updating metric: {series_id} ({metric_info.name})")
        
        try:
            # Fetch new data
            start_date = "2024-01-01"
            if not force_update:
                last_date = self.get_last_update_date(series_id, existing_data)
                if last_date:
                    # Start from day after last update
                    last_datetime = datetime.strptime(last_date, '%Y-%m-%d')
                    start_datetime = last_datetime + timedelta(days=1)
                    start_date = start_datetime.strftime('%Y-%m-%d')
            
            # Get observations and metadata
            data_points = fred_client.get_series_observations(series_id, start_date)
            metadata = fred_client.get_series_metadata(series_id)
            
            if not data_points:
                logger.warning(f"No new data available for {series_id}")
                return True  # Not an error, just no new data
            
            # Filter for truly new data (avoid duplicates)
            if not force_update:
                data_points = self.filter_new_data(series_id, data_points, existing_data)
            
            # Save to CSV
            self.append_data_to_csv(series_id, metric_info, data_points, metadata)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to update {series_id}: {e}")
            return False

def load_api_key() -> str:
    """Load FRED API key from environment or .env file"""
    # Try environment variable first
    api_key = os.getenv('FRED_API_KEY')
    if api_key:
        return api_key
    
    # Try .env file in current directory first
    env_file = Path('.env')
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('FRED_API_KEY='):
                    return line.split('=', 1)[1].strip().strip('"\'')
    
    # Try .env file in parent directory (project root)
    parent_env_file = Path('../.env')
    if parent_env_file.exists():
        with open(parent_env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('FRED_API_KEY='):
                    return line.split('=', 1)[1].strip().strip('"\'')
    
    raise ValueError("FRED_API_KEY not found in environment or .env file (checked current directory and parent directory)")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Refresh FRED economic data')
    parser.add_argument('--force', action='store_true', 
                       help='Force update all data (ignore last update dates)')
    parser.add_argument('--metrics', type=str,
                       help='Comma-separated list of specific metrics to update')
    parser.add_argument('--csv-file', type=str, default='../data/fred_data.csv',
                       help='Path to CSV file for storing data')
    parser.add_argument('--schema-file', type=str, default='../schema.json',
                       help='Path to schema file')
    
    args = parser.parse_args()
    
    try:
        # Load API key
        api_key = load_api_key()
        logger.info("FRED API key loaded successfully")
        
        # Initialize components
        fred_client = FredApiClient(api_key)
        data_manager = FredDataManager(args.csv_file, args.schema_file)
        
        # Load existing data
        existing_data = data_manager.load_existing_data()
        
        # Get metrics to update
        all_metrics = data_manager.get_metrics_to_track()
        
        if args.metrics:
            # Filter to specific metrics
            requested_ids = [m.strip() for m in args.metrics.split(',')]
            metrics_to_update = [m for m in all_metrics if m.id in requested_ids]
            
            if not metrics_to_update:
                logger.error(f"No valid metrics found in: {requested_ids}")
                return 1
        else:
            metrics_to_update = all_metrics
        
        logger.info(f"Updating {len(metrics_to_update)} metrics...")
        
        # Update each metric
        successful_updates = 0
        failed_updates = 0
        
        for metric in metrics_to_update:
            success = data_manager.update_metric(
                metric, fred_client, existing_data, args.force
            )
            
            if success:
                successful_updates += 1
            else:
                failed_updates += 1
            
            # Small delay between metrics
            time.sleep(0.2)
        
        # Summary
        logger.info(f"Update complete: {successful_updates} successful, {failed_updates} failed")
        
        if failed_updates > 0:
            return 1
        
        return 0
        
    except Exception as e:
        logger.error(f"Script failed: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 