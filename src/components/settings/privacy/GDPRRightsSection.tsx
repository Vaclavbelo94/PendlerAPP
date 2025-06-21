
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from '@/hooks/useLanguage';

export const GDPRRightsSection: React.FC = () => {
  const { t } = useLanguage();

  const handleDownloadData = () => {
    toast.success(t('dataDownloadRequested') || "Požadavek na stažení dat byl odeslán");
  };

  const handleDeleteData = () => {
    toast.success(t('dataDeleteRequested') || "Požadavek na smazání dat byl odeslán");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gdprRights') || 'Práva podle GDPR'}</CardTitle>
        <CardDescription>
          {t('gdprRightsDescription') || 'Vaše práva týkající se zpracování osobních údajů'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleDownloadData} variant="outline" className="w-full">
            {t('downloadMyData') || 'Stáhnout moje data'}
          </Button>
          
          <Button onClick={handleDeleteData} variant="outline" className="w-full">
            {t('requestDeletion') || 'Požádat o smazání'}
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">{t('processingInformation') || 'Informace o zpracování'}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {t('gdprComplianceInfo') || 'Vaše osobní údaje zpracováváme v souladu s GDPR. Více informací najdete v našich zásadách ochrany osobních údajů.'}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href="/privacy">{t('privacyPolicy') || 'Ochrana soukromí'}</a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/cookies">{t('cookies') || 'Cookies'}</a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="/terms">{t('termsOfUse') || 'Podmínky použití'}</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
