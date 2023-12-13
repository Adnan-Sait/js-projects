import store from "../store/store.js";
import { EXIT_PROMPT } from "../utils/constants.js";

/**
 * Creates the prompts string.
 *
 * @param {import("../index.js").Prompt[]} prompts
 */
export function createPromptsString(prompts) {
  return [...prompts, EXIT_PROMPT]
    .map((val, index) => `${val.option ?? index}: ${val.label}`)
    .join("\n");
}

/**
 * Creates the user prompt.
 *
 * @param {import("../index.js").User[]} users Users
 */
export function createUserPromptString(users) {
  const usersPrompt = users
    .map(
      (val, index) =>
        `${index}: ${[val.fullName, val.city, val.country]
          .filter(Boolean)
          .join(", ")}`
    )
    .join("\n");
  const exitPrompt = `${EXIT_PROMPT.option}: ${EXIT_PROMPT.label}`;

  return `${usersPrompt}\n${exitPrompt}`;
}

/**
 * Filters the prompts based on the condition.
 *
 * @param {import("../index.js").Prompt[]} prompts Prompts
 *
 * @returns {import("../index.js").Prompt[]}
 */
export function filterPromptsByCondition(prompts) {
  return prompts.filter(isPromptValid);
}

/**
 * Checks if the prompt meets the condition.
 * Supports 2 variables `user` & `logs`.
 *
 * @param {import("../index.js").Prompt} prompt Prompt
 *
 * @returns {Boolean}
 */
function isPromptValid(prompt) {
  if (!prompt.condition) return true;

  const { selectedUser: user, weatherTransactions: logs } = store.getState();
  return eval(prompt.condition);
}
