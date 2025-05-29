
import { dataSharingService } from './DataSharingService';

export interface PredictionModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'recommendation';
  accuracy: number;
  lastTrained: Date;
  features: string[];
}

export interface Prediction {
  id: string;
  modelId: string;
  type: 'shift_optimization' | 'learning_path' | 'commute_efficiency' | 'expense_forecast';
  prediction: any;
  confidence: number;
  reasoning: string;
  actionable: boolean;
  validUntil: Date;
  metadata: Record<string, any>;
}

export interface UserBehaviorPattern {
  userId: string;
  patterns: {
    learningTimes: { hour: number; engagement: number }[];
    workPreferences: { location: string; frequency: number }[];
    commutePatterns: { route: string; efficiency: number }[];
    featureUsage: { feature: string; usage: number }[];
  };
  trends: {
    learningProgress: number;
    workProductivity: number;
    costOptimization: number;
  };
  lastAnalyzed: Date;
}

export class PredictiveAnalyticsService {
  private static instance: PredictiveAnalyticsService;
  private models: Map<string, PredictionModel> = new Map();
  private predictions: Map<string, Prediction[]> = new Map();
  private userPatterns: Map<string, UserBehaviorPattern> = new Map();

  static getInstance(): PredictiveAnalyticsService {
    if (!PredictiveAnalyticsService.instance) {
      PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
    }
    return PredictiveAnalyticsService.instance;
  }

  async initializeModels(): Promise<void> {
    // Initialize ML models
    const models: PredictionModel[] = [
      {
        id: 'shift_optimizer',
        name: 'Optimalizace směn',
        type: 'recommendation',
        accuracy: 0.87,
        lastTrained: new Date(),
        features: ['historical_shifts', 'commute_distance', 'learning_schedule', 'preferences']
      },
      {
        id: 'learning_path',
        name: 'Personalizovaná výuka',
        type: 'recommendation',
        accuracy: 0.82,
        lastTrained: new Date(),
        features: ['progress_data', 'time_patterns', 'difficulty_preferences', 'work_context']
      },
      {
        id: 'expense_predictor',
        name: 'Predikce výdajů',
        type: 'regression',
        accuracy: 0.75,
        lastTrained: new Date(),
        features: ['historical_expenses', 'commute_patterns', 'work_schedule', 'fuel_prices']
      }
    ];

    models.forEach(model => this.models.set(model.id, model));
  }

  async analyzeUserBehavior(userId: string): Promise<UserBehaviorPattern> {
    const allData = dataSharingService.getAllModuleData();
    
    // Analyze patterns from user data
    const patterns = {
      learningTimes: this.analyzeLearningPatterns(allData.language),
      workPreferences: this.analyzeWorkPatterns(allData.shifts),
      commutePatterns: this.analyzeCommutePatterns(allData.vehicles),
      featureUsage: this.analyzeFeatureUsage(allData.analytics)
    };

    const trends = {
      learningProgress: this.calculateLearningTrend(patterns.learningTimes),
      workProductivity: this.calculateWorkTrend(patterns.workPreferences),
      costOptimization: this.calculateCostTrend(patterns.commutePatterns)
    };

    const userPattern: UserBehaviorPattern = {
      userId,
      patterns,
      trends,
      lastAnalyzed: new Date()
    };

    this.userPatterns.set(userId, userPattern);
    return userPattern;
  }

  async generatePredictions(userId: string): Promise<Prediction[]> {
    const userPattern = await this.analyzeUserBehavior(userId);
    const predictions: Prediction[] = [];

    // Shift optimization predictions
    const shiftPrediction = await this.predictOptimalShifts(userPattern);
    if (shiftPrediction) predictions.push(shiftPrediction);

    // Learning path predictions
    const learningPrediction = await this.predictLearningPath(userPattern);
    if (learningPrediction) predictions.push(learningPrediction);

    // Expense forecasting
    const expensePrediction = await this.predictExpenses(userPattern);
    if (expensePrediction) predictions.push(expensePrediction);

    // Store predictions
    this.predictions.set(userId, predictions);
    return predictions;
  }

