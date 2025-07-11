import { supabase } from "@/integrations/supabase/client";

export interface WocheCalculationResult {
  currentWoche: number;
  weekStartDate: Date;
  weekEndDate: Date;
  cyclePosition: number;
  calendarWeek: number;
  rotatedWoche: number;
}

export interface UserWocheInfo {
  current_woche?: number;
  reference_date?: string;
  reference_kw?: string;
}

export class WocheCalculatorService {
  /**
   * Calculate which Woche a user should have for a specific calendar week
   * Formula: target_woche = (current_woche + (target_kw - current_kw - 1)) % 15 + 1
   */
  static calculateWocheForKW(
    userCurrentWoche: number,
    currentKW: number,
    targetKW: number
  ): number {
    if (userCurrentWoche < 1 || userCurrentWoche > 15) {
      throw new Error('Current Woche must be between 1 and 15');
    }

    // Handle year rollover (KW53 -> KW01)
    let kwDifference = targetKW - currentKW;
    if (kwDifference < -26) {
      // Target KW is in next year
      kwDifference += 53;
    } else if (kwDifference > 26) {
      // Target KW is in previous year
      kwDifference -= 53;
    }

    const calculatedWoche = ((userCurrentWoche - 1 + kwDifference) % 15 + 15) % 15 + 1;
    return calculatedWoche;
  }

  /**
   * Get current calendar week from date
   */
  static getCalendarWeek(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const startOfWeek = startOfYear.getDay() || 7; // Monday = 1, Sunday = 7
    const weekNumber = Math.ceil((dayOfYear + startOfWeek - 1) / 7);
    
    // Handle ISO week numbering edge cases
    if (weekNumber === 0) {
      return 52; // First few days of year belong to last week of previous year
    }
    if (weekNumber > 52) {
      const dec31 = new Date(date.getFullYear(), 11, 31);
      if (this.getCalendarWeek(dec31) === 1) {
        return 1; // Last few days belong to first week of next year
      }
    }
    
    return Math.min(weekNumber, 53);
  }

  /**
   * Get user's Woche information from database
   */
  static async getUserWocheInfo(userId: string): Promise<UserWocheInfo | null> {
    const { data, error } = await supabase
      .from('user_dhl_assignments')
      .select('current_woche, reference_date')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching user Woche info:', error);
      return null;
    }

    // For now, use current KW as reference since reference_kw might not exist yet
    const currentKW = `KW${this.getCalendarWeek(new Date()).toString().padStart(2, '0')}`;
    
    return {
      current_woche: data?.current_woche,
      reference_date: data?.reference_date,
      reference_kw: currentKW
    };
  }

  /**
   * Calculate user's Woche for a specific date
   */
  static async calculateUserWocheForDate(userId: string, targetDate: Date): Promise<WocheCalculationResult | null> {
    const userInfo = await this.getUserWocheInfo(userId);
    if (!userInfo) {
      return null;
    }

    const currentKW = this.getCalendarWeek(new Date());
    const targetKW = this.getCalendarWeek(targetDate);
    
    // Extract KW number from reference_kw (e.g., "KW28" -> 28)
    const referenceKWNumber = parseInt(userInfo.reference_kw.replace('KW', ''));
    
    const rotatedWoche = this.calculateWocheForKW(
      userInfo.current_woche,
      referenceKWNumber,
      targetKW
    );

    // Calculate week boundaries
    const weekStartDate = new Date(targetDate);
    weekStartDate.setDate(targetDate.getDate() - targetDate.getDay() + 1); // Monday
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // Sunday

    return {
      currentWoche: userInfo.current_woche,
      weekStartDate,
      weekEndDate,
      cyclePosition: (rotatedWoche - 1) % 15 + 1,
      calendarWeek: targetKW,
      rotatedWoche
    };
  }

  /**
   * Get shifts for user's calculated Woche for a specific KW
   */
  static async getUserShiftsForKW(userId: string, kw: string): Promise<any[]> {
    const kwNumber = parseInt(kw.replace('KW', ''));
    const targetDate = new Date();
    // Approximate date for the KW (this could be improved with better date calculation)
    targetDate.setDate(targetDate.getDate() + (kwNumber - this.getCalendarWeek(new Date())) * 7);
    
    const wocheResult = await this.calculateUserWocheForDate(userId, targetDate);
    if (!wocheResult) {
      return [];
    }

    // Get user's position
    const { data: userAssignment } = await supabase
      .from('user_dhl_assignments')
      .select('dhl_position_id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (!userAssignment) {
      return [];
    }

    // Get shifts for the calculated Woche and user's position
    const { data: shifts, error } = await supabase
      .from('dhl_shift_schedules')
      .select('*')
      .eq('calendar_week', parseInt(kw.replace('KW', '')))
      .eq('woche_group', wocheResult.rotatedWoche)
      .eq('position_id', userAssignment.dhl_position_id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching shifts:', error);
      return [];
    }

    return shifts || [];
  }

  /**
   * Update user's Woche information
   */
  static async updateUserWoche(
    userId: string, 
    currentWoche: number, 
    referenceKW?: string
  ): Promise<boolean> {
    const currentDate = new Date();
    const kw = referenceKW || `KW${this.getCalendarWeek(currentDate).toString().padStart(2, '0')}`;

    const { error } = await supabase
      .from('user_dhl_assignments')
      .update({
        current_woche: currentWoche,
        reference_date: currentDate.toISOString().split('T')[0],
        reference_kw: kw,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error updating user Woche:', error);
      return false;
    }

    return true;
  }
}