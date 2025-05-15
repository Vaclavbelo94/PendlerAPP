
// Utility functions for generating and formatting chart data for user profile

// Function to generate sample data for user activity visualization
export const generateActivityData = (days: number = 14) => {
  const data = [];
  const date = new Date();
  
  // Generate activity data for the last X days
  for (let i = days - 1; i >= 0; i--) {
    const currentDate = new Date(date);
    currentDate.setDate(date.getDate() - i);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      activities: Math.floor(Math.random() * 8) + 1, // Random number 1-8
      lessons: Math.floor(Math.random() * 5), // Random number 0-4
      translations: Math.floor(Math.random() * 10), // Random number 0-9
    });
  }
  
  return data;
};

// Function to generate data for language skill progress
export const generateLanguageSkillsData = () => {
  return [
    { name: "Listening", value: Math.floor(Math.random() * 50) + 50 }, // 50-100
    { name: "Reading", value: Math.floor(Math.random() * 50) + 50 },
    { name: "Writing", value: Math.floor(Math.random() * 50) + 40 }, // 40-90
    { name: "Speaking", value: Math.floor(Math.random() * 50) + 30 }, // 30-80
    { name: "Grammar", value: Math.floor(Math.random() * 50) + 45 }, // 45-95
  ];
};

// Function to format date based on user preferences
export const formatDateByPreference = (
  dateString: string | Date, 
  format: string = "dd.MM.yyyy"
): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  switch (format) {
    case "MM/dd/yyyy":
      return `${month}/${day}/${year}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "dd.MM.yyyy":
    default:
      return `${day}.${month}.${year}`;
  }
};

// Function to format time based on user preferences
export const formatTimeByPreference = (
  timeString: string, 
  format: string = "24h"
): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    return timeString;
  }
  
  if (format === "12h") {
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
