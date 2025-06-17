# FRED Data Management System

This system manages and updates a local database of economic metrics pulled from the Federal Reserve Economic Data (FRED) API.

## Overview

The system consists of:
- **Schema Definition** (`schema.json`): Defines the structure and configuration for all metrics
- **Refresh Script** (`scripts/refresh_fred_data.py`): Handles data fetching, updates, and storage
- **CSV Database** (`data/fred_data.csv`): Local storage for all metric data

## Setup

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get a FRED API Key

1. Visit [FRED API](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Create a free account
3. Generate an API key

### 3. Configure API Key

Create a `.env` file in the project root:

```bash
FRED_API_KEY=your_api_key_here
```

Or set as an environment variable:

```bash
export FRED_API_KEY=your_api_key_here
```

## Usage

### Basic Usage

```bash
# Update all metrics (only fetch new data since last update)
python scripts/refresh_fred_data.py

# Force update all metrics (re-fetch all data from 2024-01-01)
python scripts/refresh_fred_data.py --force

# Update specific metrics only
python scripts/refresh_fred_data.py --metrics MORTGAGE30US,UNRATE

# Use custom file paths
python scripts/refresh_fred_data.py --csv-file data/my_data.csv --schema-file my_schema.json
```

### Command Line Options

- `--force`: Force update all data (ignore last update dates)
- `--metrics METRIC1,METRIC2`: Update only specific metrics
- `--csv-file PATH`: Path to CSV file for storing data (default: `data/fred_data.csv`)
- `--schema-file PATH`: Path to schema file (default: `schema.json`)

## Schema Configuration

The `schema.json` file defines:

### Metric Fields
- **id**: FRED series ID (e.g., `MORTGAGE30US`)
- **name**: User-friendly name for display
- **description**: Explanation of what the metric measures
- **category**: Economic category (housing, automotive, employment, etc.)
- **units**: Units of measurement
- **update_frequency**: How often FRED updates this metric
- **yay_message**: Message when metric is positive
- **meh_message**: Message when metric is neutral  
- **nay_message**: Message when metric is negative

### Adding New Metrics

To track a new metric, add it to the `metrics_to_track` array in `schema.json`:

```json
{
  "id": "NEW_SERIES_ID",
  "name": "Display Name",
  "description": "What this metric measures and why it matters",
  "category": "housing",
  "units": "Percent",
  "update_frequency": "monthly",
  "yay_message": "Good news message",
  "meh_message": "Neutral message",
  "nay_message": "Bad news message"
}
```

## Data Storage

### CSV Format

Data is stored in CSV format with these columns:

| Column | Description |
|--------|-------------|
| series_id | FRED series identifier |
| name | User-friendly metric name |
| description | Metric description |
| category | Economic category |
| units | Units of measurement |
| update_frequency | Update frequency |
| date | Data point date (YYYY-MM-DD) |
| value | Numeric value (null for missing data) |
| yay_message | Positive state message |
| meh_message | Neutral state message |
| nay_message | Negative state message |
| last_updated | Timestamp of last refresh |
| fred_title | Official FRED title |
| fred_frequency | FRED frequency code |
| fred_units | FRED units |
| fred_notes | FRED notes/description |

### Duplicate Prevention

The system automatically:
- Tracks the last update date for each metric
- Only fetches data newer than the last update
- Filters out duplicate data points
- Handles missing values gracefully

## Automation

### Weekly Updates

Set up a cron job for weekly updates:

```bash
# Add to crontab (crontab -e)
0 9 * * 1 cd /path/to/howsmyeconomy && python scripts/refresh_fred_data.py
```

### Systemd Timer (Linux)

Create `/etc/systemd/system/fred-update.service`:

```ini
[Unit]
Description=Update FRED economic data
After=network.target

[Service]
Type=oneshot
User=youruser
WorkingDirectory=/path/to/howsmyeconomy
Environment=FRED_API_KEY=your_key_here
ExecStart=/usr/bin/python scripts/refresh_fred_data.py
```

Create `/etc/systemd/system/fred-update.timer`:

```ini
[Unit]
Description=Run FRED update weekly
Requires=fred-update.service

[Timer]
OnCalendar=weekly
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start:

```bash
sudo systemctl enable fred-update.timer
sudo systemctl start fred-update.timer
```

## Error Handling

The system handles:

- **API Failures**: Logs errors and continues with other metrics
- **Rate Limiting**: Built-in delays between requests
- **Missing Data**: Handles FRED's missing value format ('.')
- **Network Issues**: Timeout handling and retries
- **Invalid Data**: Data validation and parsing errors

### Logs

All activities are logged to:
- Console output
- `fred_refresh.log` file

Log levels include INFO, WARNING, and ERROR for different types of events.

## Monitoring

### Check Last Update

```bash
# View recent log entries
tail -n 20 fred_refresh.log

# Check data freshness
python -c "
import pandas as pd
df = pd.read_csv('data/fred_data.csv')
print('Last updates by metric:')
print(df.groupby('series_id')['date'].max().sort_values(ascending=False))
"
```

### Data Quality

```bash
# Check for missing values
python -c "
import pandas as pd
df = pd.read_csv('data/fred_data.csv')
print('Missing values by metric:')
print(df.groupby('series_id')['value'].apply(lambda x: x.isnull().sum()))
"
```

## Troubleshooting

### Common Issues

1. **API Key Issues**
   ```
   ValueError: FRED_API_KEY not found in environment or .env file
   ```
   - Ensure `.env` file exists with correct key
   - Check environment variable is set

2. **Permission Errors**
   ```
   PermissionError: [Errno 13] Permission denied: 'data/fred_data.csv'
   ```
   - Check file permissions
   - Ensure data directory exists

3. **API Rate Limits**
   ```
   API request failed for SERIES_ID: 429 Too Many Requests
   ```
   - Script includes built-in rate limiting
   - Consider reducing concurrent requests

4. **Network Issues**
   ```
   API request failed for SERIES_ID: Connection timeout
   ```
   - Check internet connection
   - FRED API may be temporarily unavailable

### Recovery

If data gets corrupted:

1. **Backup existing data**:
   ```bash
   cp data/fred_data.csv data/fred_data_backup.csv
   ```

2. **Force refresh all data**:
   ```bash
   python scripts/refresh_fred_data.py --force
   ```

3. **Refresh specific problematic metrics**:
   ```bash
   python scripts/refresh_fred_data.py --force --metrics MORTGAGE30US,UNRATE
   ```

## Development

### Testing

```bash
# Test with a single metric
python scripts/refresh_fred_data.py --metrics MORTGAGE30US

# Test with force update
python scripts/refresh_fred_data.py --force --metrics UNRATE

# Test different file paths
python scripts/refresh_fred_data.py --csv-file test_data.csv --metrics MORTGAGE30US
```

### Code Structure

- `FredApiClient`: Handles API communication with rate limiting
- `FredDataManager`: Manages local data storage and updates
- `MetricInfo`: Data class for metric configuration
- `FredDataPoint`: Data class for individual observations

### Future Enhancements

Potential improvements:
- SQLite database instead of CSV
- Parallel processing for multiple metrics
- Data visualization generation
- Alert system for data quality issues
- Web dashboard for monitoring 