import { Shift } from '@/components/shifts/types';

export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

export const generateShiftEvents = (shifts: Shift[]): CalendarEvent[] => {
  return shifts.map(shift => {
    const shiftDate = new Date(shift.date);
    const startTime = getShiftStartTime(shift.type);
    const endTime = getShiftEndTime(shift.type);
    
    const startDate = new Date(shiftDate);
    startDate.setHours(startTime.hours, startTime.minutes, 0, 0);
    
    const endDate = new Date(shiftDate);
    endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
    
    return {
      title: `${getShiftTypeName(shift.type)} směna`,
      description: shift.notes || `${getShiftTypeName(shift.type)} směna`,
      startDate,
      endDate,
      location: 'Pracoviště'
    };
  });
};

export const generateAmortizationEvents = (
  scheduleWithDates: (import('@/hooks/useAmortizationSchedule').AmortizationRow & { date: Date })[],
  loanAmount: number,
  monthlyPayment: number
): CalendarEvent[] => {
  return scheduleWithDates.map((row, index) => {
    const startDate = new Date(row.date);
    const endDate = new Date(row.date);
    endDate.setHours(endDate.getHours() + 1); // 1 hour duration
    
    return {
      title: `Splátka úvěru - ${row.period}. měsíc`,
      description: `Splátka č. ${row.period}: ${monthlyPayment.toLocaleString('cs-CZ')} Kč (úrok: ${row.interest.toLocaleString('cs-CZ')} Kč, jistina: ${row.principal.toLocaleString('cs-CZ')} Kč)`,
      startDate,
      endDate,
      location: 'Banka'
    };
  });
};

const getShiftStartTime = (type: string) => {
  switch (type) {
    case 'morning': return { hours: 6, minutes: 0 };
    case 'afternoon': return { hours: 14, minutes: 0 };
    case 'night': return { hours: 22, minutes: 0 };
    default: return { hours: 8, minutes: 0 };
  }
};

const getShiftEndTime = (type: string) => {
  switch (type) {
    case 'morning': return { hours: 14, minutes: 0 };
    case 'afternoon': return { hours: 22, minutes: 0 };
    case 'night': return { hours: 6, minutes: 0 };
    default: return { hours: 16, minutes: 0 };
  }
};

const getShiftTypeName = (type: string) => {
  switch (type) {
    case 'morning': return 'Ranní';
    case 'afternoon': return 'Odpolední';
    case 'night': return 'Noční';
    default: return 'Standardní';
  }
};

export const generateICSContent = (events: CalendarEvent[]): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PendlerApp//Shifts Calendar//EN',
    'CALSCALE:GREGORIAN'
  ].join('\r\n');

  events.forEach((event, index) => {
    icsContent += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:shift-${index}-${Date.now()}@pendlerapp.com`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      event.location ? `LOCATION:${event.location}` : '',
      `CREATED:${formatDate(new Date())}`,
      'END:VEVENT'
    ].filter(Boolean).join('\r\n');
  });

  icsContent += '\r\nEND:VCALENDAR';
  return icsContent;
};

export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description,
    location: event.location || ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateOutlookCalendarUrl = (event: CalendarEvent): string => {
  const params = new URLSearchParams({
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: event.description,
    location: event.location || ''
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
