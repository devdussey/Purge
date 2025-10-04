import {useState} from 'react';
import { AlertTriangle, Send, X, FileText } from 'lucide-react';

interface FalsePositiveReporterProps {
  detection: {
    ruleId: string;
    ruleName: string;
    filePath: string;
    fileHash: string;
    severity: string;
  };
  onReport: (data: FalsePositiveReport) => void;
  onClose: () => void;
}

interface FalsePositiveReport {
  ruleId: string;
  fileHash: string;
  reason: string;
  context: string;
  userEmail?: string;
  allowContact: boolean;
}

export function FalsePositiveReporter({ detection, onReport, onClose }: FalsePositiveReporterProps) {
  const [reason, setReason] = useState('');
  const [context, setContext] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [allowContact, setAllowContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const report: FalsePositiveReport = {
        ruleId: detection.ruleId,
        fileHash: detection.fileHash,
        reason,
        context,
        userEmail: allowContact ? userEmail : undefined,
        allowContact
      };

      await onReport(report);
      onClose();
    } catch (error) {
      console.error('Failed to submit false positive report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-dark-blue-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-dark-700">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-white">Report False Positive</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Detection Info */}
          <div className="bg-dark-blue-950 p-4 rounded-lg border border-dark-700">
            <h3 className="font-medium text-white mb-3">Detection Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Rule:</span>
                <span className="text-white">{detection.ruleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rule ID:</span>
                <span className="text-white font-mono">{detection.ruleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">File:</span>
                <span className="text-white truncate ml-2">{detection.filePath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Severity:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  detection.severity === 'critical' ? 'bg-red-100 text-red-800' :
                  detection.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  detection.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-primary-950 text-primary-400'
                }`}>
                  {detection.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Why do you believe this is a false positive?
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a reason...</option>
              <option value="legitimate_software">Legitimate software</option>
              <option value="system_file">System file</option>
              <option value="development_tool">Development tool</option>
              <option value="security_tool">Security tool</option>
              <option value="custom_application">Custom application</option>
              <option value="signed_software">Digitally signed software</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              placeholder="Please provide any additional information that might help us improve our detection..."
              className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowContact"
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-700"
              />
              <label htmlFor="allowContact" className="ml-2 text-sm text-white">
                Allow us to contact you for follow-up (optional)
              </label>
            </div>

            {allowContact && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="bg-primary-900/20 border border-primary-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-primary-400 mt-0.5" />
              <div className="text-sm text-primary-300">
                <p className="font-medium mb-1">Privacy Notice</p>
                <p>
                  We will only collect the file hash, rule ID, and information you provide. 
                  We never collect file contents or personal information without explicit consent.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!reason || isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-dark-600 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}