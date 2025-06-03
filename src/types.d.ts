
// Global type definitions
interface Window {
  manualVocabSync?: () => Promise<void>;
  gtag?: (command: string, target: string, config?: any) => void;
}

