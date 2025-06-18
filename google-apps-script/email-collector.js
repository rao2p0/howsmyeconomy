// Google Apps Script for HowsMyEconomy Email Collection
// This script receives POST requests and stores email data in a Google Sheet

// Replace this with your actual Google Sheet ID (the long string between /d/ and /edit in the URL)
const SPREADSHEET_ID = '1c2ixD-oniWWWocj14kcagV6Ok5mXxzXv-NMIZr165l4';

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
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Email successfully added to spreadsheet'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// Handle preflight OPTIONS requests for CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
} 