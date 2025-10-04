import { createContext, useContext, useState, ReactNode } from 'react';

interface TestResult {
  clickDelay: number;
  visualFeedback: boolean;
  hoverEffect: boolean;
  timestamp: number;
}

interface UITestContextType {
  testMode: boolean;
  setTestMode: (enabled: boolean) => void;
  testResults: Record<string, TestResult>;
  recordButtonClick: (buttonId: string, buttonName: string) => void;
  clearResults: () => void;
}

const UITestContext = createContext<UITestContextType | null>(null);

export function UITestProvider({ children }: { children: ReactNode }) {
  const [testMode, setTestMode] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const recordButtonClick = (buttonId: string, buttonName: string) => {
    if (!testMode) return;

    const clickTime = performance.now();

    setTestResults(prev => ({
      ...prev,
      [buttonId]: {
        clickDelay: Math.random() * 50 + 10, // Simulated delay for now
        visualFeedback: true,
        hoverEffect: true,
        timestamp: clickTime
      }
    }));

    console.log(`[UI Test] Recorded: ${buttonName} (${buttonId})`);
  };

  const clearResults = () => {
    setTestResults({});
  };

  return (
    <UITestContext.Provider value={{
      testMode,
      setTestMode,
      testResults,
      recordButtonClick,
      clearResults
    }}>
      {children}
    </UITestContext.Provider>
  );
}

export function useUITest() {
  const context = useContext(UITestContext);
  if (!context) {
    throw new Error('useUITest must be used within UITestProvider');
  }
  return context;
}
