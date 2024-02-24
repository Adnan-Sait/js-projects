import store from '../store/store.js';
import { EXIT_PROMPT } from '../utils/constants.js';

/**
 * Creates the prompts string.
 *
 * @param {import('../types/index.js').Prompt[]} prompts
 */
export function createPromptsString(prompts) {
  return [...prompts, EXIT_PROMPT]
    .map((val, index) => `${val.option ?? index}: ${val.label}`)
    .join('\n');
}

/**
 * Creates the user prompt.
 *
 * @param {import('../types/index.js').User[]} users Users
 */
export function createUserPromptString(users) {
  const usersPrompt = users
    .map(
      (val, index) =>
        `${index}: ${[val.fullName, val.city, val.country]
          .filter(Boolean)
          .join(', ')}`,
    )
    .join('\n');
  const exitPrompt = `${EXIT_PROMPT.option}: ${EXIT_PROMPT.label}`;

  return `${usersPrompt}\n${exitPrompt}`;
}

/**
 * Filters the prompts based on the condition.
 *
 * @param {import('../types/index.js').Prompt[]} prompts Prompts
 *
 * @returns {import('../types/index.js').Prompt[]}
 */
export function filterPromptsByCondition(prompts) {
  return prompts.filter(isPromptValid);
}

/**
 * Checks if the prompt meets the condition.
 * Supports 2 variables `user` & `logs`.
 *
 * @param {import('../types/index.js').Prompt} prompt Prompt
 *
 * @returns {Boolean}
 */
function isPromptValid(prompt) {
  if (!prompt.condition) return true;

  // Variables to be used by the eval expression.
  // eslint-disable-next-line no-unused-vars
  const { selectedUser: user, weatherTransactions: logs } = store.getState(
    (state) => state.app,
  );
  // eslint-disable-next-line no-eval
  return eval(prompt.condition);
}
