
// Offline úložiště pro správu dat v IndexedDB
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Definice dostupných úložišť
export const STORES = {
  shifts: 'shifts',
  reports: 'reports',
  notifications: 'notifications',
  syncQueue: 'syncQueue'
};

// Inicializace IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('pendlerAppDB', 1);
    
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
