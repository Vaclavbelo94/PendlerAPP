
export interface ShiftNotification {
  id: string;
  shiftId: string;
  title: string;
  body: string;
  scheduledFor: Date;
  type: 'reminder' | 'daily_summary';
}

export class ShiftNotificationService {
  private static instance: ShiftNotificationService;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): ShiftNotificationService {
    if (!ShiftNotificationService.instance) {
      ShiftNotificationService.instance = new ShiftNotificationService();
    }
    return ShiftNotificationService.instance;
  }

  async scheduleShiftReminder(shift: any) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    // Calculate reminder time (30 minutes before shift)
    const shiftDateTime = new Date(`${shift.date}T${this.getShiftStartTime(shift.type)}`);
    const reminderTime = new Date(shiftDateTime.getTime() - 30 * 60 * 1000);
    const now = new Date();

    if (reminderTime <= now) return; // Don't schedule past reminders

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      this.showNotification(
        'Směna začíná za 30 minut',
        `${this.getShiftTypeName(shift.type)} směna v ${this.getShiftStartTime(shift.type)}`,
        shift.id
      );
    }, timeUntilReminder);

    this.scheduledNotifications.set(shift.id, timeoutId);

    // Store in localStorage for persistence
    const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '{}');
    reminders[shift.id] = {
      scheduledFor: reminderTime.toISOString(),
      shiftType: shift.type,
      shiftDate: shift.date
    };
    localStorage.setItem('scheduled_reminders', JSON.stringify(reminders));
  }

  private getShiftStartTime(type: string): string {
    switch (type) {
      case 'morning': return '06:00';
      case 'afternoon': return '14:00';
      case 'night': return '22:00';
      default: return '06:00';
    }
  }

  private getShiftTypeName(type: string): string {
    switch (type) {
      case 'morning': return 'Ranní';
      case 'afternoon': return 'Odpolední';
      case 'night': return 'Noční';
      default: return 'Neznámá';
    }
  }

  private showNotification(title: string, body: string, tag: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        tag,
        icon: '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
        requireInteraction: true
      });
    }
  }

  async scheduleDailySummary() {
    // Schedule daily summary at 18:00
    const now = new Date();
    const today18 = new Date(now);
    today18.setHours(18, 0, 0, 0);
    
    if (today18 <= now) {
      today18.setDate(today18.getDate() + 1);
    }

    const timeUntilSummary = today18.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendDailySummary();
      // Schedule next day
      this.scheduleDailySummary();
    }, timeUntilSummary);
  }

  private async sendDailySummary() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Get today's and tomorrow's shifts from localStorage
    const shifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    const todayShifts = shifts.filter((s: any) => s.date.startsWith(today));
    const tomorrowShifts = shifts.filter((s: any) => s.date.startsWith(tomorrowStr));

    let summaryText = 'Denní souhrn směn:\n';
    
    if (todayShifts.length > 0) {
      summaryText += `Dnes: ${todayShifts.length} směn dokončeno\n`;
    }
    
    if (tomorrowShifts.length > 0) {
      const nextShift = tomorrowShifts[0];
      summaryText += `Zítra: ${this.getShiftTypeName(nextShift.type)} směna v ${this.getShiftStartTime(nextShift.type)}`;
    } else {
      summaryText += 'Zítra: Žádné naplánované směny';
    }

    this.showNotification('Denní souhrn', summaryText, 'daily_summary');
  }

  cancelShiftReminder(shiftId: string) {
    const timeoutId = this.scheduledNotifications.get(shiftId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(shiftId);
    }

    // Remove from localStorage
    const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '{}');
    delete reminders[shiftId];
    localStorage.setItem('scheduled_reminders', JSON.stringify(reminders));
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  restoreScheduledReminders() {
    const reminders = JSON.parse(localStorage.getItem('scheduled_reminders') || '{}');
    const now = new Date();

    Object.entries(reminders).forEach(([shiftId, reminder]: [string, any]) => {
      const scheduledTime = new Date(reminder.scheduledFor);
      if (scheduledTime > now) {
        // Re-schedule this reminder
        const shift = {
          id: shiftId,
          date: reminder.shiftDate,
          type: reminder.shiftType
        };
        this.scheduleShiftReminder(shift);
      }
    });
  }
}
