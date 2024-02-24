import fs from 'node:fs';
import { startChat } from './operations/chat.op.js';
import store from './store/store.js';

/**
 * @type {import('./types/index.js').Prompt[]}
 */
let promptsJson;
/**
 * @type {import('./types/index.js').User[]}
 */
let usersJson;
/**
 * @type {Object}
 */
let labelsJson;

store.dispatch({ type: 'label/setLabel', payload: labelsJson });

/**
 * Main Function.
 */
async function main() {
  startChat(promptsJson, usersJson);
}

try {
  promptsJson = JSON.parse(fs.readFileSync('./data/prompts.json'));
  usersJson = JSON.parse(fs.readFileSync('./data/users.json'));
  labelsJson = JSON.parse(fs.readFileSync('./data/labels.json'));
} catch (err) {
  throw new Error(
    `Error loading config data. Please report this issue to the administrator.`,
    { cause: err },
  );
}

main();
