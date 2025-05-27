
import React from 'react';
import { ErrorBoundaryWithFallback } from '@/components/common/ErrorBoundaryWithFallback';
import PracticalGermanLessons from './PracticalGermanLessons';

// Nová komponenta která nahrazuje původní složitou sekci
// Zachovává kompatibilitu s existujícím kódem
const VocabularySection = () => {
  return (
    <ErrorBoundaryWithFallback>
      <PracticalGermanLessons />
    </ErrorBoundaryWithFallback>
  );
};

export default VocabularySection;
