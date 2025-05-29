
export interface UserBehaviorData {
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  context: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface LearningPattern {
  userId: string;
  preferredTimes: Array<{ hour: number; engagement: number }>;
  optimalSessionLength: number;
  strongAreas: string[];
  weakAreas: string[];
  learningVelocity: number;
  retentionRate: number;
  lastAnalyzed: Date;
}

export interface PredictiveInsight {
  type: 'performance' | 'difficulty' | 'engagement' | 'retention';
  prediction: string;
  confidence: number;
  suggestedActions: string[];
  timeframe: string;
  basedOn: string[];
}

export interface AnalyticsReport {
  reportId: string;
  userId: string;
  type: 'learning' | 'performance' | 'engagement' | 'comprehensive';
  generatedAt: Date;
  data: Record<string, any>;
  insights: PredictiveInsight[];
  recommendations: string[];
  visualizations: Array<{
    type: string;
    data: any[];
    config: Record<string, any>;
  }>;
}

export class AdvancedAnalyticsService {
  private static instance: AdvancedAnalyticsService;
  private behaviorData: Map<string, UserBehaviorData[]> = new Map();
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private analyticsQueue: UserBehaviorData[] = [];
  private isProcessing = false;

  static getInstance(): AdvancedAnalyticsService {
    if (!AdvancedAnalyticsService.instance) {
      AdvancedAnalyticsService.instance = new AdvancedAnalyticsService();
    }
    return AdvancedAnalyticsService.instance;
  }

  // Advanced Behavior Tracking
  async trackUserBehavior(data: Omit<UserBehaviorData, 'timestamp'>): Promise<void> {
    const behaviorEntry: UserBehaviorData = {
      ...data,
      timestamp: new Date()
    };

    // Add to queue for batch processing
    this.analyticsQueue.push(behaviorEntry);
    
    // Store in memory for real-time analysis
    const userBehavior = this.behaviorData.get(data.userId) || [];
    userBehavior.push(behaviorEntry);
    this.behaviorData.set(data.userId, userBehavior);

    // Process queue if it gets large
    if (this.analyticsQueue.length >= 50 && !this.isProcessing) {
      await this.processBehaviorQueue();
    }

    console.log('User behavior tracked:', data.action);
  }

  // AI-Powered Learning Pattern Analysis
  async analyzeLearningPatterns(userId: string): Promise<LearningPattern> {
    const userBehavior = this.behaviorData.get(userId) || [];
    
    if (userBehavior.length < 10) {
      throw new Error('Insufficient data for pattern analysis');
    }

    // Analyze preferred learning times
    const hourlyEngagement = new Array(24).fill(0).map((_, hour) => ({
      hour,
      sessions: 0,
      engagement: 0
    }));

    userBehavior.forEach(behavior => {
      const hour = behavior.timestamp.getHours();
      hourlyEngagement[hour].sessions++;
      
      // Calculate engagement based on action type
      const engagementScore = this.calculateEngagementScore(behavior);
      hourlyEngagement[hour].engagement += engagementScore;
    });

    const preferredTimes = hourlyEngagement
      .filter(h => h.sessions > 0)
      .map(h => ({
        hour: h.hour,
        engagement: h.sessions > 0 ? h.engagement / h.sessions : 0
      }))
      .sort((a, b) => b.engagement - a.engagement);

    // Analyze session patterns
    const sessions = this.groupBehaviorIntoSessions(userBehavior);
    const avgSessionLength = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;

    // Identify strong and weak areas
    const areaPerformance = this.analyzeAreaPerformance(userBehavior);
    const strongAreas = areaPerformance
      .filter(area => area.performance > 0.7)
      .map(area => area.name);
    const weakAreas = areaPerformance
      .filter(area => area.performance < 0.4)
      .map(area => area.name);

    // Calculate learning velocity and retention
    const learningVelocity = this.calculateLearningVelocity(userBehavior);
    const retentionRate = this.calculateRetentionRate(userBehavior);

    const pattern: LearningPattern = {
      userId,
      preferredTimes,
      optimalSessionLength: Math.round(avgSessionLength),
      strongAreas,
      weakAreas,
      learningVelocity,
      retentionRate,
      lastAnalyzed: new Date()
    };

    this.learningPatterns.set(userId, pattern);
    await this.persistLearningPattern(pattern);

    return pattern;
  }

