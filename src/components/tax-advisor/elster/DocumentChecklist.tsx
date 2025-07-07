import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData } from '../wizard/types';

interface DocumentChecklistProps {
  data: TaxWizardData;
  onDownloadGuide: () => void;
}

interface DocumentItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  required: boolean;
  condition?: (data: TaxWizardData) => boolean;
  urgency: 'high' | 'medium' | 'low';
}

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ data, onDownloadGuide }) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const documents: DocumentItem[] = [
    {
      id: 'steuer-id',
      titleKey: 'documents.steuerId.title',
      descriptionKey: 'documents.steuerId.description',
      required: true,
      urgency: 'high'
    },
    {
      id: 'lohnsteuerbescheinigung',
      titleKey: 'documents.payrollCertificate.title',
      descriptionKey: 'documents.payrollCertificate.description',
      required: true,
      urgency: 'high'
    },
    {
      id: 'wohnsitz-bescheinigung',
      titleKey: 'documents.residenceCertificate.title',
      descriptionKey: 'documents.residenceCertificate.description',
      required: true,
      urgency: 'high'
    },
    {
      id: 'fahrtkosten-nachweis',
      titleKey: 'documents.commuteProof.title',
      descriptionKey: 'documents.commuteProof.description',
      required: false,
      condition: (data) => data.reisepauschale.commuteDistance > 0,
      urgency: 'medium'
    },
    {
      id: 'second-home-contract',
      titleKey: 'documents.secondHomeContract.title',
      descriptionKey: 'documents.secondHomeContract.description',
      required: false,
      condition: (data) => data.reisepauschale.hasSecondHome,
      urgency: 'high'
    },
    {
      id: 'work-clothes-receipts',
      titleKey: 'documents.workClothesReceipts.title',
      descriptionKey: 'documents.workClothesReceipts.description',
      required: false,
      condition: (data) => data.deductions.workClothes,
      urgency: 'medium'
    },
    {
      id: 'education-certificates',
      titleKey: 'documents.educationCertificates.title',
      descriptionKey: 'documents.educationCertificates.description',
      required: false,
      condition: (data) => data.deductions.education,
      urgency: 'medium'
    },
    {
      id: 'insurance-documents',
      titleKey: 'documents.insuranceDocuments.title',
      descriptionKey: 'documents.insuranceDocuments.description',
      required: false,
      condition: (data) => data.deductions.insurance,
      urgency: 'low'
    },
    {
      id: 'professional-literature',
      titleKey: 'documents.professionalLiterature.title',
      descriptionKey: 'documents.professionalLiterature.description',
      required: false,
      condition: (data) => data.deductions.professionalLiterature,
      urgency: 'low'
    },
    {
      id: 'tools-receipts',
      titleKey: 'documents.toolsReceipts.title',
      descriptionKey: 'documents.toolsReceipts.description',
      required: false,
      condition: (data) => data.deductions.tools,
      urgency: 'medium'
    },
    {
      id: 'home-office-proof',
      titleKey: 'documents.homeOfficeProof.title',
      descriptionKey: 'documents.homeOfficeProof.description',
      required: false,
      condition: (data) => data.deductions.homeOffice,
      urgency: 'low'
    }
  ];

  const applicableDocuments = documents.filter(doc => 
    !doc.condition || doc.condition(data)
  );

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const requiredDocuments = applicableDocuments.filter(doc => doc.required);
  const optionalDocuments = applicableDocuments.filter(doc => !doc.required);
  const completedRequired = requiredDocuments.filter(doc => checkedItems.has(doc.id)).length;
  const completedOptional = optionalDocuments.filter(doc => checkedItems.has(doc.id)).length;

  const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getUrgencyIcon = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <FileText className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('documents.checklist.title')}
            </CardTitle>
            <Button variant="outline" onClick={onDownloadGuide}>
              <Download className="h-4 w-4 mr-2" />
              {t('documents.downloadGuide')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">{t('documents.required')} ({completedRequired}/{requiredDocuments.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{t('documents.optional')} ({completedOptional}/{optionalDocuments.length})</span>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ 
                  width: `${((completedRequired + completedOptional) / applicableDocuments.length) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Povinné dokumenty */}
            <div>
              <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t('documents.requiredDocuments')}
              </h3>
              <div className="space-y-3">
                {requiredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <Checkbox
                      checked={checkedItems.has(doc.id)}
                      onCheckedChange={() => toggleCheck(doc.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{t(doc.titleKey)}</h4>
                        <Badge variant="destructive">
                          {t('documents.required')}
                        </Badge>
                        <div className={`p-1 rounded ${getUrgencyColor(doc.urgency)}`}>
                          {getUrgencyIcon(doc.urgency)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(doc.descriptionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volitelné dokumenty */}
            {optionalDocuments.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('documents.optionalDocuments')}
                </h3>
                <div className="space-y-3">
                  {optionalDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <Checkbox
                        checked={checkedItems.has(doc.id)}
                        onCheckedChange={() => toggleCheck(doc.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{t(doc.titleKey)}</h4>
                          <Badge variant="secondary">
                            {t('documents.optional')}
                          </Badge>
                          <div className={`p-1 rounded ${getUrgencyColor(doc.urgency)}`}>
                            {getUrgencyIcon(doc.urgency)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{t(doc.descriptionKey)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">{t('documents.tips.title')}</h4>
            <ul className="space-y-1 text-sm">
              <li>• {t('documents.tips.tip1')}</li>
              <li>• {t('documents.tips.tip2')}</li>
              <li>• {t('documents.tips.tip3')}</li>
              <li>• {t('documents.tips.tip4')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentChecklist;