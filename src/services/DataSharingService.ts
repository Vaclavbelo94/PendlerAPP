
interface ModuleData {
  shifts: any[];
  vehicles: any[];
  analytics: any;
  language: any;
  notifications: any[];
}

interface DataSubscription {
  id: string;
  moduleId: string;
  callback: (data: any) => void;
  dataTypes: string[];
}

export interface CrossModuleInsight {
  id: string;
  type: 'recommendation' | 'optimization' | 'prediction' | 'warning';
  title: string;
  description: string;
  modules: string[];
  action?: {
    type: string;
    payload: any;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  generatedAt: Date;
  expiresAt?: Date;
}

export class DataSharingService {
  private static instance: DataSharingService;
  private moduleData: Map<string, any> = new Map();
  private subscriptions: Map<string, DataSubscription[]> = new Map();
  private crossModuleInsights: CrossModuleInsight[] = [];
  private eventBus = new EventTarget();

  static getInstance(): DataSharingService {
    if (!DataSharingService.instance) {
      DataSharingService.instance = new DataSharingService();
    }
    return DataSharingService.instance;
  }

  // Data sharing methods
  updateModuleData(moduleId: string, data: any): void {
    const previousData = this.moduleData.get(moduleId);
    this.moduleData.set(moduleId, data);
    
    // Notify subscribers
    this.notifySubscribers(moduleId, data, previousData);
    
    // Generate cross-module insights
    this.generateCrossModuleInsights(moduleId, data);
    
    console.log(`Data updated for module: ${moduleId}`);
  }

  getModuleData(moduleId: string): any {
    return this.moduleData.get(moduleId);
  }

  getAllModuleData(): ModuleData {
    return {
      shifts: this.moduleData.get('shifts') || [],
      vehicles: this.moduleData.get('vehicles') || [],
      analytics: this.moduleData.get('analytics') || {},
      language: this.moduleData.get('language') || {},
      notifications: this.moduleData.get('notifications') || []
    };
  }

  // Subscription methods
  subscribe(moduleId: string, dataTypes: string[], callback: (data: any) => void): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: DataSubscription = {
      id: subscriptionId,
      moduleId,
      callback,
      dataTypes
    };

    const moduleSubscriptions = this.subscriptions.get(moduleId) || [];
    moduleSubscriptions.push(subscription);
    this.subscriptions.set(moduleId, moduleSubscriptions);

    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    for (const [moduleId, subscriptions] of this.subscriptions.entries()) {
      const filteredSubscriptions = subscriptions.filter(sub => sub.id !== subscriptionId);
      this.subscriptions.set(moduleId, filteredSubscriptions);
    }
  }

  private notifySubscribers(moduleId: string, newData: any, previousData: any): void {
    const subscriptions = this.subscriptions.get(moduleId) || [];
    
    subscriptions.forEach(subscription => {
      try {
        subscription.callback({
          moduleId,
          data: newData,
          previousData,
          timestamp: new Date()
        });
      } catch (error) {
        console.error(`Error notifying subscriber ${subscription.id}:`, error);
      }
    });
  }

  // Cross-module insights generation
  private generateCrossModuleInsights(moduleId: string, data: any): void {
    const allData = this.getAllModuleData();
    
    // Generate contextual insights based on module interactions
    const insights = this.analyzeModuleInteractions(moduleId, data, allData);
    
    insights.forEach(insight => this.addCrossModuleInsight(insight));
  }

  private analyzeModuleInteractions(moduleId: string, data: any, allData: ModuleData): CrossModuleInsight[] {
    const insights: CrossModuleInsight[] = [];
    
    // Shifts + Language integration
    if (moduleId === 'shifts' && data.length > 0) {
      const upcomingShifts = data.filter((shift: any) => new Date(shift.date) > new Date());
      if (upcomingShifts.length > 0) {
        insights.push({
          id: `insight_${Date.now()}_1`,
          type: 'recommendation',
          title: 'Doporučené fráze pro nadcházející směny',
          description: `Máte ${upcomingShifts.length} nadcházejících směn. Doporučujeme procvičit pracovní slovní zásobu.`,
          modules: ['shifts', 'language'],
          action: {
            type: 'suggest_vocabulary',
            payload: { category: 'work', shifts: upcomingShifts }
          },
          priority: 'medium',
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // Analytics + Performance insights
    if (moduleId === 'analytics' && data.learningPattern) {
      const pattern = data.learningPattern;
      if (pattern.retentionRate < 0.6) {
        insights.push({
          id: `insight_${Date.now()}_2`,
          type: 'optimization',
          title: 'Optimalizace učebního plánu',
          description: 'Nízká míra udržení. Doporučujeme kratší, častější lekce.',
          modules: ['analytics', 'language'],
          action: {
            type: 'adjust_learning_schedule',
            payload: { suggestedSessionLength: 15, frequency: 'daily' }
          },
          priority: 'high',
          generatedAt: new Date()
        });
      }
    }

    // Vehicles + Commute optimization
    if (moduleId === 'vehicles' && allData.shifts.length > 0) {
      insights.push({
        id: `insight_${Date.now()}_3`,
        type: 'optimization',
        title: 'Optimalizace dojíždění',
        description: 'Na základě vašich směn a vozidel můžeme optimalizovat náklady na dopravu.',
        modules: ['vehicles', 'shifts'],
        action: {
          type: 'optimize_commute',
          payload: { vehicles: data, shifts: allData.shifts }
        },
        priority: 'medium',
        generatedAt: new Date()
      });
    }

    return insights;
  }

  addCrossModuleInsight(insight: CrossModuleInsight): void {
    // Avoid duplicates
    const existingInsight = this.crossModuleInsights.find(i => 
      i.type === insight.type && 
      i.title === insight.title &&
      i.modules.every(m => insight.modules.includes(m))
    );

    if (!existingInsight) {
      this.crossModuleInsights.push(insight);
      
      // Emit event for UI components
      this.eventBus.dispatchEvent(new CustomEvent('insight-generated', {
        detail: insight
      }));
    }
  }

  getCrossModuleInsights(moduleIds?: string[]): CrossModuleInsight[] {
    let insights = this.crossModuleInsights.filter(insight => {
      // Filter out expired insights
      if (insight.expiresAt && insight.expiresAt < new Date()) {
        return false;
      }
      return true;
    });

    if (moduleIds) {
      insights = insights.filter(insight => 
        insight.modules.some(module => moduleIds.includes(module))
      );
    }

    return insights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Event bus methods
  addEventListener(type: string, listener: EventListener): void {
    this.eventBus.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.eventBus.removeEventListener(type, listener);
  }

  // Smart recommendations
  getSmartRecommendations(userId: string): CrossModuleInsight[] {
    const allData = this.getAllModuleData();
    const recommendations: CrossModuleInsight[] = [];

    // Time-based recommendations
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 7 && hour <= 9) {
      // Morning commute recommendations
      recommendations.push({
        id: `rec_morning_${Date.now()}`,
        type: 'recommendation',
        title: 'Ranní dojíždění',
        description: 'Ideální čas pro procvičování němčiny během cesty do práce.',
        modules: ['language', 'shifts'],
        priority: 'medium',
        generatedAt: new Date()
      });
    }

    return recommendations;
  }

  // Cleanup expired insights
  cleanupExpiredInsights(): void {
    const now = new Date();
    this.crossModuleInsights = this.crossModuleInsights.filter(insight => 
      !insight.expiresAt || insight.expiresAt > now
    );
  }
}

export const dataSharingService = DataSharingService.getInstance();
