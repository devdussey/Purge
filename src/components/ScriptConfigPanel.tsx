import React, { useState } from 'react';
import { Settings, CreditCard as Edit3, Save, X, FolderOpen } from 'lucide-react';
import { SCRIPT_CONFIGS, ScriptConfig } from '../utils/scriptRunner';

export function ScriptConfigPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<string | null>(null);
  const [tempPath, setTempPath] = useState('');

  const handleEditScript = (scriptKey: string) => {
    setEditingScript(scriptKey);
    setTempPath(SCRIPT_CONFIGS[scriptKey].path);
  };

  const handleSaveScript = () => {
    // In a real app, you'd save this to a config file or database
    console.log(`Saving script path: ${tempPath}`);
    setEditingScript(null);
  };

  const handleCancelEdit = () => {
    setEditingScript(null);
    setTempPath('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Script Configuration</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {Object.entries(SCRIPT_CONFIGS).map(([key, config]) => (
              <div key={key} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{config.name}</h3>
                  <div className="flex items-center space-x-2">
                    {config.requiresElevation && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Requires Admin
                      </span>
                    )}
                    <button
                      onClick={() => handleEditScript(key)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{config.description}</p>
                
                {editingScript === key ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={tempPath}
                        onChange={(e) => setTempPath(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-md text-sm bg-gray-700 text-white placeholder-gray-400"
                        placeholder="Enter script path..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveScript}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Save className="h-3 w-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-600 text-gray-300 text-sm rounded-md hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-700 p-3 rounded-md">
                    <code className="text-sm text-gray-300">{config.path}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <h4 className="font-medium text-blue-400 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
              <li>Update the script paths above to match your PowerShell script locations</li>
              <li>Ensure PowerShell execution policy allows script execution</li>
              <li>For Electron app: Install electron and configure IPC handlers</li>
              <li>For web app: Set up a local backend API to execute scripts</li>
              <li>Test each script individually before using through the interface</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}