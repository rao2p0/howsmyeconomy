import React, { useState } from 'react';
import { X, Mail, Send, Bell, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'contact' | 'subscribe';
}

export function ContactModal({ isOpen, onClose, defaultTab = 'contact' }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'subscribe'>(defaultTab);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    message: ''
  });
  const [subscribeForm, setSubscribeForm] = useState({
    email: '',
    frequency: 'weekly'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission - you'll need to implement the actual backend
      const formData = {
        ...contactForm,
        source: 'HowsMyEconomy Contact Form',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // For now, we'll use a mailto link as fallback
      const subject = `HowsMyEconomy Feedback: ${contactForm.feedbackType}`;
      const body = `Name: ${contactForm.name}
Email: ${contactForm.email}
Feedback Type: ${contactForm.feedbackType}

Message:
${contactForm.message}

---
Submitted via HowsMyEconomy contact form
Timestamp: ${new Date().toLocaleString()}`;

      const mailtoUrl = `mailto:your-email@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open mailto link
      window.location.href = mailtoUrl;

      toast({
        title: "Feedback Sent! 📧",
        description: "Thank you for your feedback. We'll get back to you soon!",
      });

      // Reset form
      setContactForm({ name: '', email: '', feedbackType: 'general', message: '' });
      setTimeout(() => onClose(), 1000);

    } catch (error) {
      toast({
        title: "Oops! Something went wrong 😞",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate subscription - you'll need to implement the actual backend
      const subscriptionData = {
        ...subscribeForm,
        source: 'HowsMyEconomy Subscription',
        timestamp: new Date().toISOString()
      };

      // For now, we'll use a mailto link to notify you of new subscribers
      const subject = `New HowsMyEconomy Subscription: ${subscribeForm.email}`;
      const body = `New subscriber details:
Email: ${subscribeForm.email}
Frequency: ${subscribeForm.frequency}

---
Subscribed via HowsMyEconomy
Timestamp: ${new Date().toLocaleString()}`;

      const mailtoUrl = `mailto:your-email@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open mailto link
      window.location.href = mailtoUrl;

      toast({
        title: "Subscribed! 🎉",
        description: "You'll receive economic updates based on your preference.",
      });

      // Reset form
      setSubscribeForm({ email: '', frequency: 'weekly' });
      setTimeout(() => onClose(), 1000);

    } catch (error) {
      toast({
        title: "Subscription failed 😞",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-blue-200 shadow-2xl bg-white">
        <CardHeader className="relative bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
          
          <CardTitle className="text-2xl font-playful font-bold text-gray-800 text-center mb-4">
            Get In Touch! 💬
          </CardTitle>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <MessageCircle size={16} className="inline mr-2" />
              Contact Us
            </button>
            <button
              onClick={() => setActiveTab('subscribe')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'subscribe'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Bell size={16} className="inline mr-2" />
              Subscribe
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeTab === 'contact' ? (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Found an error? Have suggestions? We'd love to hear from you!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What's this about?
                </label>
                <select
                  value={contactForm.feedbackType}
                  onChange={(e) => setContactForm(prev => ({ ...prev, feedbackType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General Feedback</option>
                  <option value="bug">Report a Bug/Error</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data Question</option>
                  <option value="ui">UI/UX Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send size={16} />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Get notified when new economic data is available!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={subscribeForm.email}
                  onChange={(e) => setSubscribeForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Frequency
                </label>
                <select
                  value={subscribeForm.frequency}
                  onChange={(e) => setSubscribeForm(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly Summary</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="major-updates">Major Updates Only</option>
                </select>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">What you'll receive:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>📊 Latest economic indicator updates</li>
                  <li>📈 Trend analysis and insights</li>
                  <li>🎯 Key changes in mood scores</li>
                  <li>🔍 New economic indicators added</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    Subscribe to Updates
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 