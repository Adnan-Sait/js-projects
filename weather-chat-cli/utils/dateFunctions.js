/**
 * Formats and returns the timestamp.
 *
 * @param {Date} date Date
 * @returns {String} Formatted Time
 */
export function getFormattedTimeZone(date) {
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour12: "string",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
  return timeFormat;
}

/**
 * Formats the date as a string.
 *
 * @param {Date} date Date
 * @returns {String}
 */
export function getGmtFormattedDateTime(date) {
  return new Date(date).toISOString();
}
