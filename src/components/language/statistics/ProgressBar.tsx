
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max, unit = 'slov' }) => {
  // Calculate percentage (not exceeding 100%)
  const percentage = Math.min((value / Math.max(max, 1)) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="font-medium">{value}/{max} {unit}</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
    </div>
  );
};

export default ProgressBar;
