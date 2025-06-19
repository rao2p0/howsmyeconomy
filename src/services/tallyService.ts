// Tally.so Service for Email Collection
import { TALLY_CONFIG, openTallyForm } from '../config/tallyConfig';

export interface TallySubmissionData {
  email?: string;
  source?: string;
  frequency?: string;
  name?: string;
  message?: string;
  feedbackType?: string;
}

class TallyService {
  openSubscriptionForm(prefillData?: { email?: string; source?: string; frequency?: string }) {
    if (!TALLY_CONFIG.ENABLED) {
      console.warn('Tally forms are currently disabled');
      return;
    }

    const prefill: Record<string, string> = {};
    
    if (prefillData?.email) prefill.email = prefillData.email;
    if (prefillData?.source) prefill.source = prefillData.source;
    if (prefillData?.frequency) prefill.frequency = prefillData.frequency;
    
    // Add context data
    prefill.page = window.location.href;
    prefill.timestamp = new Date().toISOString();
    
    openTallyForm(prefill);
  }

  openContactForm(prefillData?: { email?: string; name?: string; message?: string }) {
    if (!TALLY_CONFIG.ENABLED) {
      console.warn('Tally forms are currently disabled');
      return;
    }

    const prefill: Record<string, string> = {};
    
    if (prefillData?.email) prefill.email = prefillData.email;
    if (prefillData?.name) prefill.name = prefillData.name;
    if (prefillData?.message) prefill.message = prefillData.message;
    
    // Add context data
    prefill.source = 'Contact Form';
    prefill.page = window.location.href;
    prefill.timestamp = new Date().toISOString();
    
    openTallyForm(prefill);
  }

  // Direct link method (alternative to popup)
  getFormLink(prefillData?: Record<string, string>): string {
    let formUrl = TALLY_CONFIG.FORM_URL;
    
    if (prefillData) {
      const params = new URLSearchParams();
      Object.entries(prefillData).forEach(([key, value]) => {
        params.append(key, value);
      });
      formUrl += `?${params.toString()}`;
    }
    
    return formUrl;
  }

  // Check if Tally is properly configured
  isConfigured(): boolean {
    return TALLY_CONFIG.ENABLED && TALLY_CONFIG.FORM_ID !== 'YOUR_FORM_ID';
  }
}

export const tallyService = new TallyService(); 