
import React from 'react';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import GermanLessonsSection from './GermanLessonsSection';

// Wrapper komponenta která zachovává kompatibilitu s existujícím kódem
const VocabularySection = () => {
  return (
    <ErrorBoundaryWithFallback>
      <GermanLessonsSection />
    </ErrorBoundaryWithFallback>
  );
};

export default VocabularySection;
