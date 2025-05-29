
export interface UserProfile {
  userId: string;
  preferences: {
    language: {
      learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      focusAreas: string[];
      dailyGoal: number; // minutes
    };
    work: {
      preferredShiftTypes: string[];
      locations: string[];
      flexibility: 'high' | 'medium' | 'low';
    };
    interface: {
      theme: 'light' | 'dark' | 'auto';
      compactMode: boolean;
      notifications: boolean;
      animations: boolean;
    };
    analytics: {
      detailLevel: 'basic' | 'detailed' | 'expert';
      reportFrequency: 'daily' | 'weekly' | 'monthly';
    };
  };
  behaviorPatterns: {
    activeHours: number[];
    featureUsage: Record<string, number>;
    learningVelocity: number;
  };
  goals: {
    language: { target: string; deadline: Date }[];
    work: { target: string; deadline: Date }[];
    financial: { target: string; deadline: Date }[];
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface PersonalizationRule {
  id: string;
  condition: (profile: UserProfile) => boolean;
  action: {
    type: 'recommend' | 'customize' | 'prioritize' | 'hide';
    target: string;
    parameters: Record<string, any>;
  };
  priority: number;
}

export interface AdaptiveContent {
  id: string;
  type: 'widget' | 'lesson' | 'tip' | 'feature';
  content: any;
  targetProfiles: string[];
  effectiveness: number;
  lastUpdated: Date;
}

export class PersonalizationEngine {
  private static instance: PersonalizationEngine;
  private userProfiles: Map<string, UserProfile> = new Map();
  private rules: PersonalizationRule[] = [];
  private adaptiveContent: Map<string, AdaptiveContent> = new Map();

  static getInstance(): PersonalizationEngine {
    if (!PersonalizationEngine.instance) {
      PersonalizationEngine.instance = new PersonalizationEngine();
    }
    return PersonalizationEngine.instance;
  }

  async initializePersonalization(): Promise<void> {
    // Initialize default personalization rules
    this.rules = [
      {
        id: 'beginner_focus',
        condition: (profile) => profile.preferences.language.difficulty === 'beginner',
        action: {
          type: 'prioritize',
          target: 'basic_vocabulary',
          parameters: { weight: 2.0 }
        },
        priority: 10
      },
      {
        id: 'work_focused',
        condition: (profile) => profile.preferences.language.focusAreas.includes('work'),
        action: {
          type: 'recommend',
          target: 'work_vocabulary_pack',
          parameters: { frequency: 'daily' }
        },
        priority: 8
      },
      {
        id: 'compact_interface',
        condition: (profile) => profile.preferences.interface.compactMode,
        action: {
          type: 'customize',
          target: 'dashboard_layout',
          parameters: { density: 'high', spacing: 'minimal' }
        },
        priority: 5
      }
    ];

    // Initialize adaptive content
    await this.loadAdaptiveContent();
  }

  async createUserProfile(userId: string, initialPreferences?: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    const defaultProfile: UserProfile = {
      userId,
      preferences: {
        language: {
          learningStyle: 'mixed',
          difficulty: 'beginner',
          focusAreas: [],
          dailyGoal: 15
        },
        work: {
          preferredShiftTypes: [],
          locations: [],
          flexibility: 'medium'
        },
        interface: {
          theme: 'auto',
          compactMode: false,
          notifications: true,
          animations: true
        },
        analytics: {
          detailLevel: 'basic',
          reportFrequency: 'weekly'
        }
      },
      behaviorPatterns: {
        activeHours: [],
        featureUsage: {},
        learningVelocity: 1.0
      },
      goals: {
        language: [],
        work: [],
        financial: []
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    // Merge with initial preferences if provided
    if (initialPreferences) {
      defaultProfile.preferences = { ...defaultProfile.preferences, ...initialPreferences };
    }

    this.userProfiles.set(userId, defaultProfile);
    return defaultProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existingProfile = this.userProfiles.get(userId);
    if (!existingProfile) {
      throw new Error(`User profile not found: ${userId}`);
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...updates,
      preferences: { ...existingProfile.preferences, ...updates.preferences },
      lastUpdated: new Date()
    };

    this.userProfiles.set(userId, updatedProfile);
    
    // Trigger re-personalization
    await this.applyPersonalization(userId);
    
    return updatedProfile;
  }

  async recordUserBehavior(userId: string, action: string, context: Record<string, any>): Promise<void> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    // Update behavior patterns
    const currentHour = new Date().getHours();
    if (!profile.behaviorPatterns.activeHours.includes(currentHour)) {
      profile.behaviorPatterns.activeHours.push(currentHour);
    }

    // Update feature usage
    profile.behaviorPatterns.featureUsage[action] = 
      (profile.behaviorPatterns.featureUsage[action] || 0) + 1;

    // Update learning velocity based on completion rates
    if (context.completed && context.timeSpent) {
      const expectedTime = context.expectedTime || context.timeSpent;
      const efficiency = expectedTime / context.timeSpent;
      profile.behaviorPatterns.learningVelocity = 
        (profile.behaviorPatterns.learningVelocity + efficiency) / 2;
    }

    profile.lastUpdated = new Date();
    this.userProfiles.set(userId, profile);
  }

  async applyPersonalization(userId: string): Promise<any> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const personalizations = {
      dashboard: await this.personalizeDashboard(profile),
      content: await this.personalizeContent(profile),
      notifications: await this.personalizeNotifications(profile),
      learning: await this.personalizeLearning(profile)
    };

    return personalizations;
  }

  private async personalizeDashboard(profile: UserProfile): Promise<any> {
    const appliedRules = this.rules.filter(rule => rule.condition(profile));
    
    const dashboardConfig = {
      theme: profile.preferences.interface.theme,
      compactMode: profile.preferences.interface.compactMode,
      prioritizedWidgets: [],
      hiddenFeatures: [],
      customLayout: null
    };

    appliedRules.forEach(rule => {
      if (rule.action.type === 'prioritize') {
        dashboardConfig.prioritizedWidgets.push(rule.action.target);
      } else if (rule.action.type === 'hide') {
        dashboardConfig.hiddenFeatures.push(rule.action.target);
      } else if (rule.action.type === 'customize') {
        dashboardConfig.customLayout = rule.action.parameters;
      }
    });

    return dashboardConfig;
  }

  private async personalizeContent(profile: UserProfile): Promise<any> {
    const recommendations = [];
    
    // Content based on learning style
    if (profile.preferences.language.learningStyle === 'visual') {
      recommendations.push({
        type: 'content',
        item: 'visual_vocabulary_cards',
        reason: 'Matches your visual learning style'
      });
    }

    // Content based on focus areas
    profile.preferences.language.focusAreas.forEach(area => {
      recommendations.push({
        type: 'content',
        item: `${area}_specialized_content`,
        reason: `Supports your focus on ${area}`
      });
    });

    return { recommendations };
  }

  private async personalizeNotifications(profile: UserProfile): Promise<any> {
    if (!profile.preferences.interface.notifications) {
      return { enabled: false };
    }

    const optimalTimes = profile.behaviorPatterns.activeHours
      .sort((a, b) => b - a)
      .slice(0, 3);

    return {
      enabled: true,
      optimalTimes,
      frequency: profile.preferences.analytics.reportFrequency,
      types: {
        learning: true,
        work: true,
        achievements: true,
        tips: profile.preferences.analytics.detailLevel !== 'basic'
      }
    };
  }

  private async personalizeLearning(profile: UserProfile): Promise<any> {
    const learningPlan = {
      difficulty: profile.preferences.language.difficulty,
      sessionLength: Math.round(profile.preferences.language.dailyGoal / profile.behaviorPatterns.learningVelocity),
      focusAreas: profile.preferences.language.focusAreas,
      adaptiveContent: [],
      nextMilestones: []
    };

    // Add adaptive content based on performance
    const relevantContent = Array.from(this.adaptiveContent.values())
      .filter(content => content.type === 'lesson')
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 5);

    learningPlan.adaptiveContent = relevantContent.map(content => ({
      id: content.id,
      content: content.content,
      effectiveness: content.effectiveness
    }));

    return learningPlan;
  }

  private async loadAdaptiveContent(): Promise<void> {
    // Mock adaptive content - would be loaded from AI/ML system
    const content: AdaptiveContent[] = [
      {
        id: 'work_vocab_1',
        type: 'lesson',
        content: {
          title: 'Pracovní komunikace - základy',
          items: ['Guten Morgen', 'Ich arbeite hier', 'Können Sie mir helfen?']
        },
        targetProfiles: ['work_focused', 'beginner'],
        effectiveness: 0.85,
        lastUpdated: new Date()
      },
      {
        id: 'visual_cards_1',
        type: 'widget',
        content: {
          type: 'image_vocabulary',
          cards: 20,
          category: 'tools'
        },
        targetProfiles: ['visual_learner'],
        effectiveness: 0.78,
        lastUpdated: new Date()
      }
    ];

    content.forEach(item => this.adaptiveContent.set(item.id, item));
  }

  getUserProfile(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  async getPersonalizedRecommendations(userId: string): Promise<any[]> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const personalizations = await this.applyPersonalization(userId);
    return personalizations.content?.recommendations || [];
  }

  async updatePersonalizationEffectiveness(contentId: string, effectiveness: number): Promise<void> {
    const content = this.adaptiveContent.get(contentId);
    if (content) {
      content.effectiveness = (content.effectiveness + effectiveness) / 2;
      content.lastUpdated = new Date();
      this.adaptiveContent.set(contentId, content);
    }
  }
}

export const personalizationEngine = PersonalizationEngine.getInstance();
