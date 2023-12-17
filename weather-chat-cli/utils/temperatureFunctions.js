import chalk from 'chalk';
import { DEGREE_UNIT } from './constants.js';

/**
 * Determines the weather severity.
 * Converts to celsius if unit is fahrenheit.
 *
 * @param {Number} val Temperature
 * @param {"celsius" | "fahrenheit"} unit Temperature Unit
 * @returns
 */
export function findWeatherSeverity(val, unit) {
  let temp = val;
  if (unit === DEGREE_UNIT.f) {
    temp = fahrenheitToCelsius(val);
  }

  if (temp > 30) {
    return 'hot';
  }
  if (temp < 10) {
    return 'cold';
  }

  return 'normal';
}

/**
 * Converts temperature to Celsius.
 *
 * @param {Number} temp Temperature
 * @returns
 */
function fahrenheitToCelsius(temp) {
  return ((temp - 32) * 5) / 9;
}

/**
 * Styles the temperature string based on severity.
 *
 * @param {Number} value Temperature
 * @param {"hot" | "cold" | "normal"} severity Severity
 * @returns
 */
export function formatTemperature(value, severity) {
  let valStr = String(value);
  if (severity === 'cold') {
    valStr = chalk.cyan(valStr);
  } else if (severity === 'hot') {
    valStr = chalk.red(valStr);
  }

  return valStr;
}
