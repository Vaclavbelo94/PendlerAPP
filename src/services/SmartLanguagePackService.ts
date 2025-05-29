import { VocabularyItem } from '@/models/VocabularyItem';
import { PracticalPhrase } from '@/data/practicalGermanLessons';
import { getAllData, saveData, bulkSaveData, clearStore } from '@/utils/offlineStorage';

export interface SmartPackRecommendation {
  packId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedValue: number;
  basedOn: 'usage' | 'progress' | 'preferences' | 'ai';
}

export interface PackUsageAnalytics {
  packId: string;
  accessCount: number;
  avgSessionDuration: number;
  completionRate: number;
  lastAccessed: Date;
  userRating?: number;
}

export interface DeltaUpdate {
  packId: string;
  version: string;
  addedItems: any[];
  removedItems: string[];
  modifiedItems: any[];
  size: number;
}

interface UserProgressItem {
  id: string;
  itemId: string;
  masteryLevel: number;
  category?: string;
}

interface ExtendedVocabularyItem extends VocabularyItem {
  usageFrequency?: number;
}

export class SmartLanguagePackService {
  private static instance: SmartLanguagePackService;
  private analytics: Map<string, PackUsageAnalytics> = new Map();
  
  static getInstance(): SmartLanguagePackService {
    if (!SmartLanguagePackService.instance) {
      SmartLanguagePackService.instance = new SmartLanguagePackService();
    }
    return SmartLanguagePackService.instance;
  }

  // AI-Powered Pack Recommendations
  async generateRecommendations(userProgress: UserProgressItem[], userPreferences: any): Promise<SmartPackRecommendation[]> {
    const recommendations: SmartPackRecommendation[] = [];
    
    // Analyze user progress patterns
    const completionRate = this.calculateOverallCompletionRate(userProgress);
    const preferredDifficulty = this.inferPreferredDifficulty(userProgress);
    const weakAreas = this.identifyWeakAreas(userProgress);
    
    // Usage-based recommendations
    if (completionRate > 0.8) {
      recommendations.push({
        packId: 'german-advanced',
        reason: 'High completion rate indicates readiness for advanced content',
        priority: 'high',
        estimatedValue: 0.9,
        basedOn: 'progress'
      });
    }
    
    // Weakness-based recommendations
    for (const area of weakAreas) {
      recommendations.push({
        packId: `german-${area}`,
        reason: `Identified weakness in ${area} - targeted practice recommended`,
        priority: 'medium',
        estimatedValue: 0.7,
        basedOn: 'ai'
      });
    }
    
    // Preference-based recommendations
    if (userPreferences.workFocused) {
      recommendations.push({
        packId: 'german-professional',
        reason: 'Matches your work-focused learning preference',
        priority: 'medium',
        estimatedValue: 0.8,
        basedOn: 'preferences'
      });
    }
    
    return recommendations.sort((a, b) => b.estimatedValue - a.estimatedValue);
  }

  // Advanced Pack Management with Compression
  async compressPackData(data: any[]): Promise<Uint8Array> {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(jsonString);
    
    // Simple compression using basic RLE (Run Length Encoding) for demo
    // In production, use proper compression library
    return this.simpleCompress(uint8Array);
  }

