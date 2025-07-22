import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CompanyOption {
  id: 'adecco' | 'randstad' | 'dhl';
  name: string;
  logo: string;
  color: string;
  description: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const companies: CompanyOption[] = [
    {
      id: 'adecco',
      name: 'Adecco',
      logo: '🏢',
      color: 'from-blue-500 to-blue-700',
      description: t('companySelector.adecco.description', 'Profesionální personální služby')
    },
    {
      id: 'randstad',
      name: 'Randstad',
      logo: '🔵',
      color: 'from-indigo-500 to-indigo-700',
      description: t('companySelector.randstad.description', 'Globální HR řešení')
    },
    {
      id: 'dhl',
      name: 'DHL',
      logo: '📦',
      color: 'from-yellow-500 to-red-600',
      description: t('companySelector.dhl.description', 'Logistické a doručovací služby')
    }
  ];

  const handleCompanySelect = (companyId: string) => {
    // Store selected company in localStorage for later use during registration
    localStorage.setItem('selectedCompany', companyId);
    navigate(`/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            {t('companySelector.title', 'Vyberte svou společnost')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('companySelector.subtitle', 'Pokračujte s vaší personální agenturou pro přístup k specializovaným funkcím')}
          </p>
        </div>

        {/* Company Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company) => (
            <Card 
              key={company.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30"
              onClick={() => handleCompanySelect(company.id)}
            >
              <CardContent className="p-8 text-center">
                {/* Company Logo */}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${company.color} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  {company.logo}
                </div>

                {/* Company Name */}
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  {company.name}
                </h2>

                {/* Company Description */}
                <p className="text-muted-foreground mb-6">
                  {company.description}
                </p>

                {/* Select Button */}
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                  variant="outline"
                >
                  {t('companySelector.selectButton', 'Vybrat')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            {t('companySelector.alreadyHaveAccount', 'Už máte účet?')}
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="text-primary hover:text-primary/80"
          >
            {t('companySelector.loginButton', 'Přihlásit se')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;