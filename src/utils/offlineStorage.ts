
// Helper utility for offline data storage using IndexedDB

// Database configuration
const DB_NAME = 'pendlerBuddyOfflineDB';
const DB_VERSION = 1;
const STORES = {
  shifts: 'shifts',
  vocabulary: 'vocabulary',
  notifications: 'notifications',
  premiumFeatures: 'premiumFeatures'
};

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores for offline data
      if (!db.objectStoreNames.contains(STORES.shifts)) {
        db.createObjectStore(STORES.shifts, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.vocabulary)) {
        db.createObjectStore(STORES.vocabulary, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.notifications)) {
        db.createObjectStore(STORES.notifications, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.premiumFeatures)) {
        db.createObjectStore(STORES.premiumFeatures, { keyPath: 'id' });
      }
    };
  });
};

// Save data to IndexedDB
const saveData = async <T>(storeName: string, data: T): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get all data from a store
const getAllData = async <T>(storeName: string): Promise<T[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Get item by ID
const getItemById = async <T>(storeName: string, id: string): Promise<T | undefined> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Delete item by ID
const deleteItemById = async (storeName: string, id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Sync cached data with localStorage when online
const syncWithLocalStorage = async (): Promise<void> => {
  try {
    // Sync premium features
    const premiumFeatures = await getAllData(STORES.premiumFeatures);
    if (premiumFeatures.length > 0) {
      localStorage.setItem('premiumFeatures', JSON.stringify(premiumFeatures));
    }

    // Sync shifts
    const shifts = await getAllData(STORES.shifts);
    if (shifts.length > 0) {
      localStorage.setItem('shifts', JSON.stringify(shifts));
    }

    // Sync notifications
    const notifications = await getAllData(STORES.notifications);
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    
    console.log('Data synchronized with localStorage');
  } catch (error) {
    console.error('Error syncing data with localStorage:', error);
  }
};

// Load data from localStorage to IndexedDB for offline use
const loadFromLocalStorage = async (): Promise<void> => {
  try {
    // Load premium features
    const premiumFeatures = JSON.parse(localStorage.getItem('premiumFeatures') || '[]');
    for (const feature of premiumFeatures) {
      await saveData(STORES.premiumFeatures, feature);
    }

    // Load shifts
    const shifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    for (const shift of shifts) {
      await saveData(STORES.shifts, shift);
    }

    // Load notifications
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    for (const notification of notifications) {
      await saveData(STORES.notifications, notification);
    }
    
    console.log('Data loaded from localStorage to IndexedDB');
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
};

export {
  initDB,
  saveData,
  getAllData,
  getItemById,
  deleteItemById,
  syncWithLocalStorage,
  loadFromLocalStorage,
  STORES
};
