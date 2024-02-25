import { promises as fsPromises } from 'fs';
import { startChat } from './operations/chat.op.js';
import store from './store/store.js';

/**
 * Main Function.
 */
async function main() {
  try {
    const [promptBuffer, userBuffer, labelBuffer] = await Promise.all([
      fsPromises.readFile('./data/prompts.json'),
      fsPromises.readFile('./data/users.json'),
      fsPromises.readFile('./data/labels.json'),
    ]);

    /**
     * @type {import('./types/index.js').Prompt[]}
     */
    const promptsJson = JSON.parse(promptBuffer);
    /**
     * @type {import('./types/index.js').User[]}
     */
    const usersJson = JSON.parse(userBuffer);
    /**
     * @type {Object}
     */
    const labelsJson = JSON.parse(labelBuffer);

    store.dispatch({ type: 'label/setLabel', payload: labelsJson });
    startChat(promptsJson, usersJson);
  } catch (err) {
    throw new Error(
      `Error loading config data. Please report this issue to the administrator.`,
      { cause: err },
    );
  }
}

main();
