
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, FileText } from "lucide-react";
import { ConflictData } from './ConflictResolutionService';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

interface ConflictPreviewProps {
  conflict: ConflictData;
}

export const ConflictPreview: React.FC<ConflictPreviewProps> = ({ conflict }) => {
  const { localItem, remoteItem, conflictedFields, metadata } = conflict;

  const renderFieldComparison = (field: string, localValue: any, remoteValue: any) => {
    const isConflicted = conflictedFields?.includes(field);
    
    return (
      <div key={field} className={`grid grid-cols-3 gap-4 py-2 ${isConflicted ? 'bg-red-50 px-2 rounded' : ''}`}>
        <div className="font-medium text-sm capitalize flex items-center gap-2">
          {field}
          {isConflicted && <Badge variant="destructive" className="text-xs">Konflikt</Badge>}
        </div>
        <div className="text-sm">
          <div className="font-medium text-blue-700 mb-1">Lokální verze</div>
          <div className="p-2 bg-blue-50 rounded text-xs">
            {renderValue(localValue)}
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium text-green-700 mb-1">Vzdálená verze</div>
          <div className="p-2 bg-green-50 rounded text-xs">
            {renderValue(remoteValue)}
          </div>
        </div>
      </div>
    );
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined) return 'Není vyplněno';
    if (typeof value === 'boolean') return value ? 'Ano' : 'Ne';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    return String(value);
  };

  const getMetadataInfo = () => {
    if (!metadata) return null;
    
    const timeDiff = metadata.timeDiff;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      timeDifference: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      localTime: new Date(metadata.localTime),
      remoteTime: new Date(metadata.remoteTime)
    };
  };

  const metadataInfo = getMetadataInfo();

  // Get all fields to compare
  const allFields = new Set([
    ...Object.keys(localItem || {}),
    ...Object.keys(remoteItem || {})
  ]);

  // Filter out system fields
  const displayFields = Array.from(allFields).filter(field => 
    !['id', 'created_at', 'updated_at', 'user_id'].includes(field)
  );

  return (
    <div className="space-y-4">
      {/* Metadata Information */}
      {metadataInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Informace o konfliktu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-700">Lokální úprava</div>
                <div>{format(metadataInfo.localTime, 'dd.MM.yyyy HH:mm:ss', { locale: cs })}</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <ArrowRight className="h-4 w-4" />
                  <span className="font-medium">{metadataInfo.timeDifference}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="font-medium text-green-700">Vzdálená úprava</div>
                <div>{format(metadataInfo.remoteTime, 'dd.MM.yyyy HH:mm:ss', { locale: cs })}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Field Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Porovnání dat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-3 gap-4 pb-2 border-b font-medium text-sm">
              <div>Pole</div>
              <div className="text-blue-700">Lokální verze</div>
              <div className="text-green-700">Vzdálená verze</div>
            </div>
            {displayFields.map(field => 
              renderFieldComparison(field, localItem?.[field], remoteItem?.[field])
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conflicted Fields Summary */}
      {conflictedFields && conflictedFields.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-700 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Konfliktní pole ({conflictedFields.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {conflictedFields.map(field => (
                <Badge key={field} variant="destructive" className="text-xs">
                  {field}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
