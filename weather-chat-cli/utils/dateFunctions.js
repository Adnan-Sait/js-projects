/**
 * Formats and returns the timestamp.
 *
 * @param {Date} dateTime Date
 * @returns {String} Formatted Time
 */
export function getFormattedTimeZone(dateTime) {
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour12: "string",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(dateTime);
  return timeFormat;
}
