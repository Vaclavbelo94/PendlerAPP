import React from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import ShiftCalendar from '@/components/shifts/ShiftCalendar';

const Shifts = () => {
  return (
    <PremiumCheck featureKey="shifts">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Plánování směn</h1>
        <ShiftCalendar />
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
