
export interface ConflictResolution {
  strategy: 'client-wins' | 'server-wins' | 'merge' | 'prompt-user';
  resolver?: (local: any, remote: any) => any;
}

export class ConflictResolutionService {
  private conflictResolution: Map<string, ConflictResolution> = new Map();

  constructor() {
    this.initializeDefaultResolutions();
  }

  // Initialize default conflict resolution strategies
  private initializeDefaultResolutions() {
    this.conflictResolution.set('shifts', {
      strategy: 'merge',
      resolver: (local, remote) => ({
        ...remote,
        notes: local.notes || remote.notes, // Prefer local notes
        updated_at: Math.max(
          new Date(local.updated_at).getTime(),
          new Date(remote.updated_at).getTime()
        )
      })
    });

    this.conflictResolution.set('vehicles', {
      strategy: 'server-wins' // Vehicle data should come from server
    });

    this.conflictResolution.set('vocabulary', {
      strategy: 'merge',
      resolver: (local, remote) => ({
        ...remote,
        lastReviewed: Math.max(
          new Date(local.lastReviewed || 0).getTime(),
          new Date(remote.lastReviewed || 0).getTime()
        ),
        reviewCount: Math.max(local.reviewCount || 0, remote.reviewCount || 0),
        correctCount: Math.max(local.correctCount || 0, remote.correctCount || 0)
      })
    });
  }

  // Resolve conflicts between local and remote data
  async resolveConflict(entity: string, local: any, remote: any): Promise<any> {
    const resolution = this.conflictResolution.get(entity) || { strategy: 'server-wins' };

    switch (resolution.strategy) {
      case 'client-wins':
        return local;
      
      case 'server-wins':
        return remote;
      
      case 'merge':
        if (resolution.resolver) {
          return resolution.resolver(local, remote);
        }
        return { ...local, ...remote }; // Simple merge
      
      case 'prompt-user':
        // In a real app, this would show a UI for user to resolve
        console.warn('User conflict resolution not implemented, defaulting to server-wins');
        return remote;
      
      default:
        return remote;
    }
  }

  // Set custom conflict resolution
  setConflictResolution(entity: string, resolution: ConflictResolution) {
    this.conflictResolution.set(entity, resolution);
  }

  // Get current resolution strategy for entity
  getResolutionStrategy(entity: string): ConflictResolution | undefined {
    return this.conflictResolution.get(entity);
  }

  // Check if conflicts exist between two datasets
  hasConflicts(local: any, remote: any): boolean {
    if (!local || !remote) return false;
    
    // Simple conflict detection based on updated_at
    const localTime = new Date(local.updated_at || 0).getTime();
    const remoteTime = new Date(remote.updated_at || 0).getTime();
    
    return Math.abs(localTime - remoteTime) > 1000; // 1 second tolerance
  }
}
