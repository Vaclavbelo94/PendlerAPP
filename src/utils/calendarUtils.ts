
/**
 * Utility functions for calendar integration
 */

/**
 * Generate an ICS file content for calendar events
 * @param events Array of calendar event objects
 * @returns String content of ICS file
 */
export const generateICSContent = (events: CalendarEvent[]): string => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pendlerhelfer//Calendar Integration//CS',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach(event => {
    const startDate = formatDateForICS(event.startDate);
    
    icsContent = [
      ...icsContent,
      'BEGIN:VEVENT',
      `UID:${Math.random().toString(36).substring(2)}@pendlerhelfer.app`,
      `DTSTAMP:${formatDateForICS(new Date())}`,
      `DTSTART:${startDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
    ];
    
    // Add optional location if provided
    if (event.location) {
      icsContent.push(`LOCATION:${event.location}`);
    }
    
    icsContent.push('END:VEVENT');
  });
  
  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

/**
 * Generate a Google Calendar URL for adding an event
 * @param event Calendar event object
 * @returns URL string for Google Calendar
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const startDate = event.startDate.toISOString().replace(/-|:|\.\d+/g, '');
  
  // Build the URL with required parameters
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: event.title,
    details: event.description || '',
    dates: `${startDate}/${startDate}`,
  });
  
  // Add location if provided
  if (event.location) {
    params.append('location', event.location);
  }
  
  return `${baseUrl}&${params.toString()}`;
};

/**
 * Format a date object for ICS file format
 * @param date Date object
 * @returns Formatted date string
 */
const formatDateForICS = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d+/g, '');
};

/**
 * Create a downloadable file from content
 * @param content File content
 * @param filename Filename with extension
 * @param mimeType MIME type of the file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Type definition for a calendar event
 */
export interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  location?: string;
}

/**
 * Generate amortization schedule calendar events from amortization rows
 * @param rows Array of amortization rows
 * @param loanAmount Initial loan amount
 * @param paymentAmount Monthly payment amount
 * @returns Array of calendar events
 */
export const generateAmortizationEvents = (
  rows: { period: number; payment: number; date?: Date }[],
  loanAmount: number,
  paymentAmount: number
): CalendarEvent[] => {
  // Use current date as starting point if dates not provided
  const startDate = new Date();
  
  return rows.map((row, index) => {
    // If row has a date, use it; otherwise calculate based on period
    const eventDate = row.date || new Date(startDate.getFullYear(), startDate.getMonth() + row.period, startDate.getDate());
    
    return {
      title: `Splátka půjčky #${row.period}`,
      description: `Pravidelná splátka půjčky ve výši ${paymentAmount.toFixed(2)} Kč. Původní výše půjčky: ${loanAmount.toFixed(2)} Kč.`,
      startDate: eventDate,
    };
  });
};

