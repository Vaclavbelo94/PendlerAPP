import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calculator, FileText, Clock } from 'lucide-react';

type CompanyId = 'adecco' | 'randstad' | 'dhl';

interface CompanyConfig {
  name: string;
  color: string;
  features: string[];
  description: string;
}

const companyConfigs: Record<CompanyId, CompanyConfig> = {
  adecco: {
    name: 'Adecco',
    color: 'from-blue-500 to-blue-700',
    features: ['Správa směn', 'Kalkulačka mezd', 'Dokumenty', 'Podpora'],
    description: 'Specializované nástroje pro zaměstnance Adecco'
  },
  randstad: {
    name: 'Randstad',
    color: 'from-indigo-500 to-indigo-700',
    features: ['Flexibilní směny', 'Mzdové výpočty', 'Kariérní podpora', 'Školení'],
    description: 'Kompletní řešení pro zaměstnance Randstad'
  },
  dhl: {
    name: 'DHL',
    color: 'from-yellow-500 to-red-600',
    features: ['Wechselschicht generátor', 'Směnové plány', 'Logistické nástroje', 'Týmová komunikace'],
    description: 'Specializované nástroje pro DHL zaměstnance'
  }
};

const CompanyLandingPage: React.FC = () => {
  const { company } = useParams<{ company: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!company || !companyConfigs[company as CompanyId]) {
    return <Navigate to="/" replace />;
  }

  const companyId = company as CompanyId;
  const config = companyConfigs[companyId];

  const handleLogin = () => {
    localStorage.setItem('selectedCompany', companyId);
    navigate('/login');
  };

  const handleRegister = () => {
    localStorage.setItem('selectedCompany', companyId);
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-secondary/20">
      <Helmet>
        <title>{config.name} - PendlerApp</title>
        <meta name="description" content={config.description} />
      </Helmet>

      {/* Navigation */}
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back', 'Zpět')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-6xl shadow-xl`}>
              {companyId === 'adecco' && '🏢'}
              {companyId === 'randstad' && '🔵'}
              {companyId === 'dhl' && '📦'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
              {t(`company.${companyId}.welcome`, `Vítejte v ${config.name}`)}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {config.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {config.features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {index === 0 && <Clock className="w-5 h-5 text-primary" />}
                    {index === 1 && <Calculator className="w-5 h-5 text-primary" />}
                    {index === 2 && <FileText className="w-5 h-5 text-primary" />}
                    {index === 3 && <Users className="w-5 h-5 text-primary" />}
                    {feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(`company.${companyId}.feature${index + 1}`, 'Popis funkce není k dispozici')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="text-lg px-8 py-6"
            >
              {t('auth.login', 'Přihlásit se')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleRegister}
              className="text-lg px-8 py-6"
            >
              {t('auth.register', 'Registrovat se')}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {t(`company.${companyId}.info`, 'Specializované nástroje pro vaši práci')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLandingPage;