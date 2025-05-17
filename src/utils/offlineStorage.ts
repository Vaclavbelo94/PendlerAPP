
// Offline úložiště pro správu dat v IndexedDB
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VocabularyItem } from "@/models/VocabularyItem";

// Definice dostupných úložišť
export const STORES = {
  shifts: 'shifts',
  reports: 'reports',
  notifications: 'notifications',
  syncQueue: 'syncQueue',
  vocabulary: 'vocabulary', // Add vocabulary store
  testHistory: 'testHistory' // Add test history store
};

// Inicializace IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pendlerAppDB', 2); // Increase version to update schema
    
    request.onerror = (event) => {
      reject("Nepodařilo se otevřít databázi.");
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      
      // Vytvoření úložišť, pokud neexistují
      if (!db.objectStoreNames.contains(STORES.shifts)) {
        db.createObjectStore(STORES.shifts, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.reports)) {
        db.createObjectStore(STORES.reports, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.notifications)) {
        db.createObjectStore(STORES.notifications, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.syncQueue)) {
        db.createObjectStore(STORES.syncQueue, { keyPath: 'id', autoIncrement: true });
      }
      
      // Add vocabulary store
      if (!db.objectStoreNames.contains(STORES.vocabulary)) {
        db.createObjectStore(STORES.vocabulary, { keyPath: 'id' });
      }
      
      // Add test history store
      if (!db.objectStoreNames.contains(STORES.testHistory)) {
        db.createObjectStore(STORES.testHistory, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
  });
};

// Uložení dat do IndexedDB
export const saveData = async <T extends { id: string }>(storeName: string, data: T): Promise<T> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
      
      request.onsuccess = () => {
        resolve(data);
      };
    });
  } catch (error) {
    console.error(`Chyba při ukládání dat (${storeName}):`, error);
    throw error;
  }
};

// Bulk save multiple items to IndexedDB
export const bulkSaveData = async <T extends { id: string }>(storeName: string, dataItems: T[]): Promise<T[]> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      let completed = 0;
      let failed = 0;
      
      dataItems.forEach((item) => {
        const request = store.put(item);
        
        request.onsuccess = () => {
          completed++;
          if (completed + failed === dataItems.length) {
            if (failed > 0) {
              reject(`Failed to save ${failed} items`);
            } else {
              resolve(dataItems);
            }
          }
        };
        
        request.onerror = () => {
          failed++;
          if (completed + failed === dataItems.length) {
            reject(`Failed to save ${failed} items`);
          }
        };
      });
      
      transaction.oncomplete = () => {
        resolve(dataItems);
      };
      
      transaction.onerror = () => {
        reject(`Transaction failed`);
      };
    });
  } catch (error) {
    console.error(`Chyba při hromadném ukládání dat (${storeName}):`, error);
    throw error;
  }
};

// Načtení všech dat z úložiště
export const getAllData = async <T>(storeName: string): Promise<T[]> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };
    });
  } catch (error) {
    console.error(`Chyba při načítání dat (${storeName}):`, error);
    return [];
  }
};

// Načtení položky podle ID
export const getItemById = async <T>(storeName: string, id: string): Promise<T | null> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result || null);
      };
    });
  } catch (error) {
    console.error(`Chyba při načítání položky (${storeName}):`, error);
    return null;
  }
};

// Odstranění položky podle ID
export const deleteItemById = async (storeName: string, id: string): Promise<boolean> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
      
      request.onsuccess = () => {
        resolve(true);
      };
    });
  } catch (error) {
    console.error(`Chyba při odstraňování položky (${storeName}):`, error);
    return false;
  }
};

// Clear all data in a store
export const clearStore = async (storeName: string): Promise<boolean> => {
  try {
    const db = await initDB() as IDBDatabase;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
      
      request.onsuccess = () => {
        resolve(true);
      };
    });
  } catch (error) {
    console.error(`Chyba při mazání úložiště (${storeName}):`, error);
    return false;
  }
};

// Save all vocabulary to offline storage
export const saveVocabularyToOfflineStorage = async (items: VocabularyItem[]): Promise<void> => {
  try {
    // First clear the vocabulary store
    await clearStore(STORES.vocabulary);
    
    // Then bulk save all items
    await bulkSaveData(STORES.vocabulary, items);
    
    // Also save to localStorage as backup
    localStorage.setItem('vocabulary_items', JSON.stringify(items));
    
    console.log('Vocabulary saved to offline storage:', items.length, 'items');
  } catch (error) {
    console.error('Failed to save vocabulary to offline storage:', error);
  }
};

