# 📊 Google Sheets Email Collection Setup

This guide will help you set up email collection for HowsMyEconomy using Google Sheets and Google Apps Script.

## 🎯 Overview

The system collects emails from:
- Footer subscription bar
- Contact modal subscription form  
- Contact form submissions

All data is stored in a Google Sheet that you own and control.

## 📋 Step-by-Step Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "HowsMyEconomy Email Collection"
4. Note the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the code from `google-apps-script/email-collector.js`
4. Save the project (Ctrl+S or Cmd+S)
5. Name your project "HowsMyEconomy Email Collector"

### Step 3: Deploy the Web App

1. In Apps Script, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **Web app**
4. Set the following:
   - **Description**: "HowsMyEconomy Email Collection API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click **Deploy**
6. **Copy the Web app URL** - you'll need this!
7. Click **Done**

### Step 4: Update Your App Configuration

1. Open `src/config/emailConfig.ts`
2. Replace `YOUR_SCRIPT_ID` in the `GOOGLE_APPS_SCRIPT_URL` with your actual web app URL
3. Save the file

### Step 5: Test the Integration

1. Run your development server: `npm run dev`
2. Try subscribing with a test email
3. Check your Google Sheet - you should see the data appear!

## 📊 Google Sheet Structure

Your sheet will automatically get these columns:
- **Timestamp**: When the submission was made
- **Email**: The subscriber's email address
- **Source**: Where they subscribed from (Footer, Contact Modal, etc.)
- **Frequency**: How often they want updates
- **Page URL**: What page they were on
- **User Agent**: Browser information
- **IP Address**: Not collected (privacy)

## 🔧 Configuration Options

In `src/config/emailConfig.ts` you can adjust:

```typescript
export const EMAIL_CONFIG = {
  // Your Google Apps Script URL
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  
  // Request timeout (10 seconds)
  REQUEST_TIMEOUT: 10000,
  
  // Enable/disable email collection
  ENABLED: true,
  
  // Available frequency options
  FREQUENCY_OPTIONS: [
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'major-updates', label: 'Major Updates Only' }
  ]
};
```

## 🛡️ Security & Privacy

- ✅ **No third-party services** - data goes directly to your Google Sheet
- ✅ **CORS enabled** - works from your domain
- ✅ **Input validation** - prevents spam and invalid data
- ✅ **Error handling** - graceful failures with user feedback
- ✅ **No IP collection** - respects user privacy

## 📈 Managing Your Subscribers

### Viewing Subscribers
- Open your Google Sheet to see all submissions
- Sort by timestamp, source, or frequency
- Export to CSV for external tools

### Email Campaigns
You can use the collected emails with:
- **Mailchimp** - Import CSV and create campaigns
- **ConvertKit** - Upload subscribers and automate sequences
- **Gmail** - Create mailing lists for manual updates
- **Custom solution** - Build your own email system

### Data Analysis
- Track subscription sources (Footer vs Modal)
- Monitor frequency preferences
- Analyze subscription trends over time

## 🔧 Troubleshooting

### "Subscription failed" Error
1. Check that your Google Apps Script URL is correct
2. Ensure the web app is deployed with "Anyone" access
3. Verify the script has no syntax errors
4. Check browser console for detailed error messages

### No Data Appearing in Sheet
1. Confirm the spreadsheet ID is correct
2. Check that the Apps Script is bound to the right sheet
3. Look for errors in the Apps Script execution log

### CORS Errors
1. Make sure the `doOptions` function is included in your script
2. Verify CORS headers are set correctly
3. Check that the web app allows external requests

## 🚀 Advanced Features

### Email Notifications
Add this to your Apps Script to get notified of new subscribers:

```javascript
// Add after sheet.appendRow() in doPost function
MailApp.sendEmail({
  to: 'your-email@gmail.com',
  subject: 'New HowsMyEconomy Subscriber',
  body: `New subscriber: ${data.email} from ${data.source}`
});
```

### Duplicate Prevention
Add this logic to prevent duplicate emails:

```javascript
// Check for existing email before adding
const existingEmails = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
const emailExists = existingEmails.some(row => row[0] === data.email);

if (emailExists) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Email already subscribed'
  }));
}
```

## 📞 Support

If you run into issues:
1. Check the browser console for errors
2. Review the Apps Script execution log
3. Verify all URLs and IDs are correct
4. Test with a simple email first

Your email collection system is now ready! 🎉 