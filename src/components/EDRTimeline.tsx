import React, { useState, useEffect } from 'react';
import { Activity, Download, Filter, Search, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'process' | 'file' | 'registry' | 'network';
  action: string;
  details: string;
  processName?: string;
  pid?: number;
  filePath?: string;
  registryKey?: string;
  networkEndpoint?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedDetection?: string;
}

interface EDRTimelineProps {
  detectionId?: string;
  timeRange?: { start: Date; end: Date };
}

export function EDRTimeline({ detectionId, timeRange }: EDRTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  useEffect(() => {
    // Simulate loading timeline events
    const mockEvents: TimelineEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000),
        type: 'process',
        action: 'Process Created',
        details: 'Suspicious process spawned from legitimate application',
        processName: 'malware.exe',
        pid: 1234,
        severity: 'critical',
        relatedDetection: detectionId
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 280000),
        type: 'file',
        action: 'File Created',
        details: 'Executable file created in temp directory',
        filePath: 'C:\\Temp\\malware.exe',
        severity: 'high',
        relatedDetection: detectionId
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 260000),
        type: 'registry',
        action: 'Registry Modified',
        details: 'Persistence mechanism added to registry',
        registryKey: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
        severity: 'high',
        relatedDetection: detectionId
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 240000),
        type: 'network',
        action: 'Outbound Connection',
        details: 'Connection established to suspicious IP address',
        networkEndpoint: '192.168.1.100:8080',
        severity: 'medium',
        relatedDetection: detectionId
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 220000),
        type: 'file',
        action: 'File Modified',
        details: 'System file modified by malicious process',
        filePath: 'C:\\Windows\\System32\\important.dll',
        severity: 'critical',
        relatedDetection: detectionId
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, [detectionId]);

  useEffect(() => {
    let filtered = events;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.processName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.filePath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.registryKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.networkEndpoint?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, filterType, searchTerm]);

  const exportTimeline = () => {
    const exportData = {
      detectionId,
      timeRange,
      events: filteredEvents,
      exportTime: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edr-timeline-${detectionId || 'all'}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'process': return '🔄';
      case 'file': return '📁';
      case 'registry': return '🔧';
      case 'network': return '🌐';
      default: return '📋';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  return (
    <div className="bg-dark-900 rounded-lg shadow-lg border border-dark-700">
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-primary-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">EDR Timeline</h2>
              <p className="text-sm text-gray-400">
                Process tree and system activity analysis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportTimeline}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Events</option>
              <option value="process">Process Events</option>
              <option value="file">File Events</option>
              <option value="registry">Registry Events</option>
              <option value="network">Network Events</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="flex-1 px-3 py-2 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No events found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative border-l-4 pl-6 pb-4 cursor-pointer hover:bg-dark-700/50 rounded-r-lg p-3 transition-colors ${getSeverityColor(event.severity)}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="absolute -left-2 top-3 w-4 h-4 bg-dark-800 rounded-full border-2 border-current flex items-center justify-center text-xs">
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{event.action}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        event.severity === 'medium' ? 'bg-primary-900 text-primary-300' :
                        'bg-primary-950 text-primary-400'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{event.details}</p>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      {event.processName && (
                        <div>Process: <span className="font-mono">{event.processName}</span> (PID: {event.pid})</div>
                      )}
                      {event.filePath && (
                        <div>File: <span className="font-mono">{event.filePath}</span></div>
                      )}
                      {event.registryKey && (
                        <div>Registry: <span className="font-mono">{event.registryKey}</span></div>
                      )}
                      {event.networkEndpoint && (
                        <div>Network: <span className="font-mono">{event.networkEndpoint}</span></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 ml-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{event.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-dark-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Event Details</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Event ID:</span>
                    <span className="text-white ml-2 font-mono">{selectedEvent.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Timestamp:</span>
                    <span className="text-white ml-2">{selectedEvent.timestamp.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2 capitalize">{selectedEvent.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Severity:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedEvent.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      selectedEvent.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      selectedEvent.severity === 'medium' ? 'bg-primary-900 text-primary-300' :
                      'bg-primary-950 text-primary-400'
                    }`}>
                      {selectedEvent.severity}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 block mb-2">Details:</span>
                  <p className="text-white bg-black p-3 rounded-lg">{selectedEvent.details}</p>
                </div>
                
                {selectedEvent.relatedDetection && (
                  <div>
                    <span className="text-gray-400 block mb-2">Related Detection:</span>
                    <span className="text-primary-400 font-mono">{selectedEvent.relatedDetection}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}