
import React from 'react';
import LawCard from './LawCard';

interface LawItem {
  id: string;
  title: string;
  description: string;
  category: string;
  updated: string;
  iconName: string;
  iconColor: string;
  path: string;
}

interface LawsGridProps {
  laws: LawItem[];
}

export const LawsGrid: React.FC<LawsGridProps> = ({ laws }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {laws.map((law) => (
      <LawCard key={law.id} law={law} />
    ))}
  </div>
);

export default LawsGrid;
