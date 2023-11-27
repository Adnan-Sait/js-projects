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
