import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createPromptsString } from "./prompts.op.js";
import { actionsReducer } from "./actions.op.js";
import consoleUtils from "../utils/consoleFunctions.js";

/**
 * Initiates the user chat.
 */
export async function startChat(initialPrompts, labelsJson) {
  const rl = readline.createInterface({ input, output });
  try {
    consoleUtils.info(labelsJson.welcomePage);
    let closeChat = false;
    while (!closeChat) {
      closeChat = await chat(initialPrompts, rl);
    }
  } finally {
    rl.close();
  }
}

/**
 * Handles user chat.
 *
 * @param {Prompt[]} prompts Prompts to be shown.
 * @param {readline.Interface} rlInterface Interface to get user input.
 * @returns {Promise<Boolean>} true - if the chat needs to terminated. false - if the chat needs to be restarted.
 */
export async function chat(prompts, rlInterface) {
  // Print the options on the console.
  const promptStr = createPromptsString(prompts);
  consoleUtils.options(promptStr);

  // Prompt the user for a response.
  const response = await rlInterface.question(
    consoleUtils.prompt("Enter your response: ")
  );

  // If response is 9, exit the chat.
  if (response === "9") {
    return true;
  }

  // Fetch the subquery based on the option, and take action.
  const chosenPrompt = prompts[Number(response)];

  // If option is invalid, send the same options again.
  if (!chosenPrompt) {
    consoleUtils.error(
      `Invalid option '${response}'.\nPlease select a valid option.`
    );
    return await chat(prompts, rlInterface);
  }

  if (chosenPrompt.action) {
    // Perform some action.
    const response = await actionsReducer(chosenPrompt.action, rlInterface);
    return response;
  } else {
    // Show next set of options.
    return await chat(chosenPrompt.subPrompts, rlInterface);
  }
}
