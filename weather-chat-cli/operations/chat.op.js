import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  createPromptsString,
  createUserPromptString,
  filterPromptsByCondition,
} from './prompts.op.js';
import { actionsReducer } from './actions.op.js';
import consoleUtils from '../utils/consoleFunctions.js';
import store from '../store/store.js';

let labels;

/**
 * Shows user the options, receives the response and evaluates if it is invalid.
 * If the response is invalid, retriggers the call to get a valid input.
 *
 * If the user selects exit option "null" is returned.
 * Else returns the chosenOption object.
 *
 * @template T
 * @param {string} prompt Prompt to be shown to the user.
 * @param {string} questionStr The string to be used while asking user for response
 * @param {T[]} data Data
 * @param {readline.Interface} rlInterface Interface to get user input.
 *
 * @returns {Promise<T>}
 */
async function getPromptResponse(prompt, questionStr, data, rlInterface) {
  consoleUtils.options(prompt);

  const response = await rlInterface.question(consoleUtils.prompt(questionStr));

  if (response === '9') {
    return null;
  }

  const chosenOption = data[Number(response)];

  if (!chosenOption) {
    consoleUtils.error(
      `Invalid option '${response}'.\nPlease select a valid option.`,
    );
    return await getPromptResponse(prompt, questionStr, data, rlInterface);
  }

  return chosenOption;
}

/**
 * Initiates the user chat.
 *
 * @param {import('../types/index.js').Prompt[]} prompts Prompts
 * @param {import('../types/index.js').User[]} users Users
 */
export async function startChat(prompts, users) {
  labels = store.getState((state) => state.label);
  const rl = readline.createInterface({ input, output });
  try {
    consoleUtils.info(labels.welcomePage);
    let closeChat = false;

    closeChat = await selectUserChat(users, rl);
    if (closeChat) return;

    const { selectedUser } = store.getState((state) => state.app);
    consoleUtils.info('Selected User: ', selectedUser.fullName);

    while (!closeChat) {
      // eslint-disable-next-line no-await-in-loop
      closeChat = await chat(prompts, rl);
    }
  } finally {
    rl.close();
  }
}

/**
 * Handles user chat.
 *
 * @param {import('../types/index.js').Prompt[]} prompts Prompts to be shown.
 * @param {readline.Interface} rlInterface Interface to get user input.
 * @returns {Promise<boolean>} true - if the chat needs to terminated. false - if the chat needs to be restarted.
 */
export async function chat(prompts, rlInterface) {
  const { selectedUser: user } = store.getState((state) => state.app);

  const filteredPrompts = filterPromptsByCondition(prompts);

  // Print the options on the console.
  const promptStr = createPromptsString(filteredPrompts);
  const chosenPrompt = await getPromptResponse(
    promptStr,
    'Enter your response: ',
    filteredPrompts,
    rlInterface,
  );

  if (chosenPrompt === null) {
    return true;
  }

  if (chosenPrompt.action) {
    // Perform some action.
    const response = await actionsReducer(
      chosenPrompt.action,
      user,
      rlInterface,
    );
    return response;
  }
  // Show next set of options.
  return await chat(chosenPrompt.subPrompts, rlInterface);
}

/**
 * Prompts the user to select a user.
 *
 * @param {import('../types/index.js').User[]} users Users
 * @param {readline.Interface} rlInterface Interface to get user input.
 */
export async function selectUserChat(users, rlInterface) {
  const promptStr = createUserPromptString(users);
  const chosenUser = await getPromptResponse(
    promptStr,
    'Enter your option: ',
    users,
    rlInterface,
  );

  if (chosenUser === null) {
    return true;
  }
  store.dispatch({ type: 'user/select', payload: chosenUser });

  return false;
}
