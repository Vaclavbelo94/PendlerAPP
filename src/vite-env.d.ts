
/// <reference types="vite/client" />

// Service worker types
interface ServiceWorkerRegistration {
  sync: {
    register(tag: string): Promise<void>;
  }
}

interface SyncManager {
  register(tag: string): Promise<void>;
}
