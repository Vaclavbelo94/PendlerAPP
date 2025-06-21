
import React from 'react';
import { GDPRConsentSection } from './privacy/GDPRConsentSection';
import { GDPRRightsSection } from './privacy/GDPRRightsSection';
import { useLanguage } from '@/hooks/useLanguage';

const PrivacySettings = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <GDPRConsentSection />
      <GDPRRightsSection />
    </div>
  );
};

export default PrivacySettings;
