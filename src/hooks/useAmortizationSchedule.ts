
import { useState } from 'react';

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export function useAmortizationSchedule() {
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);

  const calculateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    periods: number,
    monthlyPayment: number
  ) => {
    const amortizationSchedule: AmortizationRow[] = [];
    let balance = principal;
    
    for (let period = 1; period <= periods; period++) {
      // Calculate interest for this period
      const interestPayment = balance * monthlyRate;
      
      // Calculate principal for this period
      const principalPayment = monthlyPayment - interestPayment;
      
      // Update remaining balance
      balance -= principalPayment;
      
      // Fix potential negative balance in the last payment due to rounding
      if (period === periods) {
        if (Math.abs(balance) < 0.01) {
          balance = 0;
        }
      }
      
      // Add row to schedule
      amortizationSchedule.push({
        period,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, balance)
      });
    }
    
    setSchedule(amortizationSchedule);
    return amortizationSchedule;
  };

  return {
    schedule,
    calculateAmortizationSchedule
  };
}
