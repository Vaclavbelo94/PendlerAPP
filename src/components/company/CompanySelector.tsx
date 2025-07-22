
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

interface CompanyOption {
  id: 'adecco' | 'randstad' | 'dhl';
  name: string;
  logo: string;
  gradient: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('companySelector');

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
      {/* Navbar */}
      <UnifiedNavbar rightContent={<NavbarRightContent />} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-7xl">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6 animate-scale-in">
                  {t('title', 'Vyberte svou společnost')}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t('subtitle', 'Pokračujte s vaší personální agenturou pro přístup k specializovaným funkcím')}
                </p>
              </div>
            </div>

            {/* Company Selection - Mobile-First Horizontal Layout */}
            <div className="flex flex-col space-y-6 mb-12 max-w-4xl mx-auto">
              {/* Company Cards - Horizontal scroll on mobile */}
              <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
                {companies.map((company, index) => (
                  <Card 
                    key={company.id}
                    className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-background/60 backdrop-blur-lg overflow-hidden animate-fade-in flex-shrink-0 w-64 md:w-auto"
                    style={{ animationDelay: `${index * 200}ms` }}
                    onClick={() => handleCompanySelect(company.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${company.gradient}`}></div>
                    
                    <CardContent className="p-8 md:p-12 text-center relative">
                      {/* Hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                      
                      {/* Company Logo */}
                      <div className="relative mb-6 md:mb-8">
                        <div className={`w-16 h-16 md:w-24 md:h-24 mx-auto rounded-3xl bg-gradient-to-br ${company.gradient} flex items-center justify-center text-2xl md:text-4xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                          {company.logo}
                        </div>
                      </div>

                      {/* Company Name */}
                      <h2 className="text-xl md:text-3xl font-bold text-foreground mb-6 md:mb-8 group-hover:text-primary transition-colors duration-300">
                        {company.name}
                      </h2>

                      {/* Select Button */}
                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:scale-105 py-4 md:py-6 text-sm md:text-lg"
                        variant="outline"
                      >
                        <span>{t('selectButton', 'Vybrat')}</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Auth Options - Horizontal on mobile */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '800ms' }}>
                <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-background/40 backdrop-blur-lg border border-border/50">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                      {t('alreadyHaveAccount', 'Už máte účet?')}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => navigate('/login')}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300 px-6"
                      >
                        {t('loginButton', 'Přihlásit se')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/register')}
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-6"
                      >
                        {t('registerButton', 'Registrovat se')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySelector;
