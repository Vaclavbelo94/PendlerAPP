
import React from 'react';
import { GDPRConsentSection } from './privacy/GDPRConsentSection';
import { GDPRRightsSection } from './privacy/GDPRRightsSection';
import { useTranslation } from 'react-i18next';

const PrivacySettings = () => {
  const { t } = useTranslation('settings');
  
  return (
    <div className="space-y-6">
      <GDPRConsentSection />
      <GDPRRightsSection />
    </div>
  );
};

export default PrivacySettings;
