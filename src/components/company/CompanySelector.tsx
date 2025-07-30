
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import dhlLogo from '@/assets/dhl-logo.png';
import adeccoLogo from '@/assets/adecco-logo.png';
import randstadLogo from '@/assets/randstad-logo.png';

interface CompanyOption {
  id: 'adecco' | 'randstad' | 'dhl';
  name: string;
  logo: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('companySelector');

  const companies: CompanyOption[] = [
    {
      id: 'dhl',
      name: 'DHL',
      logo: dhlLogo
    },
    {
      id: 'adecco',
      name: 'Adecco',
      logo: adeccoLogo
    },
    {
      id: 'randstad',
      name: 'Randstad',
      logo: randstadLogo
    }
  ];

  const handleCompanySelect = (companyId: string) => {
    localStorage.setItem('selectedCompany', companyId);
    
    if (companyId === 'dhl') {
      localStorage.setItem('isDHLSelection', 'true');
      localStorage.setItem('dhlSelectionTimestamp', Date.now().toString());
    }
    
    navigate(`/register/${companyId}`);
  };

  // Animation variants matching AnimatedWelcome
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      <UnifiedNavbar rightContent={<NavbarRightContent />} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <motion.div
          className="w-full max-w-4xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center space-y-4" variants={itemVariants}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto px-4">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Company Logo Buttons */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto" variants={itemVariants}>
            {companies.map((company) => (
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  onClick={() => handleCompanySelect(company.id)}
                  variant="outline"
                  className="w-full h-32 md:h-40 p-6 flex flex-col items-center justify-center hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 group"
                  title={company.name}
                >
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-200 group-hover:scale-110"
                  />
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center space-y-4 pt-8 border-t border-border/50"
            variants={itemVariants}
          >
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-primary/20 text-foreground hover:bg-primary/10 hover:text-foreground shadow-sm"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t('loginButton')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanySelector;
