
export interface EmailReportData {
  userEmail: string;
  userName: string;
  shifts: Array<{
    date: Date;
    type: string;
    notes: string;
  }>;
  month: Date;
}

export class EmailReportService {
  private static instance: EmailReportService;

  static getInstance(): EmailReportService {
    if (!EmailReportService.instance) {
      EmailReportService.instance = new EmailReportService();
    }
    return EmailReportService.instance;
  }

  async sendMonthlyReport(data: EmailReportData): Promise<boolean> {
    try {
      // Pro demonstraci - v reálné aplikaci by se používal Supabase Edge Function
      console.log('Zasílám měsíční report na email:', data.userEmail);
      
      // Simulace úspěšného odeslání
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Chyba při odesílání emailu:', error);
      return false;
    }
  }

  async scheduleMonthlyReports(userEmail: string): Promise<void> {
    // Naplánovat automatické zasílání reportů
    console.log('Nastavuji automatické zasílání pro:', userEmail);
    
    // V reálné aplikaci by se použil cron job nebo scheduled function
    localStorage.setItem('monthly_report_email', userEmail);
  }

  generateEmailContent(data: EmailReportData): string {
    const { shifts, month, userName } = data;
    
    const morningCount = shifts.filter(s => s.type === 'morning').length;
    const afternoonCount = shifts.filter(s => s.type === 'afternoon').length;
    const nightCount = shifts.filter(s => s.type === 'night').length;
    
    return `
      Dobrý den ${userName},
      
      zasíláme Vám měsíční přehled směn za ${month.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}:
      
      📊 SOUHRN:
      • Ranní směny: ${morningCount} (${morningCount * 8}h)
      • Odpolední směny: ${afternoonCount} (${afternoonCount * 8}h)
      • Noční směny: ${nightCount} (${nightCount * 8}h)
      • Celkem: ${shifts.length} směn (${shifts.length * 8}h)
      
      📅 DETAIL SMĚN:
      ${shifts.map(shift => 
        `${shift.date.toLocaleDateString('cs-CZ')} - ${
          shift.type === 'morning' ? 'Ranní' : 
          shift.type === 'afternoon' ? 'Odpolední' : 'Noční'
        }${shift.notes ? ` (${shift.notes})` : ''}`
      ).join('\n')}
      
      S pozdravem,
      PendlerApp tým
    `;
  }
}
