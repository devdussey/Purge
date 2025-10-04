import {useState} from 'react';
import { FileText, Download, Trash2, RefreshCw } from 'lucide-react';

export function LogViewer() {
  const [logs] = useState([
    { time: '10:45 AM', type: 'INFO', message: 'Quick scan completed successfully' },
    { time: '10:30 AM', type: 'WARNING', message: 'Suspicious file detected in Downloads' },
    { time: '10:15 AM', type: 'INFO', message: 'Virus definitions updated' },
    { time: '09:45 AM', type: 'ERROR', message: 'Failed to connect to update server' },
    { time: '09:30 AM', type: 'INFO', message: 'Real-time protection enabled' },
  ]);

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'text-primary-400 bg-primary-950';
      case 'WARNING':
        return 'text-yellow-400 bg-yellow-950';
      case 'ERROR':
        return 'text-red-400 bg-red-950';
      default:
        return 'text-gray-400 bg-dark-800';
    }
  };

  return (
    <div className="bg-dark-900 rounded-lg shadow-lg border border-dark-700">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-white">Activity Log</h2>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-primary-700 rounded-lg transition-colors">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center space-x-3 py-2">
              <span className="text-sm text-gray-400 w-20">{log.time}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(log.type)}`}>
                {log.type}
              </span>
              <span className="text-sm text-gray-300 flex-1">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}