  // Predictive Analytics
  async generatePredictiveInsights(userId: string): Promise<PredictiveInsight[]> {
    const pattern = await this.analyzeLearningPatterns(userId);
    const insights: PredictiveInsight[] = [];

    // Performance prediction
    if (pattern.learningVelocity > 0.8) {
      insights.push({
        type: 'performance',
        prediction: 'Uživatel pravděpodobně dosáhne pokročilé úrovně do 3 měsíců',
        confidence: 0.85,
        suggestedActions: [
          'Zavést pokročilejší obsah',
          'Zvýšit složitost cvičení',
          'Nastavit ambicióznější cíle'
        ],
        timeframe: '3 měsíce',
        basedOn: ['learning_velocity', 'session_consistency']
      });
    }

    // Engagement prediction
    const avgEngagement = pattern.preferredTimes.reduce((sum, t) => sum + t.engagement, 0) / pattern.preferredTimes.length;
    if (avgEngagement < 0.5) {
      insights.push({
        type: 'engagement',
        prediction: 'Riziko snížení motivace v příštích 2 týdnech',
        confidence: 0.72,
        suggestedActions: [
          'Poslat motivační notifikaci',
          'Navrhnout kratší lekce',
          'Přidat gamifikační prvky'
        ],
        timeframe: '2 týdny',
        basedOn: ['engagement_trend', 'session_frequency']
      });
    }

    // Difficulty prediction
    if (pattern.weakAreas.length > pattern.strongAreas.length) {
      insights.push({
        type: 'difficulty',
        prediction: 'Uživatel může mít problémy s aktuální úrovní obtížnosti',
        confidence: 0.68,
        suggestedActions: [
          'Snížit obtížnost v slabých oblastech',
          'Přidat dodatečná cvičení',
          'Nabídnout personalizované tipy'
        ],
        timeframe: '1 týden',
        basedOn: ['weak_areas_ratio', 'error_patterns']
      });
    }

    // Retention prediction
    if (pattern.retentionRate < 0.6) {
      insights.push({
        type: 'retention',
        prediction: 'Vysoké riziko opuštění aplikace',
        confidence: 0.79,
        suggestedActions: [
          'Aktivní re-engagement kampaň',
          'Personalizada content',
          'Sociální funkce'
        ],
        timeframe: '1 měsíc',
        basedOn: ['retention_rate', 'session_gaps']
      });
    }

    return insights;
  }

  // Comprehensive Analytics Report
  async generateAdvancedReport(userId: string, type: AnalyticsReport['type']): Promise<AnalyticsReport> {
    const pattern = await this.analyzeLearningPatterns(userId);
    const insights = await this.generatePredictiveInsights(userId);
    const userBehavior = this.behaviorData.get(userId) || [];

    const reportData = {
      totalSessions: this.groupBehaviorIntoSessions(userBehavior).length,
      totalTimeSpent: this.calculateTotalTimeSpent(userBehavior),
      averageSessionLength: pattern.optimalSessionLength,
      engagementTrend: this.calculateEngagementTrend(userBehavior),
      performanceMetrics: this.calculatePerformanceMetrics(userBehavior),
      learningProgress: this.calculateLearningProgress(userBehavior)
    };

    const visualizations = [
      {
        type: 'line_chart',
        data: this.getEngagementOverTime(userBehavior),
        config: { title: 'Engagement v čase', xAxis: 'Datum', yAxis: 'Engagement' }
      },
      {
        type: 'bar_chart',
        data: pattern.preferredTimes.slice(0, 8),
        config: { title: 'Preferované časy učení', xAxis: 'Hodina', yAxis: 'Engagement' }
      },
      {
        type: 'pie_chart',
        data: this.getAreaDistribution(userBehavior),
        config: { title: 'Distribuce učebních oblastí' }
      }
    ];

    const recommendations = this.generateRecommendations(pattern, insights);

    return {
      reportId: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      generatedAt: new Date(),
      data: reportData,
      insights,
      recommendations,
      visualizations
    };
  }

  // Helper methods
  private calculateEngagementScore(behavior: UserBehaviorData): number {
    const actionScores: Record<string, number> = {
      'lesson_completed': 1.0,
      'exercise_completed': 0.8,
      'vocabulary_learned': 0.7,
      'quiz_answered': 0.6,
      'page_visited': 0.3,
      'session_started': 0.2
    };
    
    return actionScores[behavior.action] || 0.1;
  }