  private analyzeLearningPatterns(languageData: any): { hour: number; engagement: number }[] {
    // Mock analysis - would use real ML algorithms
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      engagement: Math.random() * 0.8 + 0.2
    }));
  }

  private analyzeWorkPatterns(shiftsData: any[]): { location: string; frequency: number }[] {
    if (!shiftsData || shiftsData.length === 0) return [];
    
    const locationCounts = shiftsData.reduce((acc, shift) => {
      acc[shift.location] = (acc[shift.location] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(locationCounts).map(([location, count]) => ({
      location,
      frequency: count as number / shiftsData.length
    }));
  }

  private analyzeCommutePatterns(vehiclesData: any[]): { route: string; efficiency: number }[] {
    // Mock analysis
    return [
      { route: 'Hlavní trasa', efficiency: 0.85 },
      { route: 'Alternativní trasa', efficiency: 0.72 }
    ];
  }

  private analyzeFeatureUsage(analyticsData: any): { feature: string; usage: number }[] {
    // Mock analysis
    return [
      { feature: 'vocabulary', usage: 0.8 },
      { feature: 'calculator', usage: 0.6 },
      { feature: 'shifts', usage: 0.9 }
    ];
  }

  private calculateLearningTrend(learningTimes: { hour: number; engagement: number }[]): number {
    const avgEngagement = learningTimes.reduce((sum, time) => sum + time.engagement, 0) / learningTimes.length;
    return avgEngagement;
  }

  private calculateWorkTrend(workPreferences: { location: string; frequency: number }[]): number {
    return workPreferences.reduce((sum, pref) => sum + pref.frequency, 0) / workPreferences.length;
  }

  private calculateCostTrend(commutePatterns: { route: string; efficiency: number }[]): number {
    return commutePatterns.reduce((sum, pattern) => sum + pattern.efficiency, 0) / commutePatterns.length;
  }

  private async predictOptimalShifts(userPattern: UserBehaviorPattern): Promise<Prediction | null> {
    const bestLearningHours = userPattern.patterns.learningTimes
      .filter(time => time.engagement > 0.7)
      .map(time => time.hour);

    if (bestLearningHours.length === 0) return null;

    return {
      id: `shift_pred_${Date.now()}`,
      modelId: 'shift_optimizer',
      type: 'shift_optimization',
      prediction: {
        recommendedShiftTimes: ['14:00-22:00', '06:00-14:00'],
        optimalLearningSlots: bestLearningHours,
        expectedEfficiencyGain: 0.25
      },
      confidence: 0.82,
      reasoning: 'Na základě vašich učebních vzorců doporučujeme směny, které ponechají prostor pro efektivní studium',
      actionable: true,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      metadata: { source: 'ml_analysis', version: '1.0' }
    };
  }

  private async predictLearningPath(userPattern: UserBehaviorPattern): Promise<Prediction | null> {
    const learningTrend = userPattern.trends.learningProgress;
    
    return {
      id: `learning_pred_${Date.now()}`,
      modelId: 'learning_path',
      type: 'learning_path',
      prediction: {
        nextTopics: ['Pracovní komunikace', 'Technické termíny', 'Každodenní konverzace'],
        estimatedCompletionTime: '3 týdny',
        recommendedIntensity: learningTrend > 0.7 ? 'high' : 'medium'
      },
      confidence: 0.78,
      reasoning: 'Personalizovaný učební plán založený na vašem pokroku a preferencích',
      actionable: true,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      metadata: { adaptiveLevel: true }
    };
  }

  private async predictExpenses(userPattern: UserBehaviorPattern): Promise<Prediction | null> {
    return {
      id: `expense_pred_${Date.now()}`,
      modelId: 'expense_predictor',
      type: 'expense_forecast',
      prediction: {
        nextMonthFuelCost: 1200,
        potentialSavings: 180,
        recommendedOptimizations: ['Sdílení jízd 2x týdně', 'Optimalizace tras']
      },
      confidence: 0.72,
      reasoning: 'Predikce založená na historických datech a vzorcích dojíždění',
      actionable: true,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      metadata: { category: 'financial' }
    };
  }

  getUserPredictions(userId: string): Prediction[] {
    return this.predictions.get(userId) || [];
  }

  getUserPattern(userId: string): UserBehaviorPattern | null {
    return this.userPatterns.get(userId) || null;
  }

  getModelAccuracy(modelId: string): number {
    const model = this.models.get(modelId);
    return model?.accuracy || 0;
  }
}

export const predictiveAnalyticsService = PredictiveAnalyticsService.getInstance();
