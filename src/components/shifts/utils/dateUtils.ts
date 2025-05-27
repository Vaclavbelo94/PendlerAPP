
/**
 * Helper function to format date correctly for database
 * Zajišťuje správné formátování data bez problémů s časovými zónami
 */
export const formatDateForDB = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Helper function to create date from DB string
 * Vytváří datum z databázového řetězce bez problémů s časovými zónami
 */
export const dateFromDBString = (dateString: string): Date => {
  // Používáme lokální datum místo UTC, aby se zabránilo posunu o den
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Helper function to compare dates (ignoring time)
 * Porovnává pouze datumovou část, ignoruje čas
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};
