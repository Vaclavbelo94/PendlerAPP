import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  GitMerge, 
  Copy, 
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ConflictData, ConflictResolution } from './ConflictResolutionService';

interface ConflictResolutionOptionsProps {
  conflict: ConflictData;
  resolution?: ConflictResolution;
  onResolutionChange: (resolution: ConflictResolution) => void;
}

export const ConflictResolutionOptions: React.FC<ConflictResolutionOptionsProps> = ({
  conflict,
  resolution,
  onResolutionChange
}) => {
  const [selectedAction, setSelectedAction] = useState<ConflictResolution['action']>(
    resolution?.action || 'merge'
  );
  const [fieldSelections, setFieldSelections] = useState<Record<string, 'local' | 'remote' | 'merged'>>(
    resolution?.selectedFields || {}
  );
  const [customNotes, setCustomNotes] = useState('');

  const handleActionChange = (action: ConflictResolution['action']) => {
    setSelectedAction(action);
    
    let newResolution: ConflictResolution = { action };
    
    if (action === 'merge') {
      newResolution = {
        action,
        mergeStrategy: 'field_level',
        selectedFields: fieldSelections
      };
    }
    
    onResolutionChange(newResolution);
  };

  const handleFieldSelection = (field: string, choice: 'local' | 'remote' | 'merged') => {
    const newSelections = { ...fieldSelections, [field]: choice };
    setFieldSelections(newSelections);
    
    if (selectedAction === 'merge') {
      onResolutionChange({
        action: 'merge',
        mergeStrategy: 'field_level',
        selectedFields: newSelections
      });
    }
  };

  const generateMergedItem = () => {
    if (!conflict.conflictedFields) return conflict.localItem;
    
    const merged = { ...conflict.localItem };
    
    for (const field of conflict.conflictedFields) {
      const choice = fieldSelections[field];
      if (choice === 'remote') {
        merged[field] = conflict.remoteItem[field];
      } else if (choice === 'merged') {
        // Intelligent merge for text fields
        if (typeof conflict.localItem[field] === 'string' && typeof conflict.remoteItem[field] === 'string') {
          merged[field] = `${conflict.localItem[field]}\n\n[Sloučeno]: ${conflict.remoteItem[field]}`;
        } else {
          merged[field] = conflict.localItem[field]; // Fallback to local
        }
      }
      // For 'local', keep the original value
    }
    
    return merged;
  };

  const resolutionOptions = [
    {
      action: 'keep_local' as const,
      title: 'Zachovat lokální verzi',
      description: 'Použije se vaše lokální verze dat',
      icon: Download,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      action: 'keep_remote' as const,
      title: 'Zachovat vzdálenou verzi',
      description: 'Použije se verze ze serveru',
      icon: Upload,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      action: 'merge' as const,
      title: 'Sloučit verze',
      description: 'Kombinuje obě verze podle vašeho výběru',
      icon: GitMerge,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      action: 'create_duplicate' as const,
      title: 'Vytvořit duplikát',
      description: 'Zachová obě verze jako samostatné záznamy',
      icon: Copy,
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Způsob řešení konfliktu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAction} onValueChange={handleActionChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resolutionOptions.map(option => (
                <div key={option.action} className="relative">
                  <Label
                    htmlFor={option.action}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAction === option.action 
                        ? option.color 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <RadioGroupItem value={option.action} id={option.action} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <option.icon className="h-4 w-4" />
                        {option.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Field-level merge options */}
      {selectedAction === 'merge' && conflict.conflictedFields && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Výběr polí pro sloučení</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflict.conflictedFields.map(field => (
                <div key={field} className="border rounded-lg p-3">
                  <div className="font-medium text-sm mb-2 capitalize">{field}</div>
                  <RadioGroup
                    value={fieldSelections[field] || 'local'}
                    onValueChange={(value) => handleFieldSelection(field, value as any)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="local" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-blue-700">Lokální</div>
                          <div className="text-xs text-gray-600 truncate">
                            {String(conflict.localItem[field] || 'Prázdné')}
                          </div>
                        </div>
                      </Label>
                      <Label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="remote" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-green-700">Vzdálené</div>
                          <div className="text-xs text-gray-600 truncate">
                            {String(conflict.remoteItem[field] || 'Prázdné')}
                          </div>
                        </div>
                      </Label>
                      <Label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="merged" />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-purple-700">Sloučit</div>
                          <div className="text-xs text-gray-600">Kombinovat obě</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview of resolution */}
      {resolution && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Náhled řešení
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm">
              <div className="font-medium mb-2">
                Akce: <Badge className="ml-1">{resolutionOptions.find(o => o.action === resolution.action)?.title}</Badge>
              </div>
              {resolution.mergeStrategy && (
                <div className="text-gray-600">
                  Strategie: {resolution.mergeStrategy === 'field_level' ? 'Pole po poli' : 'Automatické'}
                </div>
              )}
              {resolution.selectedFields && Object.keys(resolution.selectedFields).length > 0 && (
                <div className="mt-2">
                  <div className="text-gray-600 mb-1">Výběr polí:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(resolution.selectedFields).map(([field, choice]) => (
                      <Badge key={field} variant="outline" className="text-xs">
                        {field}: {choice === 'local' ? 'Lok' : choice === 'remote' ? 'Vzd' : 'Slo'}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Poznámky k řešení (volitelné)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Přidejte poznámky o důvodu vašeho rozhodnutí..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="text-sm"
            rows={3}
          />
        </CardContent>
      </Card>
    </div>
  );
};
