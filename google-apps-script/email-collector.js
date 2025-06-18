// Google Apps Script for HowsMyEconomy Email Collection
// This script receives POST requests and stores email data in a Google Sheet

// Replace this with your actual Google Sheet ID (the long string between /d/ and /edit in the URL)
const SPREADSHEET_ID = '1c2ixD-oniWWWocj14kcagV6Ok5mXxzXv-NMIZr165l4';

// Simple test function - accessible via GET request
function doGet(e) {
  const output = ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Google Apps Script is working!',
    timestamp: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID
  }));
  
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Get the specific spreadsheet by ID and the first sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // If this is the first submission, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Source',
        'Frequency',
        'Page URL',
        'User Agent',
        'Name',
        'Message',
        'Feedback Type'
      ]);
    }
    
    // Add the new submission data
    sheet.appendRow([
      new Date().toISOString(),
      data.email || '',
      data.source || 'Unknown',
      data.frequency || 'Not specified',
      data.page || '',
      data.userAgent || '',
      data.name || '', // For contact form submissions
      data.message || '', // For contact form submissions
      data.feedbackType || '' // For contact form submissions
    ]);
    
    // Return success response
    const output = ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email successfully added to spreadsheet'
    }));
    
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
      
  } catch (error) {
    // Return error response
    const output = ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    }));
    
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
} 