
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GitMerge, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { ConflictData, ConflictResolution, advancedConflictResolver } from './ConflictResolutionService';
import { ConflictPreview } from './ConflictPreview';
import { ConflictResolutionOptions } from './ConflictResolutionOptions';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ConflictResolutionDialogProps {
  conflicts: ConflictData[];
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolutions: Map<string, ConflictResolution>) => Promise<void>;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflicts,
  isOpen,
  onClose,
  onResolve
}) => {
  const [currentConflictIndex, setCurrentConflictIndex] = useState(0);
  const [resolutions, setResolutions] = useState<Map<string, ConflictResolution>>(new Map());
  const [processing, setProcessing] = useState(false);
  const [autoResolveAttempted, setAutoResolveAttempted] = useState(false);

  const currentConflict = conflicts[currentConflictIndex];

  useEffect(() => {
    if (conflicts.length > 0 && !autoResolveAttempted) {
      attemptAutoResolve();
      setAutoResolveAttempted(true);
    }
  }, [conflicts, autoResolveAttempted]);

  const attemptAutoResolve = async () => {
    const newResolutions = new Map<string, ConflictResolution>();
    
    for (const conflict of conflicts) {
      try {
        const resolution = await advancedConflictResolver.resolveConflictAutomatically(conflict);
        if (resolution.action !== 'manual') {
          newResolutions.set(conflict.id, resolution);
        }
      } catch (error) {
        console.error('Auto-resolve failed for conflict:', conflict.id, error);
      }
    }
    
    setResolutions(newResolutions);
  };

  const handleResolutionChange = (conflictId: string, resolution: ConflictResolution) => {
    const newResolutions = new Map(resolutions);
    newResolutions.set(conflictId, resolution);
    setResolutions(newResolutions);
  };

  const handleResolveAll = async () => {
    setProcessing(true);
    const startTime = Date.now();
    
    try {
      await onResolve(resolutions);
      
      // Record analytics
      const resolutionTime = Date.now() - startTime;
      resolutions.forEach(resolution => {
        advancedConflictResolver.recordResolution(resolution, resolutionTime);
      });
      
      onClose();
    } catch (error) {
      console.error('Error resolving conflicts:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getConflictTypeColor = (type: ConflictData['conflictType']) => {
    switch (type) {
      case 'concurrent_edit': return 'bg-amber-100 text-amber-800';
      case 'version_mismatch': return 'bg-red-100 text-red-800';
      case 'field_level': return 'bg-blue-100 text-blue-800';
      case 'delete_edit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConflictTypeLabel = (type: ConflictData['conflictType']) => {
    switch (type) {
      case 'concurrent_edit': return 'Souběžné úpravy';
      case 'version_mismatch': return 'Rozdílné verze';
      case 'field_level': return 'Konflikt polí';
      case 'delete_edit': return 'Smazání vs. úprava';
      default: return 'Neznámý konflikt';
    }
  };

  const unresolved = conflicts.filter(c => !resolutions.has(c.id));
  const resolved = conflicts.filter(c => resolutions.has(c.id));

  if (!currentConflict) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Řešení konfliktů synchronizace
          </DialogTitle>
          <DialogDescription>
            Nalezeno {conflicts.length} konfliktů. Prosím zkontrolujte a vyberte způsob řešení.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{conflicts.length}</div>
              <div className="text-sm text-gray-600">Celkem konfliktů</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{resolved.length}</div>
              <div className="text-sm text-green-600">Vyřešeno</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">{unresolved.length}</div>
              <div className="text-sm text-amber-600">Čeká na řešení</div>
            </div>
          </div>

          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Aktuální konflikt</TabsTrigger>
              <TabsTrigger value="overview">Přehled všech</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              {/* Current Conflict Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getConflictTypeColor(currentConflict.conflictType)}>
                    {getConflictTypeLabel(currentConflict.conflictType)}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {currentConflict.entityType} • {format(new Date(currentConflict.timestamp), 'dd.MM.yyyy HH:mm', { locale: cs })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {currentConflictIndex + 1} z {conflicts.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentConflictIndex(Math.max(0, currentConflictIndex - 1))}
                    disabled={currentConflictIndex === 0}
                  >
                    Předchozí
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentConflictIndex(Math.min(conflicts.length - 1, currentConflictIndex + 1))}
                    disabled={currentConflictIndex === conflicts.length - 1}
                  >
                    Další
                  </Button>
                </div>
              </div>

              {/* Conflict Details */}
              <ConflictPreview conflict={currentConflict} />

              {/* Resolution Options */}
              <ConflictResolutionOptions
                conflict={currentConflict}
                resolution={resolutions.get(currentConflict.id)}
                onResolutionChange={(resolution) => handleResolutionChange(currentConflict.id, resolution)}
              />
            </TabsContent>

            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-3">
                {conflicts.map((conflict, index) => (
                  <div
                    key={conflict.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      index === currentConflictIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setCurrentConflictIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getConflictTypeColor(conflict.conflictType)}>
                          {getConflictTypeLabel(conflict.conflictType)}
                        </Badge>
                        <span className="font-medium">{conflict.entityType}</span>
                        {resolutions.has(conflict.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(conflict.timestamp), 'dd.MM.yyyy HH:mm', { locale: cs })}
                      </div>
                    </div>
                    {conflict.conflictedFields && (
                      <div className="mt-2 text-sm text-gray-600">
                        Konfliktní pole: {conflict.conflictedFields.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Automaticky vyřešeno: {resolved.length} z {conflicts.length}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={processing}>
                Zrušit
              </Button>
              <Button 
                onClick={handleResolveAll} 
                disabled={processing || unresolved.length > 0}
                className="min-w-[120px]"
              >
                {processing ? 'Řeším...' : `Vyřešit vše (${resolved.length})`}
              </Button>
            </div>
          </div>

          {unresolved.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Zbývá vyřešit {unresolved.length} konfliktů. Prosím projděte je a zvolte způsob řešení.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
