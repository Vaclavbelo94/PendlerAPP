
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

export interface UserDataExport {
  metadata: {
    exportDate: string;
    version: string;
    userId: string;
  };
  shifts: any[];
  vehicles: any[];
  taxCalculations: any[];
  taxDocuments: any[];
  reports: any[];
  calculationHistory: any[];
  userPreferences: any;
  vocabularyData: any[];
  testHistory: any[];
}

export interface DataStats {
  shifts: number;
  vehicles: number;
  taxCalculations: number;
  vocabulary: number;
  tests: number;
  reports: number;
}

class DataExportService {
  async getAllUserData(userId: string): Promise<UserDataExport> {
    try {
      // Fetch data from Supabase
      const [
        shiftsResult,
        vehiclesResult,
        taxCalculationsResult,
        taxDocumentsResult,
        reportsResult,
        calculationHistoryResult
      ] = await Promise.all([
        supabase.from('shifts').select('*').eq('user_id', userId),
        supabase.from('vehicles').select('*').eq('user_id', userId),
        supabase.from('tax_calculations').select('*').eq('user_id', userId),
        supabase.from('tax_documents').select('*').eq('user_id', userId),
        supabase.from('reports').select('*').eq('user_id', userId),
        supabase.from('calculation_history').select('*').eq('user_id', userId)
      ]);

      // Get data from localStorage
      const vocabularyData = this.getLocalStorageData('vocabulary', []);
      const testHistory = this.getLocalStorageData('testHistory', []);
      const userPreferences = {
        language: this.getLocalStorageData('i18nextLng', 'cs'),
        theme: this.getLocalStorageData('theme', 'light'),
        notifications: this.getLocalStorageData('notificationSettings', {}),
        appearance: this.getLocalStorageData('appearanceSettings', {})
      };

      return {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0',
          userId
        },
        shifts: shiftsResult.data || [],
        vehicles: vehiclesResult.data || [],
        taxCalculations: taxCalculationsResult.data || [],
        taxDocuments: taxDocumentsResult.data || [],
        reports: reportsResult.data || [],
        calculationHistory: calculationHistoryResult.data || [],
        userPreferences,
        vocabularyData,
        testHistory
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async getDataStats(userId: string): Promise<DataStats> {
    try {
      const [
        shiftsCount,
        vehiclesCount,
        taxCalculationsCount,
        reportsCount
      ] = await Promise.all([
        supabase.from('shifts').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('vehicles').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('tax_calculations').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('reports').select('id', { count: 'exact' }).eq('user_id', userId)
      ]);

      const vocabularyData = this.getLocalStorageData('vocabulary', []);
      const testHistory = this.getLocalStorageData('testHistory', []);

      return {
        shifts: shiftsCount.count || 0,
        vehicles: vehiclesCount.count || 0,
        taxCalculations: taxCalculationsCount.count || 0,
        vocabulary: vocabularyData.length,
        tests: testHistory.length,
        reports: reportsCount.count || 0
      };
    } catch (error) {
      console.error('Error getting data stats:', error);
      return {
        shifts: 0,
        vehicles: 0,
        taxCalculations: 0,
        vocabulary: 0,
        tests: 0,
        reports: 0
      };
    }
  }

  private getLocalStorageData(key: string, defaultValue: any) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  async exportToJSON(userData: UserDataExport): Promise<void> {
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pendler-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportToExcel(userData: UserDataExport): Promise<void> {
    const workbook = XLSX.utils.book_new();

    // Create sheets for different data types
    if (userData.shifts.length > 0) {
      const shiftsSheet = XLSX.utils.json_to_sheet(userData.shifts);
      XLSX.utils.book_append_sheet(workbook, shiftsSheet, 'Směny');
    }

    if (userData.vehicles.length > 0) {
      const vehiclesSheet = XLSX.utils.json_to_sheet(userData.vehicles);
      XLSX.utils.book_append_sheet(workbook, vehiclesSheet, 'Vozidla');
    }

    if (userData.taxCalculations.length > 0) {
      const taxSheet = XLSX.utils.json_to_sheet(userData.taxCalculations);
      XLSX.utils.book_append_sheet(workbook, taxSheet, 'Daňové výpočty');
    }

    if (userData.vocabularyData.length > 0) {
      const vocabSheet = XLSX.utils.json_to_sheet(userData.vocabularyData);
      XLSX.utils.book_append_sheet(workbook, vocabSheet, 'Slovíčka');
    }

    // Add metadata sheet
    const metadataSheet = XLSX.utils.json_to_sheet([userData.metadata]);
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata');

    // Generate and download file
    const fileName = `pendler-data-export-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  async exportToCSV(userData: UserDataExport, dataType: string): Promise<void> {
    let data: any[] = [];
    let fileName = '';

    switch (dataType) {
      case 'shifts':
        data = userData.shifts;
        fileName = 'smeny';
        break;
      case 'vehicles':
        data = userData.vehicles;
        fileName = 'vozidla';
        break;
      case 'taxCalculations':
        data = userData.taxCalculations;
        fileName = 'danove-vypocty';
        break;
      case 'vocabulary':
        data = userData.vocabularyData;
        fileName = 'slovicka';
        break;
      default:
        throw new Error('Unsupported data type for CSV export');
    }

    if (data.length === 0) {
      throw new Error('Žádná data k exportu');
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async importFromJSON(file: File, userId: string): Promise<void> {
    try {
      const text = await file.text();
      const userData: UserDataExport = JSON.parse(text);

      // Validate the import data
      if (!userData.metadata || userData.metadata.userId !== userId) {
        throw new Error('Soubor nepatří k tomuto uživateli');
      }

      // Import data back to database and localStorage
      const promises = [];

      if (userData.shifts.length > 0) {
        promises.push(this.importShifts(userData.shifts, userId));
      }

      if (userData.vehicles.length > 0) {
        promises.push(this.importVehicles(userData.vehicles, userId));
      }

      if (userData.vocabularyData.length > 0) {
        localStorage.setItem('vocabulary', JSON.stringify(userData.vocabularyData));
      }

      if (userData.testHistory.length > 0) {
        localStorage.setItem('testHistory', JSON.stringify(userData.testHistory));
      }

      // Import user preferences
      if (userData.userPreferences) {
        const prefs = userData.userPreferences;
        if (prefs.language) localStorage.setItem('i18nextLng', prefs.language);
        if (prefs.theme) localStorage.setItem('theme', prefs.theme);
        if (prefs.notifications) localStorage.setItem('notificationSettings', JSON.stringify(prefs.notifications));
        if (prefs.appearance) localStorage.setItem('appearanceSettings', JSON.stringify(prefs.appearance));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  private async importShifts(shifts: any[], userId: string): Promise<void> {
    // Remove existing shifts and import new ones
    await supabase.from('shifts').delete().eq('user_id', userId);
    
    if (shifts.length > 0) {
      const { error } = await supabase.from('shifts').insert(shifts);
      if (error) throw error;
    }
  }

  private async importVehicles(vehicles: any[], userId: string): Promise<void> {
    // Remove existing vehicles and import new ones
    await supabase.from('vehicles').delete().eq('user_id', userId);
    
    if (vehicles.length > 0) {
      const { error } = await supabase.from('vehicles').insert(vehicles);
      if (error) throw error;
    }
  }
}

export const dataExportService = new DataExportService();