  private groupBehaviorIntoSessions(behavior: UserBehaviorData[]): Array<{
    start: Date;
    end: Date;
    duration: number;
    actions: number;
  }> {
    const sessions: Array<{ start: Date; end: Date; duration: number; actions: number }> = [];
    let currentSession: { start: Date; end: Date; actions: UserBehaviorData[] } | null = null;
    
    const sortedBehavior = [...behavior].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    for (const action of sortedBehavior) {
      if (!currentSession || action.timestamp.getTime() - currentSession.end.getTime() > 30 * 60 * 1000) {
        // New session (30 minute gap)
        if (currentSession) {
          sessions.push({
            start: currentSession.start,
            end: currentSession.end,
            duration: currentSession.end.getTime() - currentSession.start.getTime(),
            actions: currentSession.actions.length
          });
        }
        currentSession = {
          start: action.timestamp,
          end: action.timestamp,
          actions: [action]
        };
      } else {
        currentSession.end = action.timestamp;
        currentSession.actions.push(action);
      }
    }
    
    if (currentSession) {
      sessions.push({
        start: currentSession.start,
        end: currentSession.end,
        duration: currentSession.end.getTime() - currentSession.start.getTime(),
        actions: currentSession.actions.length
      });
    }
    
    return sessions;
  }

  private analyzeAreaPerformance(behavior: UserBehaviorData[]): Array<{ name: string; performance: number }> {
    const areas = new Map<string, { total: number; successful: number }>();
    
    behavior.forEach(b => {
      const area = b.context.area || 'general';
      const current = areas.get(area) || { total: 0, successful: 0 };
      current.total++;
      
      if (b.context.success || b.action.includes('completed')) {
        current.successful++;
      }
      
      areas.set(area, current);
    });
    
    return Array.from(areas.entries()).map(([name, stats]) => ({
      name,
      performance: stats.total > 0 ? stats.successful / stats.total : 0
    }));
  }

  private calculateLearningVelocity(behavior: UserBehaviorData[]): number {
    const completionActions = behavior.filter(b => 
      b.action.includes('completed') || b.action.includes('learned')
    );
    
    if (completionActions.length < 2) return 0;
    
    const timeSpan = completionActions[completionActions.length - 1].timestamp.getTime() - 
                    completionActions[0].timestamp.getTime();
    const days = timeSpan / (1000 * 60 * 60 * 24);
    
    return days > 0 ? completionActions.length / days : 0;
  }

  private calculateRetentionRate(behavior: UserBehaviorData[]): number {
    const sessions = this.groupBehaviorIntoSessions(behavior);
    if (sessions.length < 2) return 1;
    
    const gaps = [];
    for (let i = 1; i < sessions.length; i++) {
      const gap = sessions[i].start.getTime() - sessions[i - 1].end.getTime();
      gaps.push(gap / (1000 * 60 * 60 * 24)); // Days
    }
    
    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    return Math.max(0, Math.min(1, 1 - (avgGap / 7))); // Normalize to 0-1 based on 7-day ideal
  }

