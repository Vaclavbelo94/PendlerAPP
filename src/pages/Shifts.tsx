
import React, { useState } from 'react';
import PremiumCheck from '@/components/premium/PremiumCheck';
import { ShiftCalendar } from '@/components/shifts/ShiftCalendar';

const Shifts = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState([]);

  return (
    <PremiumCheck featureKey="shifts">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Plánování směn</h1>
        <ShiftCalendar 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          shifts={shifts}
        />
      </div>
    </PremiumCheck>
  );
};

export default Shifts;
