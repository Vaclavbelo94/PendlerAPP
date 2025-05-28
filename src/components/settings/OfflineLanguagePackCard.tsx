
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, CheckCircle } from 'lucide-react';
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{pack.flag}</span>
          <p className="font-medium">{pack.name}</p>
          {pack.isDownloaded && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          {pack.totalItems > 0 ? (
            <>
              <p>Obsahuje {pack.downloadedItems}/{pack.totalItems} položek</p>
              <p>Velikost: {pack.size}</p>
            </>
          ) : (
            <p>Velikost: {pack.size}</p>
          )}
          
          {pack.lastUpdated && (
            <p>Aktualizováno: {pack.lastUpdated.toLocaleDateString()}</p>
          )}
        </div>
        
        {isDownloading && (
          <div className="mt-2">
            <Progress value={downloadProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Stahování... {downloadProgress}%
            </p>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 ml-4">
        {!pack.isDownloaded ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
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
            >
              <Download className="h-4 w-4 mr-2" />
              Aktualizovat
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDelete}
              disabled={isDownloading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