// Load vocabulary from offline storage
export const loadVocabularyFromOfflineStorage = async (): Promise<VocabularyItem[]> => {
  try {
    // First try IndexedDB
    const items = await getAllData<VocabularyItem>(STORES.vocabulary);
    if (items && items.length > 0) {
      console.log('Loaded vocabulary from IndexedDB:', items.length, 'items');
      return items;
    }
    
    // Fall back to localStorage
    const storedItems = localStorage.getItem('vocabulary_items');
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems);
      console.log('Loaded vocabulary from localStorage:', parsedItems.length, 'items');
      
      // Save to IndexedDB for next time
      if (parsedItems.length > 0) {
        await bulkSaveData(STORES.vocabulary, parsedItems);
      }
      
      return parsedItems;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load vocabulary from offline storage:', error);
    
    // Last resort: try localStorage directly
    try {
      const storedItems = localStorage.getItem('vocabulary_items');
      if (storedItems) {
        return JSON.parse(storedItems);
      }
    } catch (e) {
      console.error('Also failed to load from localStorage:', e);
    }
    
    return [];
  }
};

// Načtení dat z localStorage do IndexedDB
export const loadFromLocalStorage = async (): Promise<void> => {
  try {
    // Načtení směn
    const shiftsData = localStorage.getItem('shifts');
    if (shiftsData) {
      const shifts = JSON.parse(shiftsData);
      for (const shift of shifts) {
        await saveData(STORES.shifts, { ...shift, date: new Date(shift.date) });
      }
    }
    
    // Načtení notifikací
    const notificationsData = localStorage.getItem('notifications');
    if (notificationsData) {
      const notifications = JSON.parse(notificationsData);
      for (const notification of notifications) {
        await saveData(STORES.notifications, notification);
      }
    }
    
    // Načtení slovíček
    const vocabularyData = localStorage.getItem('vocabulary_items');
    if (vocabularyData) {
      const vocabulary = JSON.parse(vocabularyData);
      await bulkSaveData(STORES.vocabulary, vocabulary);
    }
    
    console.log('Data byla úspěšně načtena do offline úložiště');
  } catch (error) {
    console.error('Chyba při načítání dat do offline úložiště:', error);
  }
};

// Synchronizace dat z IndexedDB do localStorage a na server
export const syncWithLocalStorage = async (): Promise<void> => {
  try {
    // Synchronizace směn
    const shiftsData = await getAllData(STORES.shifts);
    if (shiftsData.length > 0) {
      localStorage.setItem('shifts', JSON.stringify(shiftsData));
    }
    
    // Synchronizace notifikací
    const notificationsData = await getAllData(STORES.notifications);
    if (notificationsData.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notificationsData));
    }
    
    // Synchronizace slovíček
    const vocabularyData = await getAllData(STORES.vocabulary);
    if (vocabularyData.length > 0) {
      localStorage.setItem('vocabulary_items', JSON.stringify(vocabularyData));
    }
    
    // Kontrola, zda je uživatel přihlášen
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Získání dat z fronty synchronizace
      const syncQueueData = await getAllData(STORES.syncQueue);
      
      if (syncQueueData.length > 0) {
        // Volání edge funkce pro synchronizaci
        const { data, error } = await supabase.functions.invoke('sync_offline_data', {
          body: { syncData: syncQueueData }
        });
        
        if (error) throw error;
        
        // Zpracování výsledků synchronizace
        if (data.success) {
          // Vyčištění synchronizační fronty
          for (const item of syncQueueData) {
            // Použijeme typovou anotaci pro item
            await deleteItemById(STORES.syncQueue, (item as { id: string }).id);
          }
          
          toast({
            title: "Synchronizace dokončena",
            description: "Vaše offline data byla úspěšně synchronizována",
          });
        }
      }
    }
    
    console.log('Data byla úspěšně synchronizována');
  } catch (error) {
    console.error('Chyba při synchronizaci dat:', error);
    toast({
      title: "Chyba synchronizace",
      description: "Nepodařilo se synchronizovat offline data",
      variant: "destructive",
    });
  }
};

// Přidání položky do synchronizační fronty
export const addToSyncQueue = async (entityType: string, entityId: string, action: string, data: any): Promise<void> => {
  try {
    // Získání aktuální session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const queueItem = {
      entity_type: entityType,
      entity_id: entityId,
      action,
      data,
      user_id: session.user.id,
      created_at: new Date().toISOString()
    };
    
    await saveData(STORES.syncQueue, { ...queueItem, id: `${entityType}-${entityId}-${Date.now()}` });
    
    // Pokud je online, rovnou zkusit synchronizovat
    if (navigator.onLine) {
      await syncWithLocalStorage();
    }
  } catch (error) {
    console.error('Chyba při přidávání do synchronizační fronty:', error);
  }
};
