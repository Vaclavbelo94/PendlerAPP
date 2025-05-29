
interface RecommendationContext {
  userId: string;
  currentModule: string;
  timestamp: Date;
  userPreferences: any;
  recentActivity: any[];
}

export interface SmartRecommendation {
  id: string;
  type: 'vocabulary' | 'schedule' | 'optimization' | 'feature' | 'workflow';
  title: string;
  description: string;
  sourceModules: string[];
  targetModule: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionable: boolean;
  action?: {
    type: string;
    label: string;
    payload: any;
  };
  reasoning: string;
  estimatedBenefit: string;
  generatedAt: Date;
  validUntil: Date;
}

export class CrossModuleRecommendationsService {
  private static instance: CrossModuleRecommendationsService;
  private recommendations: Map<string, SmartRecommendation[]> = new Map();

  static getInstance(): CrossModuleRecommendationsService {
    if (!CrossModuleRecommendationsService.instance) {
      CrossModuleRecommendationsService.instance = new CrossModuleRecommendationsService();
    }
    return CrossModuleRecommendationsService.instance;
  }

  async generateRecommendations(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Vocabulary recommendations based on shifts
    if (context.currentModule === 'language') {
      const shiftRecommendations = await this.generateShiftBasedVocabulary(context);
      recommendations.push(...shiftRecommendations);
    }

    // Schedule optimization based on analytics
    if (context.currentModule === 'shifts') {
      const scheduleRecommendations = await this.generateScheduleOptimizations(context);
      recommendations.push(...scheduleRecommendations);
    }

    // Commute optimization based on shifts and vehicles
    if (context.currentModule === 'vehicles') {
      const commuteRecommendations = await this.generateCommuteOptimizations(context);
      recommendations.push(...commuteRecommendations);
    }

    // Learning path optimization
    const learningRecommendations = await this.generateLearningPathRecommendations(context);
    recommendations.push(...learningRecommendations);

    // Feature discovery recommendations
    const featureRecommendations = await this.generateFeatureDiscoveryRecommendations(context);
    recommendations.push(...featureRecommendations);

    // Store recommendations
    this.recommendations.set(context.userId, recommendations);

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async generateShiftBasedVocabulary(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];
    
    // Mock data analysis - in real implementation, this would analyze actual shift data
    const upcomingShifts = context.recentActivity.filter(activity => 
      activity.type === 'shift' && new Date(activity.date) > new Date()
    );

    if (upcomingShifts.length > 0) {
      const workLocations = upcomingShifts.map(shift => shift.location).filter(Boolean);
      const uniqueLocations = [...new Set(workLocations)];

      uniqueLocations.forEach(location => {
        recommendations.push({
          id: `vocab_${location}_${Date.now()}`,
          type: 'vocabulary',
          title: `Slovní zásoba pro ${location}`,
          description: `Procvičte si specifické výrazy a fráze pro práci v ${location}`,
          sourceModules: ['shifts'],
          targetModule: 'language',
          confidence: 0.85,
          priority: 'high',
          actionable: true,
          action: {
            type: 'start_vocabulary_pack',
            label: 'Procvičit slovní zásobu',
            payload: { location, category: 'work' }
          },
          reasoning: `Máte naplánované směny v ${location} - specifická slovní zásoba vám pomůže`,
          estimatedBenefit: 'Zlepšení komunikace o 25%',
          generatedAt: new Date(),
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      });
    }

    return recommendations;
  }

  private async generateScheduleOptimizations(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Analyze learning patterns and suggest optimal shift scheduling
    const analyticsData = context.recentActivity.find(activity => activity.type === 'analytics');
    
    if (analyticsData?.learningPattern) {
      const pattern = analyticsData.learningPattern;
      const preferredHours = pattern.preferredTimes
        .filter((time: any) => time.engagement > 0.7)
        .map((time: any) => time.hour);

      if (preferredHours.length > 0) {
        recommendations.push({
          id: `schedule_opt_${Date.now()}`,
          type: 'schedule',
          title: 'Optimální časy pro učení',
          description: `Vaše nejproduktivnější hodiny jsou ${preferredHours.join(', ')}h`,
          sourceModules: ['analytics'],
          targetModule: 'shifts',
          confidence: 0.78,
          priority: 'medium',
          actionable: true,
          action: {
            type: 'suggest_learning_schedule',
            label: 'Naplánovat učení',
            payload: { preferredHours, duration: pattern.optimalSessionLength }
          },
          reasoning: 'Analýza vašich dat ukázala nejvhodnější časy pro učení',
          estimatedBenefit: 'Zvýšení efektivity učení o 30%',
          generatedAt: new Date(),
          validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });
      }
    }

    return recommendations;
  }

  private async generateCommuteOptimizations(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Analyze vehicle efficiency and commute patterns
    const vehicles = context.recentActivity.filter(activity => activity.type === 'vehicle');
    const shifts = context.recentActivity.filter(activity => activity.type === 'shift');

    if (vehicles.length > 1 && shifts.length > 0) {
      recommendations.push({
        id: `commute_opt_${Date.now()}`,
        type: 'optimization',
        title: 'Optimalizace výběru vozidla',
        description: 'Na základě vašich směn můžeme doporučit nejefektivnější vozidlo',
        sourceModules: ['vehicles', 'shifts'],
        targetModule: 'vehicles',
        confidence: 0.82,
        priority: 'medium',
        actionable: true,
        action: {
          type: 'analyze_vehicle_efficiency',
          label: 'Analyzovat efektivitu',
          payload: { vehicles, shifts }
        },
        reasoning: 'Máte více vozidel a pravidelné směny - optimalizace může ušetřit náklady',
        estimatedBenefit: 'Úspora až 20% nákladů na palivo',
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }

    return recommendations;
  }

  private async generateLearningPathRecommendations(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Cross-module learning optimization
    const languageData = context.recentActivity.find(activity => activity.type === 'language');
    const shiftsData = context.recentActivity.filter(activity => activity.type === 'shift');

    if (languageData && shiftsData.length > 0) {
      const workDays = shiftsData.filter(shift => {
        const shiftDate = new Date(shift.date);
        const dayOfWeek = shiftDate.getDay();
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      });

      if (workDays.length > 2) {
        recommendations.push({
          id: `learning_path_${Date.now()}`,
          type: 'workflow',
          title: 'Integrované učení s prací',
          description: 'Propojte učení němčiny s vaším pracovním harmonogramem',
          sourceModules: ['language', 'shifts'],
          targetModule: 'language',
          confidence: 0.75,
          priority: 'high',
          actionable: true,
          action: {
            type: 'create_integrated_learning_plan',
            label: 'Vytvořit plán',
            payload: { workDays, currentLevel: languageData.level }
          },
          reasoning: 'Pravidelný pracovní rytmus umožňuje efektivní integraci učení',
          estimatedBenefit: 'Rychlejší pokrok o 40%',
          generatedAt: new Date(),
          validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
        });
      }
    }

    return recommendations;
  }

  private async generateFeatureDiscoveryRecommendations(context: RecommendationContext): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Suggest underutilized features based on user activity
    const usedModules = [...new Set(context.recentActivity.map(activity => activity.type))];
    const availableModules = ['shifts', 'language', 'vehicles', 'analytics', 'rideshare'];
    const unusedModules = availableModules.filter(module => !usedModules.includes(module));

    unusedModules.forEach(module => {
      let title = '';
      let description = '';
      let benefit = '';

      switch (module) {
        case 'rideshare':
          title = 'Objevte sdílení jízd';
          description = 'Ušetřete na nákladech na dopravu sdílením jízd s kolegy';
          benefit = 'Úspora až 50% nákladů na palivo';
          break;
        case 'analytics':
          title = 'Pokročilá analytika';
          description = 'Získejte detailní přehled o vašem pokroku a optimalizujte své návyky';
          benefit = 'Zvýšení efektivity o 35%';
          break;
        case 'vehicles':
          title = 'Správa vozidel';
          description = 'Sledujte náklady, servis a efektivitu vašich vozidel';
          benefit = 'Lepší kontrola nad náklady';
          break;
      }

      if (title) {
        recommendations.push({
          id: `feature_${module}_${Date.now()}`,
          type: 'feature',
          title,
          description,
          sourceModules: [context.currentModule],
          targetModule: module,
          confidence: 0.6,
          priority: 'low',
          actionable: true,
          action: {
            type: 'explore_feature',
            label: 'Prozkoumat',
            payload: { module }
          },
          reasoning: `Nevyužíváte funkci ${module}, která by vám mohla pomoci`,
          estimatedBenefit: benefit,
          generatedAt: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    });

    return recommendations;
  }

  getRecommendations(userId: string): SmartRecommendation[] {
    return this.recommendations.get(userId) || [];
  }

  getRecommendationsByModule(userId: string, moduleId: string): SmartRecommendation[] {
    const userRecommendations = this.recommendations.get(userId) || [];
    return userRecommendations.filter(rec => 
      rec.targetModule === moduleId || rec.sourceModules.includes(moduleId)
    );
  }

  dismissRecommendation(userId: string, recommendationId: string): void {
    const userRecommendations = this.recommendations.get(userId) || [];
    const filteredRecommendations = userRecommendations.filter(rec => rec.id !== recommendationId);
    this.recommendations.set(userId, filteredRecommendations);
  }

  // Clean up expired recommendations
  cleanupExpiredRecommendations(): void {
    const now = new Date();
    
    for (const [userId, recommendations] of this.recommendations.entries()) {
      const validRecommendations = recommendations.filter(rec => rec.validUntil > now);
      this.recommendations.set(userId, validRecommendations);
    }
  }
}

export const crossModuleRecommendationsService = CrossModuleRecommendationsService.getInstance();
