# HowsMyEconomy.com 🏠💰📊

Making economic data accessible and fun! A React web app that translates complex Federal Reserve economic indicators into easy-to-understand mood indicators with emojis and colors.

## ✨ Features

- **10 Economic Categories**: Housing, automotive, employment, inflation, healthcare, education, retirement, utilities, wages, and emergency fund
- **Mood-Based Scoring**: Each category gets a "Yay" 😊, "Meh" 😐, or "Nay" 😞 based on FRED economic indicators
- **Category Detail Pages**: Click any category to see individual metrics with graphs and explanations
- **Real FRED Data**: Uses actual Federal Reserve Economic Data (FRED) APIs
- **Mobile Responsive**: Works great on all devices
- **Legal Disclaimer**: Includes proper "not financial advice" disclaimers

## 🚀 Quick Start

### Running the Web App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### Setting Up Data Management

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Get a FRED API key**:
   - Visit [FRED API](https://fred.stlouisfed.org/docs/api/api_key.html)
   - Create a free account and generate an API key

3. **Configure API key**:
   ```bash
   # Create .env file
   echo "FRED_API_KEY=your_api_key_here" > .env
   ```

4. **Fetch initial data**:
   ```bash
   python3 scripts/refresh_fred_data.py --force
   ```

## 📊 Data Management System

We've built a comprehensive FRED data management system that:

- **Maintains Local Database**: Stores all economic metrics in CSV format
- **Prevents Duplicates**: Only fetches new data since last update
- **Handles Errors Gracefully**: API failures, rate limits, missing data
- **Supports Automation**: Weekly cron jobs, systemd timers
- **Provides Monitoring**: Data status checks and quality reports

### Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/refresh_fred_data.py` | Fetch and update FRED data |
| `scripts/check_data_status.py` | Monitor data quality and freshness |
| `scripts/validate_schema.py` | Validate schema configuration |

### Usage Examples

**Prerequisites**: Create `.env` file in project root with your FRED API key:
```bash
echo "FRED_API_KEY=your_fred_api_key_here" > .env
```

**Run from project root**:
```bash
# Update all metrics (incremental)
python3 scripts/refresh_fred_data.py

# Force refresh all data from Jan 2024
python3 scripts/refresh_fred_data.py --force

# Update specific metrics only
python3 scripts/refresh_fred_data.py --metrics MORTGAGE30US,UNRATE

# Check data status
python3 scripts/check_data_status.py

# Validate schema
python3 scripts/validate_schema.py
```

**Alternative (run from scripts directory)**:
```bash
cd scripts
python3 refresh_fred_data.py
```

📖 **[Full Data Management Documentation](DATA_MANAGEMENT.md)**

## 🏗️ Tech Stack

**Frontend:**
- **React + TypeScript**: Component-based UI with type safety
- **Vite**: Fast development and building
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components
- **React Router**: Client-side routing
- **Lucide Icons**: Consistent iconography

**Data Management:**
- **Python 3.7+**: Data processing and API integration
- **pandas**: Data manipulation and analysis
- **requests**: HTTP client for FRED API
- **CSV Storage**: Simple, portable data format

**Deployment:**
- **Static hosting ready**: Builds to static files
- **GitHub Pages compatible**
- **Vercel/Netlify ready**

## 📁 Project Structure

```
howsmyeconomy/
├── src/                          # React application
│   ├── components/              # UI components
│   ├── data/                    # Static data files
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript definitions
├── scripts/                     # Python data management
│   ├── refresh_fred_data.py     # Main data refresh script
│   ├── check_data_status.py     # Data monitoring
│   └── validate_schema.py       # Schema validation
├── data/                        # Local data storage
│   └── fred_data.csv           # FRED economic data
├── schema.json                  # Data schema definition
├── requirements.txt             # Python dependencies
└── DATA_MANAGEMENT.md          # Data system docs
```

## 🎯 Economic Categories & Metrics

| Category | Metrics | Examples |
|----------|---------|----------|
| **Housing** | 5 metrics | Mortgage rates, home prices, rent costs, housing starts, income |
| **Automotive** | 5 metrics | New/used car prices, gas prices, auto loans, vehicle sales |
| **Employment** | 5 metrics | Unemployment rate, job openings, payroll growth, quit rates, wages |
| **Inflation** | 6 metrics | Food prices, core inflation, PCE index, CPI, producer prices, real income |
| **Healthcare** | 5 metrics | Medical care, hospital services, prescription drugs, health benefits |
| **Education** | 5 metrics | College tuition, childcare, K-12 costs, technical school, student loans |
| **Retirement** | 2 metrics | S&P 500 index, 10-year Treasury rates |
| **Utilities** | 3 metrics | Electricity costs, natural gas prices, retail energy prices |
| **Wages** | 3 metrics | Hourly earnings, household income, disposable income |
| **Emergency Fund** | 3 metrics | Personal saving rate, repair costs, household debt levels |

**Total: 39 comprehensive economic indicators** covering all major aspects of household financial wellbeing.

Each metric includes:
- **Real-time data** from FRED API
- **Mood scoring** (Yay/Meh/Nay) with specific thresholds
- **User-friendly explanations** of what the data means
- **Contextual messages** for each mood state

## 🔧 Configuration

### Schema Configuration

Economic metrics are defined in `schema.json`:

```json
{
  "id": "MORTGAGE30US",
  "name": "30-Year Fixed Mortgage Rate",
  "description": "Average interest rate for 30-year fixed-rate mortgages...",
  "category": "housing",
  "units": "Percent",
  "update_frequency": "weekly",
  "yay_message": "Mortgage rates are favorable for home buyers",
  "meh_message": "Mortgage rates are stable but not ideal", 
  "nay_message": "High mortgage rates are hurting affordability"
}
```

### Mood Scoring Rules

According to a memory from a past conversation, the project follows specific mood scoring rules defined in `mood_score_system.md`:
- Individual metrics: +1 (Yay), 0 (Meh), -1 (Nay)
- Overall category mood: Average of metric scores
- Thresholds: +0.5+ = Yay, -0.5 to +0.5 = Meh, <-0.5 = Nay

## 🤖 Automation

### Weekly Updates

Set up automatic data updates:

```bash
# Add to crontab (crontab -e)
0 9 * * 1 cd /path/to/howsmyeconomy && python3 scripts/refresh_fred_data.py
```

### Monitoring

Check data health:

```bash
# View data status
python3 scripts/check_data_status.py

# Check logs
tail -f fred_refresh.log
```

## 📱 Responsive Design

The app works seamlessly across devices:
- **Desktop**: Full feature set with hover states
- **Tablet**: Optimized layout with touch-friendly controls  
- **Mobile**: Streamlined interface with easy navigation

## 🛡️ Legal & Compliance

- **Disclaimer page** (`/disclaimer`) with proper legal language
- **"Not financial advice"** warnings throughout
- **Educational purpose** clearly stated
- **FRED data attribution** and transparency
- **Professional consultation** guidance

## 🚧 Development

### Adding New Metrics

1. Add metric to `schema.json`
2. Validate schema: `python3 scripts/validate_schema.py`
3. Fetch data: `python3 scripts/refresh_fred_data.py --metrics NEW_METRIC`
4. Update frontend if needed

### Testing

```bash
# Test specific metrics
python3 scripts/refresh_fred_data.py --metrics MORTGAGE30US

# Validate schema changes
python3 scripts/validate_schema.py

# Check data quality
python3 scripts/check_data_status.py
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/howsmyeconomy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/howsmyeconomy/discussions)
- **Documentation**: See [DATA_MANAGEMENT.md](DATA_MANAGEMENT.md) for detailed data system docs

---

*Making economics accessible, one emoji at a time! 📊😊*
