import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TaxWizardData, TaxCalculationResult } from '../types';

interface AssistedSubmissionRequestProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  formCode?: string;
}

const AssistedSubmissionRequest: React.FC<AssistedSubmissionRequestProps> = ({ 
  data, 
  result, 
  formCode 
}) => {
  const { t } = useTranslation(['taxAdvisor', 'common']);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [requestData, setRequestData] = useState({
    contactEmail: data.personalInfo.email || '',
    phone: '',
    preferredContact: 'email',
    urgency: 'standard',
    additionalNotes: '',
    consentProcessing: false,
    consentMarketing: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.contactEmail || !requestData.consentProcessing) {
      toast({
        title: t('error', { ns: 'common' }),
        description: t('wizard.assistedSubmission.requiredFields'),
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: t('error', { ns: 'common' }),
          description: 'Musíte být přihlášeni',
          variant: "destructive",
        });
        return;
      }

      const submissionData = {
        user_id: user.id,
        form_code: formCode || null,
        user_data: data as any,
        calculation_result: result as any,
        contact_info: requestData as any,
        status: 'pending',
        priority: requestData.urgency || 'standard'
      };

      const { data: insertedData, error } = await supabase
        .from('assisted_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) throw error;
      
      // Send email notification
      try {
        await supabase.functions.invoke('send-submission-notification', {
          body: {
            type: 'new_submission',
            submission_id: insertedData.id
          }
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't throw - submission was successful even if email failed
      }
      
      setSubmitted(true);
      
      toast({
        title: t('wizard.assistedSubmission.success'),
        description: t('wizard.assistedSubmission.successDescription'),
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: t('error', { ns: 'common' }),
        description: t('wizard.assistedSubmission.error'),
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            {t('wizard.assistedSubmission.submitted')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-700">
            {t('wizard.assistedSubmission.submittedMessage')}
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('wizard.assistedSubmission.nextSteps')}:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• {t('wizard.assistedSubmission.step1')}</li>
              <li>• {t('wizard.assistedSubmission.step2')}</li>
              <li>• {t('wizard.assistedSubmission.step3')}</li>
            </ul>
          </div>

          {formCode && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-1">{t('wizard.assistedSubmission.referenceCode')}:</p>
              <Badge variant="outline" className="font-mono">
                {formCode}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          {t('wizard.assistedSubmission.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Popis služby */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('wizard.assistedSubmission.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>{t('wizard.assistedSubmission.professional')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span>{t('wizard.assistedSubmission.fast')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>{t('wizard.assistedSubmission.guaranteed')}</span>
              </div>
            </div>
          </div>

          {/* Přehled dat */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3">{t('wizard.assistedSubmission.dataSummary')}:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('wizard.results.totalReisepauschale')}:</span>
                  <div className="font-semibold">{formatCurrency(result.reisepausaleBenefit)}</div>
                </div>
              <div>
                <span className="text-muted-foreground">{t('wizard.results.totalDeductions')}:</span>
                <div className="font-semibold">{formatCurrency(result.totalDeductions)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">{t('wizard.results.estimatedRefund')}:</span>
                <div className="font-semibold text-green-600">{formatCurrency(result.totalDeductions * 0.25)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">{t('wizard.formCode.code')}:</span>
                <div className="font-mono text-xs">{formCode || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Formulář žádosti */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">{t('wizard.assistedSubmission.contactEmail')} *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={requestData.contactEmail}
                  onChange={(e) => setRequestData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('wizard.assistedSubmission.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={requestData.phone}
                  onChange={(e) => setRequestData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('wizard.assistedSubmission.additionalNotes')}</Label>
              <Textarea
                id="notes"
                value={requestData.additionalNotes}
                onChange={(e) => setRequestData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder={t('wizard.assistedSubmission.notesPlaceholder')}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent-processing"
                  checked={requestData.consentProcessing}
                  onCheckedChange={(checked) => 
                    setRequestData(prev => ({ ...prev, consentProcessing: !!checked }))
                  }
                />
                <Label htmlFor="consent-processing" className="text-sm">
                  {t('wizard.assistedSubmission.consentProcessing')} *
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent-marketing"
                  checked={requestData.consentMarketing}
                  onCheckedChange={(checked) => 
                    setRequestData(prev => ({ ...prev, consentMarketing: !!checked }))
                  }
                />
                <Label htmlFor="consent-marketing" className="text-sm">
                  {t('wizard.assistedSubmission.consentMarketing')}
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {t('wizard.assistedSubmission.submit')}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistedSubmissionRequest;