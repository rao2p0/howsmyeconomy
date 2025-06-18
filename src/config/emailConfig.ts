// Email collection configuration
// Replace GOOGLE_APPS_SCRIPT_URL with your actual deployed Google Apps Script web app URL

export const EMAIL_CONFIG = {
  // Use the Web App URL that ends with /exec (NOT the library URL)
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx2BQ5CnZhPzo5k8GjEgg-SaxqyGX7Zg2zlVVZiEXAgb1OTPRTL9ZnVnLLBOFW0uKWmNw/exec',

  // Timeout for email submission requests (in milliseconds)
  REQUEST_TIMEOUT: 10000,
  
  // Enable/disable email collection
  ENABLED: true,
  
  // Default frequency options
  FREQUENCY_OPTIONS: [
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'major-updates', label: 'Major Updates Only' }
  ]
};

// Email validation helper
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Create submission data object
export const createSubmissionData = (
  email: string,
  source: string,
  frequency?: string,
  additionalData?: Record<string, any>
) => {
  return {
    email: email.trim().toLowerCase(),
    source,
    frequency: frequency || 'weekly',
    timestamp: new Date().toISOString(),
    page: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalData
  };
}; 