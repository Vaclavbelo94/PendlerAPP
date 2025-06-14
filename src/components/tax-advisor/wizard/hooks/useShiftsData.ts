
import { useState, useEffect } from 'react';

interface ShiftsData {
  averageCommuteDistance: number;
  totalWorkDays: number;
  hasCommuteData: boolean;
}

export const useShiftsData = () => {
  const [shiftsData, setShiftsData] = useState<ShiftsData>({
    averageCommuteDistance: 0,
    totalWorkDays: 220,
    hasCommuteData: false
  });

  useEffect(() => {
    // Simulace načtení dat ze směn z localStorage nebo API
    const loadShiftsData = () => {
      try {
        const storedShifts = localStorage.getItem('pendlerapp_shifts');
        if (storedShifts) {
          const shifts = JSON.parse(storedShifts);
          
          // Výpočet průměrné vzdálenosti a počtu pracovních dní
          let totalDistance = 0;
          let workDaysCount = 0;
          
          shifts.forEach((shift: any) => {
            if (shift.commuteDistance) {
              totalDistance += shift.commuteDistance;
              workDaysCount++;
            }
          });
          
          const averageDistance = workDaysCount > 0 ? totalDistance / workDaysCount : 0;
          
          setShiftsData({
            averageCommuteDistance: Math.round(averageDistance),
            totalWorkDays: shifts.length || 220,
            hasCommuteData: workDaysCount > 0
          });
        }
      } catch (error) {
        console.log('Chyba při načítání dat ze směn:', error);
      }
    };

    loadShiftsData();
  }, []);

  return shiftsData;
};
