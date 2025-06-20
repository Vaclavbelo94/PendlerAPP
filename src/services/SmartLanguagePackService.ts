
import { Subject } from 'rxjs';
import { BasicVocabularyItem, SmartPackRecommendation } from '@/types/language';

// SmartLanguagePackService - simulates language pack loading and usage tracking
// This is a simplified version for demonstration purposes

interface LanguagePack {
  id: string;
  name: string;
  description: string;
  items: BasicVocabularyItem[];
  price: number;
  imageUrl: string;
  categories: string[];
  difficultyLevels: ('easy' | 'medium' | 'hard')[];
  languagePair: string;
  rating: number;
  reviewCount: number;
  releaseDate: Date;
  lastUpdated: Date;
  author: string;
  tags: string[];
  isFree: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
}

interface ExtendedVocabularyItem extends BasicVocabularyItem {
  lastAccessed?: Date;
  packId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  usageCount?: number;
  masteryLevel?: number;
}

interface PackUsageEvent {
  packId: string;
  timestamp: Date;
}

class SmartLanguagePackService {
  private static instance: SmartLanguagePackService;
  private languagePacks: LanguagePack[] = [];
  private packUsageEvents: PackUsageEvent[] = [];
  private packUsageSubject = new Subject<PackUsageEvent>();

  private constructor() {
    // Initialize with some dummy data
    this.languagePacks = this.createDummyPacks(5);
  }

  public static getInstance(): SmartLanguagePackService {
    if (!SmartLanguagePackService.instance) {
      SmartLanguagePackService.instance = new SmartLanguagePackService();
    }
    return SmartLanguagePackService.instance;
  }

  public getLanguagePacks(): LanguagePack[] {
    return this.languagePacks;
  }

  public getLanguagePack(id: string): LanguagePack | undefined {
    return this.languagePacks.find(pack => pack.id === id);
  }

  public loadPackItems(packId: string): BasicVocabularyItem[] {
    const pack = this.getLanguagePack(packId);
    return pack ? pack.items : [];
  }

  public trackPackUsage(packId: string, timestamp: number): void {
    const event: PackUsageEvent = {
      packId: packId,
      timestamp: new Date(timestamp)
    };
    this.packUsageEvents.push(event);
    this.packUsageSubject.next(event);
    console.log(`Pack ${packId} usage tracked at ${timestamp}`);
  }

  public getPackUsageEvents(): PackUsageEvent[] {
    return this.packUsageEvents;
  }

  public getPackUsageStream(): Subject<PackUsageEvent> {
    return this.packUsageSubject;
  }

  private createDummyPacks(count: number): LanguagePack[] {
    const packs: LanguagePack[] = [];
    for (let i = 1; i <= count; i++) {
      packs.push({
        id: `pack-${i}`,
        name: `Vocabulary Pack ${i}`,
        description: `A comprehensive vocabulary pack for learning languages. Pack number ${i}`,
        items: this.generateDummyItems(i * 10),
        price: i * 5,
        imageUrl: `https://picsum.photos/200/150?random=${i}`,
        categories: ['Travel', 'Business', 'Everyday Life'],
        difficultyLevels: ['easy', 'medium', 'hard'],
        languagePair: 'en-de',
        rating: 4.5 + (i * 0.1),
        reviewCount: 50 + (i * 10),
        releaseDate: new Date(2023, 0, i),
        lastUpdated: new Date(),
        author: 'Language Learning Inc.',
        tags: ['vocabulary', 'english', 'german'],
        isFree: i % 2 === 0,
        isFeatured: i % 3 === 0,
        isAvailable: true
      });
    }
    return packs;
  }

  private generateDummyItems(count: number): BasicVocabularyItem[] {
    const items: BasicVocabularyItem[] = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        id: `item-${i}`,
        word: `Word ${i}`,
        translation: `Wort ${i}`,
        category: 'General',
        difficulty: 'medium',
        lastReviewed: new Date().toISOString(),
        nextReviewDate: new Date().toISOString(),
        repetitionLevel: i % 5,
        correctCount: i,
        incorrectCount: i % 3
      });
    }
    return items;
  }
}

export const smartLanguagePackService = SmartLanguagePackService.getInstance();
export type { SmartPackRecommendation };
