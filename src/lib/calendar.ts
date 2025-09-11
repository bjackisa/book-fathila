export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  details: string;
  location: string;
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateGoogleCalendarLink({
  title,
  start,
  end,
  details,
  location,
}: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
