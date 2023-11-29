import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createPromptsString, createUserPromptString } from "./prompts.op.js";
import { actionsReducer } from "./actions.op.js";
import consoleUtils from "../utils/consoleFunctions.js";

/**
 * Shows user the options, receives the response and evaluates if it is invalid.
 * If the response is invalid, retriggers the call to get a valid input.
 *
 * If the user selects exit option "null" is returned.
 * Else returns the chosenOption object.
 *
 * @template T
 * @param {String} prompt Prompt to be shown to the user.
 * @param {String} questionStr The string to be used while asking user for response
 * @param {T[]} data Data
 * @param {readline.Interface} rlInterface Interface to get user input.
 *
 * @returns {Promise<T>}
 */
async function getPromptResponse(prompt, questionStr, data, rlInterface) {
  consoleUtils.options(prompt);

  const response = await rlInterface.question(consoleUtils.prompt(questionStr));

  if (response === "9") {
    return null;
  }

  const chosenOption = data[Number(response)];

  if (!chosenOption) {
    consoleUtils.error(
      `Invalid option '${response}'.\nPlease select a valid option.`
    );
    return await getPromptResponse(prompt, questionStr, data, rlInterface);
  }

  return chosenOption;
}

/**
 * Initiates the user chat.
 */
export async function startChat(chatOptions, users, labelsJson) {
  const rl = readline.createInterface({ input, output });
  try {
    consoleUtils.info(labelsJson.welcomePage);
    let closeChat = false;

    closeChat = await selectUserChat(users, rl);

    while (!closeChat) {
      closeChat = await chat(chatOptions, rl);
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
  const chosenPrompt = await getPromptResponse(
    promptStr,
    "Enter your response: ",
    prompts,
    rlInterface
  );

  if (chosenPrompt === null) {
    return true;
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

/**
 * Prompts the user to select a user.
 *
 * @param {import("../index.js").User[]} users Users
 * @param {readline.Interface} rlInterface Interface to get user input.
 */
export async function selectUserChat(users, rlInterface) {
  const promptStr = createUserPromptString(users);
  const chosenUser = await getPromptResponse(
    promptStr,
    "Enter your option: ",
    users,
    rlInterface
  );

  if (chosenUser === null) {
    return true;
  }

  consoleUtils.info("Selected User: ", chosenUser.fullName);

  return false;
}
