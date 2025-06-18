import React from 'react';
import { Mail, MessageCircle, Github, Twitter, Bug, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ContactSectionProps {
  /** Show compact version for footer/sidebar use */
  compact?: boolean;
  /** Custom styling classes */
  className?: string;
}

export function ContactSection({ compact = false, className = '' }: ContactSectionProps) {
  
  const handleEmailContact = () => {
    const subject = 'HowsMyEconomy Feedback';
    const body = `Hi there!

I'm reaching out about HowsMyEconomy.com to:

[ ] Report a data error or bug
[ ] Suggest a new feature
[ ] Ask a question about the data
[ ] General feedback
[ ] Other: ___________

Details:


Best regards!`;
    
    const mailtoUrl = `mailto:feedback@howsmyeconomy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleTwitterContact = () => {
    const tweetText = `Hey @HowsMyEconomy, I have feedback about the economic data dashboard! 📊`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const handleGithubIssue = () => {
    window.open('https://github.com/rao2p0/howsmyeconomy/issues/new', '_blank');
  };

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-playful font-bold text-gray-800 mb-2">
            💬 Got Feedback?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Found an error? Have suggestions? We'd love to hear from you!
          </p>
          <div className="flex justify-center gap-2">
            <Button
              onClick={handleEmailContact}
              size="sm"
              variant="playful"
              className="gap-1 text-xs"
            >
              <Mail size={14} />
              Email
            </Button>
            <Button
              onClick={handleTwitterContact}
              size="sm"
              variant="outline"
              className="gap-1 text-xs"
            >
              <Twitter size={14} />
              Tweet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-4 border-blue-200 shadow-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-playful font-bold text-gray-800 flex items-center justify-center gap-2">
          <MessageCircle className="text-blue-600" size={28} />
          Get In Touch!
        </CardTitle>
        <p className="text-gray-600 font-medium">
          Your feedback helps make economic data more accessible for everyone
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Email Contact */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-blue-600" size={20} />
              <h4 className="font-bold text-gray-800">Email Us</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Best for detailed feedback, bug reports, or questions about the data
            </p>
            <Button
              onClick={handleEmailContact}
              variant="playful"
              className="w-full gap-2"
            >
              <Mail size={16} />
              Send Email
            </Button>
          </div>

          {/* Twitter Contact */}
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Twitter className="text-blue-600" size={20} />
              <h4 className="font-bold text-gray-800">Tweet At Us</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Quick feedback, questions, or share your thoughts publicly
            </p>
            <Button
              onClick={handleTwitterContact}
              variant="outline"
              className="w-full gap-2"
            >
              <Twitter size={16} />
              Send Tweet
            </Button>
          </div>
        </div>

        {/* GitHub Issues */}
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Github className="text-gray-700" size={20} />
            <h4 className="font-bold text-gray-800">GitHub Issues</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            For developers: Report bugs, request features, or contribute to the project
          </p>
          <Button
            onClick={handleGithubIssue}
            variant="outline"
            className="gap-2"
          >
            <Github size={16} />
            Open Issue
          </Button>
        </div>

        {/* What to Contact About */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="text-red-500" size={18} />
            We'd Love to Hear About:
          </h4>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Bug className="text-orange-500" size={14} />
              <span>Data errors or bugs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">💡</span>
              <span>Feature suggestions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">📊</span>
              <span>New economic indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">🎨</span>
              <span>UI/UX improvements</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">❓</span>
              <span>Questions about data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-500">💬</span>
              <span>General feedback</span>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium">⏰ We typically respond within 24-48 hours</p>
          <p>This is a passion project, so thank you for your patience!</p>
        </div>
      </CardContent>
    </Card>
  );
} 