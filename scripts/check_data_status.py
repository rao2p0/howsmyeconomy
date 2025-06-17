#!/usr/bin/env python3
"""
FRED Data Status Checker

Quick utility to check the status of your local FRED data including:
- Last update dates for each metric
- Missing value counts
- Data coverage statistics
- Recent data points

Usage:
    python scripts/check_data_status.py [--csv-file PATH]
"""

import argparse
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
import json

def load_schema(schema_file: str = "schema.json") -> dict:
    """Load the schema configuration"""
    try:
        with open(schema_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load schema file: {e}")
        return {}

def check_data_status(csv_file: str = "data/fred_data.csv"):
    """Check and display data status"""
    
    # Check if file exists
    if not Path(csv_file).exists():
        print(f"❌ Data file not found: {csv_file}")
        print("Run the refresh script first: python scripts/refresh_fred_data.py")
        return
    
    # Load data
    try:
        df = pd.read_csv(csv_file)
        print(f"✅ Loaded {len(df)} records from {csv_file}")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return
    
    if df.empty:
        print("❌ No data found in CSV file")
        return
    
    # Convert date column to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Load schema for expected metrics
    schema = load_schema()
    expected_metrics = [m['id'] for m in schema.get('metrics_to_track', [])]
    
    print("\n" + "="*60)
    print("FRED DATA STATUS REPORT")
    print("="*60)
    
    # Basic statistics
    print(f"\n📊 BASIC STATISTICS")
    print(f"   Total records: {len(df):,}")
    print(f"   Unique metrics: {df['series_id'].nunique()}")
    print(f"   Date range: {df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}")
    
    # Expected vs actual metrics
    actual_metrics = set(df['series_id'].unique())
    expected_set = set(expected_metrics)
    
    print(f"\n📋 METRIC COVERAGE")
    print(f"   Expected metrics: {len(expected_set)}")
    print(f"   Actual metrics: {len(actual_metrics)}")
    
    missing_metrics = expected_set - actual_metrics
    if missing_metrics:
        print(f"   ❌ Missing metrics: {', '.join(missing_metrics)}")
    else:
        print(f"   ✅ All expected metrics present")
    
    extra_metrics = actual_metrics - expected_set
    if extra_metrics:
        print(f"   ℹ️  Extra metrics: {', '.join(extra_metrics)}")
    
    # Last update dates
    print(f"\n📅 LAST UPDATE DATES")
    last_dates = df.groupby('series_id')['date'].max().sort_values(ascending=False)
    
    now = datetime.now()
    recent_cutoff = now - timedelta(days=30)
    
    for series_id, last_date in last_dates.head(10).items():
        age_days = (now - last_date.to_pydatetime()).days
        
        if last_date.to_pydatetime() >= recent_cutoff:
            status = "✅"
        elif age_days <= 60:
            status = "⚠️"
        else:
            status = "❌"
        
        print(f"   {status} {series_id}: {last_date.strftime('%Y-%m-%d')} ({age_days} days ago)")
    
    if len(last_dates) > 10:
        print(f"   ... and {len(last_dates) - 10} more metrics")
    
    # Missing values
    print(f"\n❓ MISSING VALUES")
    missing_counts = df.groupby('series_id')['value'].apply(lambda x: x.isnull().sum())
    missing_counts = missing_counts[missing_counts > 0].sort_values(ascending=False)
    
    if missing_counts.empty:
        print("   ✅ No missing values found")
    else:
        print(f"   Found missing values in {len(missing_counts)} metrics:")
        for series_id, missing_count in missing_counts.head(5).items():
            total_points = len(df[df['series_id'] == series_id])
            percentage = (missing_count / total_points) * 100
            print(f"   ❌ {series_id}: {missing_count}/{total_points} missing ({percentage:.1f}%)")
        
        if len(missing_counts) > 5:
            print(f"   ... and {len(missing_counts) - 5} more metrics with missing values")
    
    # Data freshness by category
    print(f"\n📂 FRESHNESS BY CATEGORY")
    if 'category' in df.columns:
        category_freshness = df.groupby('category')['date'].max().sort_values(ascending=False)
        
        for category, last_date in category_freshness.items():
            age_days = (now - last_date.to_pydatetime()).days
            
            if age_days <= 7:
                status = "✅"
            elif age_days <= 30:
                status = "⚠️"
            else:
                status = "❌"
            
            print(f"   {status} {category}: {last_date.strftime('%Y-%m-%d')} ({age_days} days ago)")
    else:
        print("   ℹ️  Category information not available")
    
    # Recent activity
    print(f"\n🔄 RECENT ACTIVITY (last 7 days)")
    week_ago = now - timedelta(days=7)
    
    if 'last_updated' in df.columns:
        df['last_updated'] = pd.to_datetime(df['last_updated'])
        recent_updates = df[df['last_updated'] >= week_ago]
        
        if recent_updates.empty:
            print("   ❌ No updates in the last 7 days")
        else:
            recent_metrics = recent_updates['series_id'].unique()
            print(f"   ✅ {len(recent_metrics)} metrics updated:")
            for metric in recent_metrics[:5]:
                update_count = len(recent_updates[recent_updates['series_id'] == metric])
                print(f"      • {metric}: {update_count} new data points")
            
            if len(recent_metrics) > 5:
                print(f"      ... and {len(recent_metrics) - 5} more")
    else:
        print("   ℹ️  Update timestamp information not available")
    
    print("\n" + "="*60)
    print("End of report")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Check FRED data status')
    parser.add_argument('--csv-file', type=str, default='data/fred_data.csv',
                       help='Path to CSV file containing FRED data')
    
    args = parser.parse_args()
    check_data_status(args.csv_file)

if __name__ == "__main__":
    main() 