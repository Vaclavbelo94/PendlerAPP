
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, CheckCircle } from 'lucide-react';

interface LanguagePack {
  id: string;
  name: string;
  flag: string;
  size: string;
  downloaded: boolean;
  version: string;
}

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
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{pack.flag}</span>
            <div>
              <div className="font-medium">{pack.name}</div>
              <div className="text-sm text-muted-foreground">
                {pack.size} • Verze {pack.version}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {pack.downloaded ? (
              <>
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Staženo
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Smazat
                </Button>
              </>
            ) : (
              <Button
                onClick={onDownload}
                disabled={isDownloading}
                size="sm"
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                {isDownloading ? 'Stahuji...' : 'Stáhnout'}
              </Button>
            )}
          </div>
        </div>
        
        {isDownloading && (
          <div className="mt-3">
            <Progress value={downloadProgress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {downloadProgress}% dokončeno
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
