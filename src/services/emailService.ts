import { EMAIL_CONFIG, isValidEmail, createSubmissionData } from '../config/emailConfig';

export interface EmailSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

export class EmailService {
  private static async makeRequest(data: any): Promise<EmailSubmissionResult> {
    if (!EMAIL_CONFIG.ENABLED) {
      return {
        success: false,
        message: 'Email collection is currently disabled',
        error: 'SERVICE_DISABLED'
      };
    }

    console.log('📧 Attempting to submit email data:', {
      url: EMAIL_CONFIG.GOOGLE_APPS_SCRIPT_URL,
      data: data
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), EMAIL_CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(EMAIL_CONFIG.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response data:', result);
      
      return {
        success: result.success || false,
        message: result.message || 'Submission completed',
        error: result.success ? undefined : result.message
      };

    } catch (error) {
      console.error('💥 Email submission error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            message: 'Request timed out. Please try again.',
            error: 'TIMEOUT'
          };
        }
        
        return {
          success: false,
          message: 'Failed to submit email. Please try again later.',
          error: error.message
        };
      }
      
      return {
        success: false,
        message: 'An unexpected error occurred.',
        error: 'UNKNOWN_ERROR'
      };
    }
  }

  static async submitSubscription(
    email: string,
    source: string,
    frequency?: string,
    additionalData?: Record<string, any>
  ): Promise<EmailSubmissionResult> {
    console.log('🎯 Starting subscription submission for:', email);

    // Validate email
    if (!email || !isValidEmail(email)) {
      console.error('❌ Invalid email:', email);
      return {
        success: false,
        message: 'Please enter a valid email address.',
        error: 'INVALID_EMAIL'
      };
    }

    // Create submission data
    const submissionData = createSubmissionData(email, source, frequency, additionalData);
    console.log('📋 Submission data prepared:', submissionData);

    // Submit to Google Sheets
    return await this.makeRequest(submissionData);
  }

  static async submitContact(
    name: string,
    email: string,
    message: string,
    feedbackType?: string
  ): Promise<EmailSubmissionResult> {
    console.log('📞 Starting contact submission for:', email);

    // Validate inputs
    if (!name || !email || !message) {
      return {
        success: false,
        message: 'Please fill in all required fields.',
        error: 'MISSING_FIELDS'
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
        error: 'INVALID_EMAIL'
      };
    }

    // Create submission data for contact form
    const submissionData = createSubmissionData(
      email,
      'Contact Form',
      undefined,
      {
        name: name.trim(),
        message: message.trim(),
        feedbackType: feedbackType || 'general'
      }
    );

    // Submit to Google Sheets
    return await this.makeRequest(submissionData);
  }
}

// Export singleton instance
export const emailService = EmailService; 