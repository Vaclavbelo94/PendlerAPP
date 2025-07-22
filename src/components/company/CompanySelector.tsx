
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
      id: 'dhl',
      name: 'DHL',
      logo: '📦',
      gradient: 'from-yellow-400 via-orange-500 to-red-600'
    },
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
    }
  ];

  const handleCompanySelect = (companyId: string) => {
    localStorage.setItem('selectedCompany', companyId);
    
    // Pro DHL uživatele si označíme, že jsou potenciální DHL zaměstnanci
    if (companyId === 'dhl') {
      localStorage.setItem('isDHLSelection', 'true');
      localStorage.setItem('dhlSelectionTimestamp', Date.now().toString());
    }
    
    navigate(`/register/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Navbar */}
      <UnifiedNavbar rightContent={<NavbarRightContent />} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500 pointer-events-none"></div>
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

            {/* Company Selection - Swipe Tab Menu */}
            <div className="flex flex-col space-y-6 mb-12 max-w-6xl mx-auto">
              {/* Company Tabs - Horizontal Swipe */}
              <div className="relative">
                {/* Swipe indicator dots for mobile */}
                <div className="flex justify-center gap-2 mb-4 md:hidden">
                  {companies.map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                  ))}
                </div>

                {/* Company Cards with enhanced DHL */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 px-4 -mx-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:mx-0">
                  {companies.map((company, index) => {
                    const isDHL = company.id === 'dhl';
                    return (
                      <Card 
                        key={company.id}
                        className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-background/60 backdrop-blur-lg overflow-hidden animate-fade-in flex-shrink-0 snap-center ${
                          isDHL 
                            ? 'w-80 md:w-auto transform md:scale-110 shadow-2xl ring-2 ring-primary/20' 
                            : 'w-72 md:w-auto'
                        }`}
                        style={{ animationDelay: `${index * 200}ms` }}
                        onClick={() => handleCompanySelect(company.id)}
                      >
                        <div className={`h-3 bg-gradient-to-r ${company.gradient} ${isDHL ? 'shadow-lg' : ''}`}></div>
                        
                        <CardContent className={`text-center relative ${isDHL ? 'p-10 md:p-16' : 'p-8 md:p-12'}`}>
                          {/* Enhanced hover gradient overlay for DHL */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${company.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
                          
                          {/* Featured badge for DHL */}
                          {isDHL && (
                            <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                              {t('featured', 'Doporučeno')}
                            </div>
                          )}
                          
                          {/* Company Logo - Enhanced for DHL */}
                          <div className="relative mb-6 md:mb-8">
                            <div className={`mx-auto rounded-3xl bg-gradient-to-br ${company.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ${
                              isDHL 
                                ? 'w-24 h-24 md:w-32 md:h-32 text-4xl md:text-6xl shadow-2xl' 
                                : 'w-16 h-16 md:w-24 md:h-24 text-2xl md:text-4xl'
                            }`}>
                              {company.logo}
                            </div>
                            {/* Glow effect for DHL */}
                            {isDHL && (
                              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-red-500/20 blur-xl scale-125 animate-pulse"></div>
                            )}
                          </div>

                          {/* Company Name - Enhanced for DHL */}
                          <h2 className={`font-bold text-foreground group-hover:text-primary transition-colors duration-300 ${
                            isDHL 
                              ? 'text-2xl md:text-4xl mb-8 md:mb-10' 
                              : 'text-xl md:text-3xl mb-6 md:mb-8'
                          }`}>
                            {company.name}
                          </h2>

                          {/* Select Button - Enhanced for DHL */}
                          <Button 
                            className={`w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 hover:scale-105 text-sm md:text-lg ${
                              isDHL 
                                ? 'py-6 md:py-8 bg-primary/10 text-primary font-semibold border-primary/20 hover:bg-primary shadow-lg' 
                                : 'py-4 md:py-6'
                            }`}
                            variant={isDHL ? "default" : "outline"}
                          >
                            <span>{t('selectButton', 'Vybrat')}</span>
                            <ArrowRight className={`ml-2 group-hover:translate-x-1 transition-transform duration-300 ${
                              isDHL ? 'w-5 h-5 md:w-6 md:h-6' : 'w-4 h-4 md:w-5 md:h-5'
                            }`} />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Scroll hint for mobile */}
                <div className="text-center mt-4 md:hidden">
                  <p className="text-xs text-muted-foreground">
                    ← {t('swipeToSeeMore', 'Posuňte pro zobrazení dalších')} →
                  </p>
                </div>
              </div>

              {/* Auth Options */}
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