  private async processBehaviorQueue(): Promise<void> {
    if (this.isProcessing || this.analyticsQueue.length === 0) return;
    
    this.isProcessing = true;
    try {
      const batch = this.analyticsQueue.splice(0, 50);
      
      // Save to persistent storage
      await this.persistBehaviorData(batch);
      
      console.log(`Processed ${batch.length} behavior entries`);
    } catch (error) {
      console.error('Error processing behavior queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private calculateTotalTimeSpent(behavior: UserBehaviorData[]): number {
    const sessions = this.groupBehaviorIntoSessions(behavior);
    return sessions.reduce((total, session) => total + session.duration, 0);
  }

  private calculateEngagementTrend(behavior: UserBehaviorData[]): Array<{ date: string; engagement: number }> {
    const dailyEngagement = new Map<string, { total: number; count: number }>();
    
    behavior.forEach(b => {
      const date = b.timestamp.toISOString().split('T')[0];
      const current = dailyEngagement.get(date) || { total: 0, count: 0 };
      current.total += this.calculateEngagementScore(b);
      current.count++;
      dailyEngagement.set(date, current);
    });
    
    return Array.from(dailyEngagement.entries()).map(([date, stats]) => ({
      date,
      engagement: stats.count > 0 ? stats.total / stats.count : 0
    }));
  }

  private calculatePerformanceMetrics(behavior: UserBehaviorData[]): Record<string, number> {
    const completions = behavior.filter(b => b.action.includes('completed')).length;
    const attempts = behavior.filter(b => b.action.includes('started') || b.action.includes('attempted')).length;
    
    return {
      completionRate: attempts > 0 ? completions / attempts : 0,
      averageAccuracy: this.calculateAverageAccuracy(behavior),
      consistencyScore: this.calculateConsistencyScore(behavior)
    };
  }

  private calculateAverageAccuracy(behavior: UserBehaviorData[]): number {
    const accuracyData = behavior
      .filter(b => b.context.accuracy !== undefined)
      .map(b => b.context.accuracy);
    
    return accuracyData.length > 0 
      ? accuracyData.reduce((sum, acc) => sum + acc, 0) / accuracyData.length 
      : 0;
  }

  private calculateConsistencyScore(behavior: UserBehaviorData[]): number {
    const sessions = this.groupBehaviorIntoSessions(behavior);
    if (sessions.length < 2) return 1;
    
    const sessionLengths = sessions.map(s => s.duration);
    const avgLength = sessionLengths.reduce((sum, len) => sum + len, 0) / sessionLengths.length;
    const variance = sessionLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sessionLengths.length;
    
    return Math.max(0, 1 - (Math.sqrt(variance) / avgLength));
  }

  private calculateLearningProgress(behavior: UserBehaviorData[]): Array<{ skill: string; progress: number }> {
    const skillProgress = new Map<string, number>();
    
    behavior.forEach(b => {
      if (b.context.skill && b.context.progress !== undefined) {
        skillProgress.set(b.context.skill, Math.max(
          skillProgress.get(b.context.skill) || 0,
          b.context.progress
        ));
      }
    });
    
    return Array.from(skillProgress.entries()).map(([skill, progress]) => ({
      skill,
      progress
    }));
  }

  private getEngagementOverTime(behavior: UserBehaviorData[]): Array<{ x: string; y: number }> {
    const trend = this.calculateEngagementTrend(behavior);
    return trend.map(t => ({ x: t.date, y: t.engagement }));
  }

  private getAreaDistribution(behavior: UserBehaviorData[]): Array<{ label: string; value: number }> {
    const areas = new Map<string, number>();
    
    behavior.forEach(b => {
      const area = b.context.area || 'Obecné';
      areas.set(area, (areas.get(area) || 0) + 1);
    });
    
    return Array.from(areas.entries()).map(([label, value]) => ({ label, value }));
  }

  private generateRecommendations(pattern: LearningPattern, insights: PredictiveInsight[]): string[] {
    const recommendations: string[] = [];
    
    // Time-based recommendations
    const bestHours = pattern.preferredTimes.slice(0, 3).map(t => t.hour);
    if (bestHours.length > 0) {
      recommendations.push(`Doporučujeme učit se v ${bestHours.join(', ')} hodin pro maximální efektivitu`);
    }
    
    // Session length recommendations
    if (pattern.optimalSessionLength < 15) {
      recommendations.push('Zkuste prodloužit učební lekce na 15-20 minut pro lepší výsledky');
    } else if (pattern.optimalSessionLength > 45) {
      recommendations.push('Kratší, častější lekce mohou být efektivnější než dlouhé studijní bloky');
    }
    
    // Area-specific recommendations
    if (pattern.weakAreas.length > 0) {
      recommendations.push(`Zaměřte se na zlepšení v oblastech: ${pattern.weakAreas.join(', ')}`);
    }
    
    // AI-driven recommendations from insights
    insights.forEach(insight => {
      insight.suggestedActions.forEach(action => {
        if (!recommendations.includes(action)) {
          recommendations.push(action);
        }
      });
    });
    
    return recommendations;
  }

  private async persistBehaviorData(data: UserBehaviorData[]): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`behavior_data_${Date.now()}`, serialized);
    } catch (error) {
      console.error('Error persisting behavior data:', error);
    }
  }

  private async persistLearningPattern(pattern: LearningPattern): Promise<void> {
    try {
      localStorage.setItem(`learning_pattern_${pattern.userId}`, JSON.stringify(pattern));
    } catch (error) {
      console.error('Error persisting learning pattern:', error);
    }
  }
}

export const advancedAnalyticsService = AdvancedAnalyticsService.getInstance();
