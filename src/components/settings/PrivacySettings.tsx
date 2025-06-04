
import React from 'react';
import { GDPRConsentSection } from './privacy/GDPRConsentSection';
import { GDPRRightsSection } from './privacy/GDPRRightsSection';

const PrivacySettings = () => {
  return (
    <div className="space-y-6">
      <GDPRConsentSection />
      <GDPRRightsSection />
    </div>
  );
};

export default PrivacySettings;
