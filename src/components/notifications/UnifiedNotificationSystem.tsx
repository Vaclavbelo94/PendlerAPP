import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { MobileNotificationTrigger } from '@/components/mobile/MobileNotificationTrigger';
import { CompactNotificationIndicator } from './CompactNotificationIndicator';

export const UnifiedNotificationSystem: React.FC = () => {
  const { isMobile } = useResponsive();

  // On mobile, use the trigger that opens a slide-out panel
  // On desktop, use compact indicator with popover or navigate to page
  if (isMobile) {
    return <MobileNotificationTrigger />;
  }

  // On desktop, you can use popover or navigate to page
  return <CompactNotificationIndicator />;
};