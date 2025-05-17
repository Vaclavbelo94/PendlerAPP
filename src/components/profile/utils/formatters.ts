
/**
 * Formats a date string to localized format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return "";
  }
};

/**
 * Gets the label for a shift type
 * @param type Shift type identifier
 * @returns Human-readable label
 */
export const getShiftTypeLabel = (type: string | undefined) => {
  if (!type) return "Nespecifikováno";
  
  const types: Record<string, string> = {
    "any": "Jakýkoli typ",
    "morning": "Ranní",
    "afternoon": "Odpolední",
    "night": "Noční",
    "weekday": "Pouze pracovní dny",
    "weekend": "Pouze víkendy"
  };
  
  return types[type] || type;
};
