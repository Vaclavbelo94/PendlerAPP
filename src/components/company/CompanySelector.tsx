import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Globe } from 'lucide-react';

interface CompanyOption {
  id: 'adecco' | 'randstad' | 'dhl';
  name: string;
  logo: string;
  gradient: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['companySelector', 'common']);

  const companies: CompanyOption[] = [
    {
      id: 'adecco',
      name: 'Adecco',
      logo: '🏢',
      gradient: 'from-blue-500 via-blue-600 to-blue-700'
    },
    {
      id: 'randstad',
      name: 'Randstad',
      logo: '🔵',
      gradient: 'from-indigo-500 via-purple-600 to-pink-600'
    },
    {
      id: 'dhl',
      name: 'DHL',
      logo: '📦',
      gradient: 'from-yellow-400 via-orange-500 to-red-600'
    }
  ];

  const handleCompanySelect = (companyId: string) => {
    localStorage.setItem('selectedCompany', companyId);
    navigate(`/register/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Language Switcher - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <div className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-lg rounded-full border border-border/50 shadow-lg">
            <Globe className="w-4 h-4 text-muted-foreground" />
            {['cs', 'de', 'pl'].map((lang) => (
              <Button
                key={lang}
                variant={i18n.language === lang ? 'default' : 'ghost'}
                size="sm"
                onClick={() => i18n.changeLanguage(lang)}
                className="rounded-full text-xs min-w-[2.5rem] h-8"
              >
                {lang === 'cs' && '🇨🇿'}
                {lang === 'de' && '🇩🇪'}
                {lang === 'pl' && '🇵🇱'}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6 animate-scale-in">
                  {t('companySelector.title', 'Vyberte svou společnost')}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t('companySelector.subtitle', 'Začněte registrací u vaší personální agentury')}
                </p>
              </div>
              
            </div>

            {/* Company Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              {companies.map((company, index) => (
                <Card 
                  key={company.id}
                  className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-background/60 backdrop-blur-lg overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => handleCompanySelect(company.id)}
                >
                  <div className={`h-2 bg-gradient-to-r ${company.gradient}`}></div>
                  
                  <CardContent className="p-12 text-center relative">
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Company Logo */}
                    <div className="relative mb-8">
                      <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${company.gradient} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        {company.logo}
                      </div>
                    </div>

                    {/* Company Name */}
                    <h2 className="text-3xl font-bold text-foreground mb-8 group-hover:text-primary transition-colors duration-300">
                      {company.name}
                    </h2>

                    {/* Select Button */}
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:scale-105 py-6 text-lg"
                      variant="outline"
                    >
                      <span>{t('companySelector.selectButton', 'Registrovat se')}</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="p-8 rounded-2xl bg-background/40 backdrop-blur-lg border border-border/50 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('companySelector.alreadyHaveAccount', 'Už máte účet?')}
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300"
                >
                  {t('companySelector.loginButton', 'Přihlásit se')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;