  async decompressPackData(compressedData: Uint8Array): Promise<any[]> {
    const decompressed = this.simpleDecompress(compressedData);
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decompressed);
    return JSON.parse(jsonString);
  }

  // Delta Updates Implementation
  async createDeltaUpdate(packId: string, oldVersion: any[], newVersion: any[]): Promise<DeltaUpdate> {
    const addedItems = newVersion.filter(newItem => 
      !oldVersion.some(oldItem => this.getItemId(oldItem) === this.getItemId(newItem))
    );
    
    const removedItems = oldVersion
      .filter(oldItem => !newVersion.some(newItem => this.getItemId(newItem) === this.getItemId(oldItem)))
      .map(item => this.getItemId(item));
    
    const modifiedItems = newVersion.filter(newItem => {
      const oldItem = oldVersion.find(old => this.getItemId(old) === this.getItemId(newItem));
      return oldItem && JSON.stringify(oldItem) !== JSON.stringify(newItem);
    });
    
    return {
      packId,
      version: new Date().toISOString(),
      addedItems,
      removedItems,
      modifiedItems,
      size: this.calculateDeltaSize(addedItems, removedItems, modifiedItems)
    };
  }

  async applyDeltaUpdate(packId: string, delta: DeltaUpdate): Promise<void> {
    const currentData = await getAllData(packId) || [];
    
    // Ensure currentData is properly typed and has id property
    const typedCurrentData = (currentData as any[]).map(item => ({
      ...item,
      id: this.getItemId(item)
    }));
    
    // Remove items
    let updatedData = typedCurrentData.filter(item => 
      !delta.removedItems.includes(this.getItemId(item))
    );
    
    // Add new items (ensure they have id property)
    const newItemsWithId = delta.addedItems.map(item => ({
      ...item,
      id: this.getItemId(item)
    }));
    updatedData = [...updatedData, ...newItemsWithId];
    
    // Update modified items (ensure they have id property)
    const modifiedItemsWithId = delta.modifiedItems.map(item => ({
      ...item,
      id: this.getItemId(item)
    }));
    
    modifiedItemsWithId.forEach(modifiedItem => {
      const index = updatedData.findIndex(item => this.getItemId(item) === this.getItemId(modifiedItem));
      if (index !== -1) {
        updatedData[index] = modifiedItem;
      }
    });
    
    // Save updated data
    await clearStore(packId);
    await bulkSaveData(packId, updatedData);
    
    console.log(`Applied delta update to ${packId}:`, {
      added: delta.addedItems.length,
      removed: delta.removedItems.length,
      modified: delta.modifiedItems.length
    });
  }

  // Smart Content Curation
  async createPersonalizedPack(userId: string, preferences: any): Promise<VocabularyItem[]> {
    const allVocabulary = await getAllData<VocabularyItem>('language_pack_german_basic') || [];
    const userProgress = await this.getUserProgress(userId);
    
    // Filter based on difficulty
    const targetDifficulty = this.inferPreferredDifficulty(userProgress);
    let filteredItems = allVocabulary.filter(item => 
      this.assessItemDifficulty(item) === targetDifficulty
    );
    
    // Filter based on categories of interest
    if (preferences.categories?.length > 0) {
      filteredItems = filteredItems.filter(item =>
        preferences.categories.some((category: string) => 
          item.category?.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
    
    // Remove already mastered items
    const masteredIds = userProgress
      .filter(progress => progress.masteryLevel > 0.8)
      .map(progress => progress.itemId);
    
    filteredItems = filteredItems.filter(item => 
      !masteredIds.includes(item.id)
    );
    
    // Sort by relevance and limit to optimal pack size
    return filteredItems
      .sort((a, b) => this.calculateRelevanceScore(b as ExtendedVocabularyItem, preferences) - this.calculateRelevanceScore(a as ExtendedVocabularyItem, preferences))
      .slice(0, preferences.packSize || 50);
  }

  // Analytics and Monitoring
  async trackPackUsage(packId: string, sessionDuration: number): Promise<void> {
    const existing = this.analytics.get(packId) || {
      packId,
      accessCount: 0,
      avgSessionDuration: 0,
      completionRate: 0,
      lastAccessed: new Date()
    };
    
    existing.accessCount++;
    existing.avgSessionDuration = (existing.avgSessionDuration * (existing.accessCount - 1) + sessionDuration) / existing.accessCount;
    existing.lastAccessed = new Date();
    
    this.analytics.set(packId, existing);
    
    // Save to persistent storage
    await saveData('pack_analytics', {
      id: packId,
      ...existing
    });
  }

  async getPackPerformanceMetrics(packId: string): Promise<PackUsageAnalytics | null> {
    return this.analytics.get(packId) || null;
  }

  async generateUsageReport(): Promise<{
    totalPacks: number;
    mostUsedPack: string;
    avgCompletionRate: number;
    trends: any[];
  }> {
    const allAnalytics = Array.from(this.analytics.values());
    
    return {
      totalPacks: allAnalytics.length,
      mostUsedPack: allAnalytics.reduce((prev, current) => 
        current.accessCount > prev.accessCount ? current : prev
      )?.packId || 'none',
      avgCompletionRate: allAnalytics.reduce((sum, analytics) => 
        sum + analytics.completionRate, 0) / allAnalytics.length || 0,
      trends: this.calculateUsageTrends(allAnalytics)
    };
  }

  // Private helper methods
  private getItemId(item: any): string {
    return item.id || item._id || `${item.german || item.czech || Math.random().toString(36)}`;
  }

  private calculateOverallCompletionRate(userProgress: UserProgressItem[]): number {
    if (userProgress.length === 0) return 0;
    return userProgress.reduce((sum, progress) => sum + (progress.masteryLevel || 0), 0) / userProgress.length;
  }

  private inferPreferredDifficulty(userProgress: UserProgressItem[]): 'beginner' | 'intermediate' | 'advanced' {
    const avgMastery = this.calculateOverallCompletionRate(userProgress);
    if (avgMastery < 0.3) return 'beginner';
    if (avgMastery < 0.7) return 'intermediate';
    return 'advanced';
  }

  private identifyWeakAreas(userProgress: UserProgressItem[]): string[] {
    const categoryPerformance = new Map<string, number[]>();
    
    userProgress.forEach(progress => {
      const category = progress.category || 'general';
      if (!categoryPerformance.has(category)) {
        categoryPerformance.set(category, []);
      }
      categoryPerformance.get(category)!.push(progress.masteryLevel || 0);
    });
    
    return Array.from(categoryPerformance.entries())
      .filter(([_, scores]) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return avg < 0.5; // Consider areas with <50% mastery as weak
      })
      .map(([category]) => category);
  }

  private simpleCompress(data: Uint8Array): Uint8Array {
    // Simple RLE compression for demo - replace with proper compression in production
    const compressed: number[] = [];
    let i = 0;
    
    while (i < data.length) {
      let count = 1;
      const current = data[i];
      
      while (i + count < data.length && data[i + count] === current && count < 255) {
        count++;
      }
      
      compressed.push(count, current);
      i += count;
    }
    
    return new Uint8Array(compressed);
  }

  private simpleDecompress(compressed: Uint8Array): Uint8Array {
    const decompressed: number[] = [];
    
    for (let i = 0; i < compressed.length; i += 2) {
      const count = compressed[i];
      const value = compressed[i + 1];
      
      for (let j = 0; j < count; j++) {
        decompressed.push(value);
      }
    }
    
    return new Uint8Array(decompressed);
  }

  private calculateDeltaSize(added: any[], removed: string[], modified: any[]): number {
    return JSON.stringify({ added, removed, modified }).length;
  }

  private async getUserProgress(userId: string): Promise<UserProgressItem[]> {
    return await getAllData(`user_progress_${userId}`) || [];
  }

  private assessItemDifficulty(item: VocabularyItem): 'beginner' | 'intermediate' | 'advanced' {
    // Simple heuristic - in production, use proper difficulty assessment
    const textLength = (item.german?.length || 0) + (item.czech?.length || 0);
    if (textLength < 20) return 'beginner';
    if (textLength < 50) return 'intermediate';
    return 'advanced';
  }

  private calculateRelevanceScore(item: ExtendedVocabularyItem, preferences: any): number {
    let score = 0;
    
    // Category relevance
    if (preferences.categories?.includes(item.category)) {
      score += 0.5;
    }
    
    // Difficulty match
    const itemDifficulty = this.assessItemDifficulty(item);
    if (itemDifficulty === preferences.targetDifficulty) {
      score += 0.3;
    }
    
    // Usage frequency (if available)
    if (item.usageFrequency) {
      score += item.usageFrequency * 0.2;
    }
    
    return score;
  }

  private calculateUsageTrends(analytics: PackUsageAnalytics[]): any[] {
    // Calculate trends over time - simplified for demo
    return analytics.map(analytic => ({
      packId: analytic.packId,
      trend: analytic.accessCount > 10 ? 'increasing' : 'stable',
      momentum: analytic.avgSessionDuration / 60 // Convert to minutes
    }));
  }
}

export const smartLanguagePackService = SmartLanguagePackService.getInstance();
