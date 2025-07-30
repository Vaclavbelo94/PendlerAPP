
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, LogIn } from 'lucide-react';
import UnifiedNavbar from '@/components/layouts/UnifiedNavbar';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';

interface CompanyOption {
  id: 'adecco' | 'randstad' | 'dhl';
  name: string;
  logo: string;
  description: string;
}

const CompanySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('companySelector');

  const companies: CompanyOption[] = [
    {
      id: 'dhl',
      name: 'DHL',
      logo: '📦',
      description: t('dhl.description')
    },
    {
      id: 'adecco',
      name: 'Adecco',
      logo: '🏢',
      description: t('adecco.description')
    },
    {
      id: 'randstad',
      name: 'Randstad',
      logo: '🔵',
      description: t('randstad.description')
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
          className="w-full max-w-2xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div className="text-center space-y-4" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Company Buttons */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {companies.map((company) => (
              <motion.div
                key={company.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handleCompanySelect(company.id)}
                  variant="outline"
                  className="w-full h-auto p-6 flex items-center justify-between text-left hover:bg-accent/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{company.logo}</span>
                    <div>
                      <div className="font-semibold text-lg">{company.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {company.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
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
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80"
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
