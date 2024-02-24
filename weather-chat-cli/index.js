import fs from 'node:fs';
import { startChat } from './operations/chat.op.js';
import store from './store/store.js';

/**
 * @type {import('./types/index.js').Prompt[]}
 */
const promptsJson = JSON.parse(fs.readFileSync('./data/prompts.json'));
/**
 * @type {import('./types/index.js').User[]}
 */
const usersJson = JSON.parse(fs.readFileSync('./data/users.json'));
const labelsJson = JSON.parse(fs.readFileSync('./data/labels.json'));

store.dispatch({ type: 'label/setLabel', payload: labelsJson });

/**
 * Main Function.
 */
async function main() {
  startChat(promptsJson, usersJson);
}

main();
