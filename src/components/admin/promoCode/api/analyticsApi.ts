
import { supabase } from "@/integrations/supabase/client";
import { PromoCodeAnalytics, UsageOverTimeData, DiscountDistributionData, PromoCodeBreakdown } from "../types";
import { mapDbToPromoCode } from "../utils/promoCodeMappers";

/**
 * Fetches analytics data for promo codes
 */
export const fetchPromoCodeAnalytics = async (
  timeframe: "week" | "month" | "year" = "month"
): Promise<PromoCodeAnalytics> => {
  try {
    // Get date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case "week":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Fetch all promo codes
    const { data: promoCodes, error: promoCodesError } = await supabase
      .from('promo_codes')
      .select('*');
    
    if (promoCodesError) throw promoCodesError;

    // Fetch redemptions within the time period
    const { data: redemptions, error: redemptionsError } = await supabase
      .from('promo_code_redemptions')
      .select('*, promo_codes(*)')
      .gte('redeemed_at', startDate.toISOString())
      .lte('redeemed_at', endDate.toISOString());
    
    if (redemptionsError) throw redemptionsError;

    // Calculate metrics
    const mappedCodes = promoCodes.map(mapDbToPromoCode);
    
    // Calculate total redemptions
    const totalRedemptions = redemptions.length;
    
    // Calculate active promo codes (not expired)
    const now = new Date();
    const activeCodes = mappedCodes.filter(code => new Date(code.validUntil) > now);
    
    // Calculate average discount
    const totalDiscount = mappedCodes.reduce((sum, code) => sum + code.discount, 0);
    const averageDiscount = Math.round(mappedCodes.length > 0 ? totalDiscount / mappedCodes.length : 0);
    
    // Find most used code
    let mostUsedCode = '';
    let mostUsedCodeCount = 0;
    
    if (mappedCodes.length > 0) {
      const mostUsed = [...mappedCodes].sort((a, b) => b.usedCount - a.usedCount)[0];
      mostUsedCode = mostUsed.code;
      mostUsedCodeCount = mostUsed.usedCount;
    }
    
    // Generate usage over time data
    const usageOverTime = generateUsageOverTimeData(mappedCodes, redemptions, startDate, endDate, timeframe);
    
    // Generate discount distribution data
    const discountDistribution = generateDiscountDistributionData(mappedCodes);
    
    // Generate code breakdown
    const codeBreakdown = generateCodeBreakdownData(mappedCodes);

    // Mock trends data (in a real app, you would calculate these based on historical data)
    const discountTrend = Math.round((Math.random() * 20) - 5);
    const activeCodesTrend = Math.round((Math.random() * 15));
    
    return {
      totalPromoCodes: mappedCodes.length,
      totalRedemptions,
      activePromoCodes: activeCodes.length,
      averageDiscount,
      mostUsedCode,
      mostUsedCodeCount,
      usageOverTime,
      discountDistribution,
      codeBreakdown,
      discountTrend,
      activeCodesTrend
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};

/**
 * Generates time-series data for promo code usage
 */
const generateUsageOverTimeData = (
  promoCodes: any[], 
  redemptions: any[], 
  startDate: Date, 
  endDate: Date,
  timeframe: string
): UsageOverTimeData[] => {
  const result: UsageOverTimeData[] = [];
  
  // Determine date increment and format based on timeframe
  let dateIncrement: number;
  let totalPoints: number;
  
  switch (timeframe) {
    case "week":
      dateIncrement = 1; // Daily for a week
      totalPoints = 7;
      break;
    case "month":
      dateIncrement = 2; // Every 2 days for a month
      totalPoints = 15;
      break;
    case "year":
      dateIncrement = 30; // Monthly for a year
      totalPoints = 12;
      break;
    default:
      dateIncrement = 1;
      totalPoints = 30;
  }
  
  // Generate data points
  for (let i = 0; i < totalPoints; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + (i * dateIncrement));
    
    // Count redemptions for this date
    const dayRedemptions = redemptions.filter(r => {
      const redeemedDate = new Date(r.redeemed_at);
      
      if (timeframe === "year") {
        // For yearly view, group by month
        return redeemedDate.getMonth() === date.getMonth() && 
               redeemedDate.getFullYear() === date.getFullYear();
      } else {
        // For weekly/monthly view, compare exact dates
        return redeemedDate.getDate() === date.getDate() && 
               redeemedDate.getMonth() === date.getMonth() && 
               redeemedDate.getFullYear() === date.getFullYear();
      }
    }).length;
    
    // Count codes created on this date (in a real app, you'd use actual creation dates)
    const dayCreated = promoCodes.filter(c => {
      const createdDate = new Date(c.created_at || Date.now());
      
      if (timeframe === "year") {
        return createdDate.getMonth() === date.getMonth() && 
               createdDate.getFullYear() === date.getFullYear();
      } else {
        return createdDate.getDate() === date.getDate() && 
               createdDate.getMonth() === date.getMonth() && 
               createdDate.getFullYear() === date.getFullYear();
      }
    }).length;
    
    result.push({
      date: date.toISOString(),
      redemptions: dayRedemptions,
      created: dayCreated
    });
  }
  
  return result;
};

/**
 * Generates data for discount distribution pie chart
 */
const generateDiscountDistributionData = (promoCodes: any[]): DiscountDistributionData[] => {
  // Group codes by discount percentage
  const discountGroups: { [key: string]: number } = {};
  
  promoCodes.forEach(code => {
    // Round to nearest 10% for better grouping (5%, 10%, 15%, etc.)
    const roundedDiscount = Math.round(code.discount / 5) * 5;
    
    if (!discountGroups[roundedDiscount]) {
      discountGroups[roundedDiscount] = 0;
    }
    
    discountGroups[roundedDiscount]++;
  });
  
  // Convert to array format for the chart
  const result: DiscountDistributionData[] = Object.keys(discountGroups)
    .map(discount => ({
      discount: parseInt(discount),
      value: discountGroups[discount]
    }))
    .sort((a, b) => a.discount - b.discount);
  
  return result;
};

/**
 * Generates detailed breakdown data for each promo code
 */
const generateCodeBreakdownData = (promoCodes: any[]): PromoCodeBreakdown[] => {
  return promoCodes.map(code => ({
    ...code,
    redemptionRate: code.maxUses ? (code.usedCount / code.maxUses) * 100 : 0
  }));
};
