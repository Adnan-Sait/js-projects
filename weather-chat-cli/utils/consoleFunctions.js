/* eslint-disable no-console */
import chalk from 'chalk';

/**
 * Formats the informational logs.
 *
 * @param  {...any} args Log to be printed.
 */
function info(...args) {
  console.log(chalk.green(...args));
}

/**
 * Formats the options.
 *
 * @param  {...any} args Log to be printed.
 */
function options(...args) {
  console.log();
  console.log(chalk.blue(...args));
}

/**
 * Formats the prompt and returns it.
 *
 * @param  {...any} args Log to be printed.
 * @returns
 */
function prompt(...args) {
  console.log();
  return chalk.yellow(...args);
}

/**
 * Formats the data.
 *
 * @param  {...any} args Log to be printed.
 */
function data(...args) {
  console.log();
  console.log(chalk.magenta(...args));
}

/**
 * Formats the error.
 *
 * @param  {...any} args Log to be printed.
 */
function error(...args) {
  console.log();
  console.log(chalk.red(...args));
}

const consoleUtils = {
  info,
  options,
  prompt,
  data,
  error,
};

export default consoleUtils;
