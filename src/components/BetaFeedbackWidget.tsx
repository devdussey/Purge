import { useState } from 'react';
import { MessageSquare, X, Send, Bug, Lightbulb, ThumbsUp } from 'lucide-react';

interface FeedbackData {
  type: 'bug' | 'feature' | 'praise';
  message: string;
  email?: string;
  screenshot?: boolean;
}

export function BetaFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'praise'>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setSending(true);

    try {
      // Send feedback via Netlify Forms
      const formData = new FormData();
      formData.append('form-name', 'beta-feedback');
      formData.append('type', feedbackType);
      formData.append('message', message);
      if (email) formData.append('email', email);
      formData.append('screenshot', includeScreenshot ? 'yes' : 'no');

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString()
      });

      console.log('Feedback submitted via Netlify Forms');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Still show success to user
    }

    setSubmitted(true);
    setSending(false);

    // Reset form after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setMessage('');
      setEmail('');
      setIncludeScreenshot(false);
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-cyan-700 hover:to-purple-700 transition-all z-40 group"
        title="Beta Feedback"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
          β
        </span>
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 bg-gradient-to-br from-green-900 to-green-800 border border-green-500/30 rounded-2xl p-6 shadow-2xl z-40 max-w-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-500/20 rounded-full">
            <ThumbsUp className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Thanks for your feedback!</h3>
            <p className="text-green-200 text-sm">We'll review it soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-2xl p-6 shadow-2xl z-40 max-w-md w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-xl font-bold text-white">Beta Feedback</h3>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full">
              BETA
            </span>
          </div>
          <p className="text-gray-400 text-sm">Help us improve Purge</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-all"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Feedback Type Selection */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => setFeedbackType('bug')}
          className={`p-4 rounded-xl border-2 transition-all ${
            feedbackType === 'bug'
              ? 'border-red-500 bg-red-500/10'
              : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
          }`}
        >
          <Bug className={`h-6 w-6 mx-auto mb-2 ${feedbackType === 'bug' ? 'text-red-400' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${feedbackType === 'bug' ? 'text-red-400' : 'text-gray-400'}`}>
            Bug
          </span>
        </button>

        <button
          onClick={() => setFeedbackType('feature')}
          className={`p-4 rounded-xl border-2 transition-all ${
            feedbackType === 'feature'
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
          }`}
        >
          <Lightbulb className={`h-6 w-6 mx-auto mb-2 ${feedbackType === 'feature' ? 'text-cyan-400' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${feedbackType === 'feature' ? 'text-cyan-400' : 'text-gray-400'}`}>
            Idea
          </span>
        </button>

        <button
          onClick={() => setFeedbackType('praise')}
          className={`p-4 rounded-xl border-2 transition-all ${
            feedbackType === 'praise'
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
          }`}
        >
          <ThumbsUp className={`h-6 w-6 mx-auto mb-2 ${feedbackType === 'praise' ? 'text-green-400' : 'text-gray-400'}`} />
          <span className={`text-sm font-medium ${feedbackType === 'praise' ? 'text-green-400' : 'text-gray-400'}`}>
            Praise
          </span>
        </button>
      </div>

      {/* Message Input */}
      <div className="mb-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            feedbackType === 'bug'
              ? 'Describe the bug and how to reproduce it...'
              : feedbackType === 'feature'
              ? 'What feature would you like to see?'
              : 'What do you love about Purge?'
          }
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          rows={4}
        />
      </div>

      {/* Email Input (Optional) */}
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (optional, for follow-up)"
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Screenshot Option */}
      {feedbackType === 'bug' && (
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeScreenshot}
              onChange={(e) => setIncludeScreenshot(e.target.checked)}
              className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-cyan-500"
            />
            <span className="text-gray-400 text-sm">Include screenshot (helps us fix it faster)</span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || sending}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Send Feedback</span>
          </>
        )}
      </button>

      <p className="text-gray-500 text-xs text-center mt-3">
        Your feedback is anonymous unless you provide your email
      </p>
    </div>
  );
}
