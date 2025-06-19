// Tally.so Email Collection Configuration
// Create your form at https://tally.so and get the form ID

export const TALLY_CONFIG = {
  // Replace with your Tally form ID after creating the form
  // Format: https://tally.so/r/YOUR_FORM_ID
  FORM_ID: 'wLBdA2', // You'll get this after creating the form
  
  // Full form URL (will be constructed from FORM_ID)
  get FORM_URL() {
    return `https://tally.so/r/${this.FORM_ID}`;
  },
  
  // Popup configuration
  POPUP_CONFIG: {
    width: 500,
    height: 600,
    centered: true,
    hideScrollbars: true
  },
  
  // Enable/disable email collection
  ENABLED: true,
  
  // Default frequency options (you'll set these up in Tally)
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

// Open Tally form in popup
export const openTallyForm = (prefillData?: Record<string, string>) => {
  if (!TALLY_CONFIG.ENABLED || TALLY_CONFIG.FORM_ID === 'YOUR_FORM_ID') {
    console.error('Tally form not configured. Please set FORM_ID in tallyConfig.ts');
    return;
  }

  let formUrl = TALLY_CONFIG.FORM_URL;
  
  // Add prefill parameters if provided
  if (prefillData) {
    const params = new URLSearchParams();
    Object.entries(prefillData).forEach(([key, value]) => {
      params.append(key, value);
    });
    formUrl += `?${params.toString()}`;
  }

  const { width, height, centered } = TALLY_CONFIG.POPUP_CONFIG;
  
  const left = centered ? (window.screen.width - width) / 2 : 0;
  const top = centered ? (window.screen.height - height) / 2 : 0;
  
  const popup = window.open(
    formUrl,
    'tallyForm',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=yes`
  );
  
  if (popup) {
    popup.focus();
  } else {
    // Fallback: open in new tab if popup is blocked
    window.open(formUrl, '_blank');
  }
}; 