import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Lightbulb,
  TrendingUp,
  Shield,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TaxWizardData, TaxCalculationResult } from '../wizard/types';

interface ValidationRule {
  id: string;
  type: 'error' | 'warning' | 'info' | 'tip';
  field: string;
  message: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
  autoFix?: () => void;
}

interface SmartValidationEngineProps {
  data: TaxWizardData;
  result: TaxCalculationResult;
  onDataChange: (newData: TaxWizardData) => void;
}

const SmartValidationEngine: React.FC<SmartValidationEngineProps> = ({
  data,
  result,
  onDataChange
}) => {
  const { t } = useTranslation(['taxAdvisor']);
  const [validationResults, setValidationResults] = useState<ValidationRule[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const runValidation = () => {
    const rules: ValidationRule[] = [];

    // Validace osobních údajů
    if (!data.personalInfo.firstName) {
      rules.push({
        id: 'missing-firstname',
        type: 'error',
        field: 'personalInfo.firstName',
        message: t('validation.errors.missingFirstName'),
        severity: 'high'
      });
    }

    if (!data.personalInfo.taxId || data.personalInfo.taxId.length < 11) {
      rules.push({
        id: 'invalid-taxid',
        type: 'error',
        field: 'personalInfo.taxId',
        message: t('validation.errors.invalidTaxId'),
        suggestion: t('validation.suggestions.checkTaxId'),
        severity: 'high'
      });
    }

    // Validace příjmu
    if (data.employmentInfo.annualIncome < 12000) {
      rules.push({
        id: 'low-income',
        type: 'warning',
        field: 'employmentInfo.annualIncome',
        message: t('validation.warnings.lowIncome'),
        suggestion: t('validation.suggestions.verifyIncome'),
        severity: 'medium'
      });
    }

    if (data.employmentInfo.annualIncome > 100000) {
      rules.push({
        id: 'high-income',
        type: 'info',
        field: 'employmentInfo.annualIncome',
        message: t('validation.info.highIncome'),
        suggestion: t('validation.suggestions.considerProfessionalHelp'),
        severity: 'low'
      });
    }

    // Validace vzdálenosti dojíždění
    if (data.reisepauschale.commuteDistance > 100) {
      rules.push({
        id: 'long-commute',
        type: 'tip',
        field: 'reisepauschale.commuteDistance',
        message: t('validation.tips.longCommute'),
        suggestion: t('validation.suggestions.secondHome'),
        severity: 'medium'
      });
    }

    if (data.reisepauschale.commuteDistance < 5) {
      rules.push({
        id: 'short-commute',
        type: 'warning',
        field: 'reisepauschale.commuteDistance',
        message: t('validation.warnings.shortCommute'),
        suggestion: t('validation.suggestions.verifyDistance'),
        severity: 'medium'
      });
    }

    // Validace pracovních dnů
    if (data.reisepauschale.workDaysPerYear > 260) {
      rules.push({
        id: 'too-many-workdays',
        type: 'warning',
        field: 'reisepauschale.workDaysPerYear',
        message: t('validation.warnings.tooManyWorkdays'),
        suggestion: t('validation.suggestions.checkWorkdays'),
        severity: 'medium',
        autoFix: () => {
          const newData = { ...data };
          newData.reisepauschale.workDaysPerYear = 220;
          onDataChange(newData);
        }
      });
    }

    // Validace odpočtů
    const activeDeductions = Object.values(data.deductions).filter(Boolean).length;
    if (activeDeductions < 2) {
      rules.push({
        id: 'few-deductions',
        type: 'tip',
        field: 'deductions',
        message: t('validation.tips.fewDeductions'),
        suggestion: t('validation.suggestions.exploreDeductions'),
        severity: 'low'
      });
    }

    // Kontrola poměru odpočtů k příjmu
    const deductionRatio = (result.totalDeductions / data.employmentInfo.annualIncome) * 100;
    if (deductionRatio > 30) {
      rules.push({
        id: 'high-deduction-ratio',
        type: 'warning',
        field: 'deductions',
        message: t('validation.warnings.highDeductionRatio'),
        suggestion: t('validation.suggestions.reviewDeductions'),
        severity: 'high'
      });
    }

    // Kontrola konzistence dat
    if (data.employmentInfo.commuteDistance !== data.reisepauschale.commuteDistance) {
      rules.push({
        id: 'inconsistent-distance',
        type: 'error',
        field: 'commuteDistance',
        message: t('validation.errors.inconsistentDistance'),
        suggestion: t('validation.suggestions.synchronizeDistance'),
        severity: 'high',
        autoFix: () => {
          const newData = { ...data };
          newData.employmentInfo.commuteDistance = data.reisepauschale.commuteDistance;
          onDataChange(newData);
        }
      });
    }

    // Inteligentní tipy na základě dat
    if (data.reisepauschale.transportType === 'car' && !data.deductions.tools) {
      rules.push({
        id: 'car-maintenance-tip',
        type: 'tip',
        field: 'deductions.tools',
        message: t('validation.tips.carMaintenanceTip'),
        suggestion: t('validation.suggestions.considerCarExpenses'),
        severity: 'low'
      });
    }

    if (data.employmentInfo.annualIncome > 50000 && !data.deductions.professionalLiterature) {
      rules.push({
        id: 'professional-literature-tip',
        type: 'tip',
        field: 'deductions.professionalLiterature',
        message: t('validation.tips.professionalLiteratureTip'),
        suggestion: t('validation.suggestions.addProfessionalExpenses'),
        severity: 'low'
      });
    }

    setValidationResults(rules);
    
    // Výpočet celkového skóre
    const errorCount = rules.filter(r => r.type === 'error').length;
    const warningCount = rules.filter(r => r.type === 'warning').length;
    const score = Math.max(0, 100 - (errorCount * 25) - (warningCount * 10));
    setOverallScore(score);
  };

  useEffect(() => {
    runValidation();
  }, [data, result]);

  const getIcon = (type: ValidationRule['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getAlertVariant = (type: ValidationRule['type']) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: ValidationRule['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const errorCount = validationResults.filter(r => r.type === 'error').length;
  const warningCount = validationResults.filter(r => r.type === 'warning').length;
  const tipCount = validationResults.filter(r => r.type === 'tip').length;

  return (
    <div className="space-y-6">
      {/* Celkové skóre a přehled */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('validation.qualityScore')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold">
              <span className={getScoreColor(overallScore)}>{overallScore}</span>
              <span className="text-lg text-muted-foreground">/100</span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{errorCount} {t('validation.errors')}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>{warningCount} {t('validation.warnings')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-4 w-4 text-green-500" />
                <span>{tipCount} {t('validation.tips')}</span>
              </div>
            </div>
          </div>
          
          <Progress value={overallScore} className="mb-2" />
          
          <p className="text-sm text-muted-foreground">
            {overallScore >= 90 && t('validation.excellent')}
            {overallScore >= 70 && overallScore < 90 && t('validation.good')}
            {overallScore < 70 && t('validation.needsImprovement')}
          </p>
        </CardContent>
      </Card>

      {/* Seznam validačních pravidel */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('validation.validationResults')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validationResults.map((rule) => (
              <Alert key={rule.id} variant={getAlertVariant(rule.type)}>
                <div className="flex items-start gap-3">
                  {getIcon(rule.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <AlertDescription className="font-medium">
                        {rule.message}
                      </AlertDescription>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(rule.severity)}`} />
                        <Badge variant="outline" className="text-xs">
                          {rule.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    {rule.suggestion && (
                      <p className="text-sm text-muted-foreground">
                        💡 {rule.suggestion}
                      </p>
                    )}
                    
                    {rule.autoFix && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={rule.autoFix}
                        className="mt-2"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {t('validation.autoFix')}
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pokud nejsou žádné problémy */}
      {validationResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              {t('validation.allGood')}
            </h3>
            <p className="text-muted-foreground">
              {t('validation.noIssuesFound')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartValidationEngine;