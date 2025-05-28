
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { LanguagePack } from '@/hooks/useOfflineLanguagePacks';

interface OfflineLanguagePackCardProps {
  pack: LanguagePack;
  isDownloading: boolean;
  downloadProgress: number;
  onDownload: () => void;
  onDelete: () => void;
}

export const OfflineLanguagePackCard: React.FC<OfflineLanguagePackCardProps> = ({
  pack,
  isDownloading,
  downloadProgress,
  onDownload,
  onDelete
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      {/* Header section */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{pack.flag}</span>
            <h3 className="font-medium text-base">{pack.name}</h3>
            {pack.isDownloaded && (
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
          </div>
          
          <div className="text-sm text-muted-foreground space-y-1">
            {pack.totalItems > 0 ? (
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                <span>Položky: {pack.downloadedItems}/{pack.totalItems}</span>
                <span>Velikost: {pack.size}</span>
              </div>
            ) : (
              <p>Velikost: {pack.size}</p>
            )}
            
            {pack.lastUpdated && (
              <p className="text-xs">
                Aktualizováno: {pack.lastUpdated.toLocaleDateString('cs-CZ')} v {pack.lastUpdated.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress section */}
      {isDownloading && (
        <div className="space-y-2">
          <Progress value={downloadProgress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Stahování...
            </span>
            <span>{downloadProgress}%</span>
          </div>
        </div>
      )}
      
      {/* Actions section */}
      <div className="flex flex-col sm:flex-row gap-2">
        {!pack.isDownloaded ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Stahování...' : 'Stáhnout'}
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualizovat
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDelete}
              disabled={isDownloading}
              className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
              <span className="sm:hidden">Smazat</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
