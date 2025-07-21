import { format, addDays, parseISO } from 'date-fns';

/**
 * Generate an array of 24 empty slots for a day
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} - Array of 24 slot objects
 */
export const generateEmptySlots = (date) => {
  const slots = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1) % 24}`.padStart(2, '0') + ':00';
    
    slots.push({
      id: `empty-${date}-${startTime}`,
      date: date,
      start_time: startTime,
      end_time: endTime,
      is_blocked: false,
      block_reason: null
    });
  }
  
  return slots;
};

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const formatDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get previous day
 * @param {Date} date - Date object
 * @returns {Date} - Previous day
 */
export const getPreviousDay = (date) => {
  return addDays(date, -1);
};

/**
 * Get next day
 * @param {Date} date - Date object
 * @returns {Date} - Next day
 */
export const getNextDay = (date) => {
  return addDays(date, 1);
};

/**
 * Format time string (HH:MM) to display format (HH:MM AM/PM)
 * @param {string} time - Time in HH:MM format
 * @returns {string} - Time in HH:MM AM/PM format
 */
export const formatTimeDisplay = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Create block data for API request
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {string} reason - Reason for blocking
 * @returns {Object} - Block data for API
 */
export const createBlockData = (date, startTime, endTime, reason = 'Blocked by admin') => {
  return {
    date: date,
    start_time: startTime,
    end_time: endTime,
    reason: reason
  };
};

/**
 * Merge API slots with empty slots
 * @param {Array} emptySlots - Array of empty slots
 * @param {Array} apiSlots - Array of slots from API
 * @returns {Array} - Merged slots
 */
export const mergeSlots = (emptySlots, apiSlots) => {
  if (!apiSlots || apiSlots.length === 0) {
    return emptySlots;
  }
  
  return emptySlots.map(emptySlot => {
    const matchingSlot = apiSlots.find(apiSlot => 
      apiSlot.start_time === emptySlot.start_time && 
      apiSlot.date === emptySlot.date
    );
    
    // If we found a matching slot from API, use it (it has real data including blocked status)
    // If no matching slot, it means this time slot doesn't exist in database, so keep as empty/available
    return matchingSlot || emptySlot;
  });
}; 