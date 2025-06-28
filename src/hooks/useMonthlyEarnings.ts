
// This hook has been removed and replaced with real data calculations
// in DashboardStats.tsx using useShiftsData and useWorkData hooks.
// All functionality is now handled by components directly accessing
// the database through proper hooks.

export const useMonthlyEarnings = () => {
  console.warn('⚠️ useMonthlyEarnings is deprecated. Use useShiftsData and useWorkData instead.');
  
  return {
    monthlyEarnings: [],
    isLoading: false,
    error: null,
    amount: 0,
    hoursWorked: 0,
    shiftsCount: 0,
    hasWageSet: false,
  };
};
