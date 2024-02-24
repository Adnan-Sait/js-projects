import appReducer from './appSlice.js';
import labelReducer from './labelSlice.js';

/**
 * @type {Object.<string, Function>}
 */
const slices = {
  app: appReducer,
  label: labelReducer,
};

// Initializing state when store is imported.
let currentState = loadInitialState();

/**
 * Initializes the initial state.
 * Invokes the reducer for all slices to generate the initial state.
 *
 * @returns {Object}
 */
function loadInitialState() {
  const initialState = {};
  Object.entries(slices).forEach((item) => {
    const [reducerName, reducerFn] = item;
    initialState[reducerName] = reducerFn();
  });

  return initialState;
}

/**
 * Reducer to handle all state updates.
 * Invokes the required slice reducer based on the action type
 *
 * @param {Object} state State
 * @param {import('../types/index.js').AppAction<Object>} action Action
 *
 * @returns {Object}
 */
function masterReducer(state, action = {}) {
  const { type } = action;
  let tempState = state;

  if (type?.startsWith('label')) {
    tempState = { ...state, label: slices.label(currentState.label, action) };
  } else {
    tempState = { ...state, app: slices.app(currentState.app, action) };
  }

  return tempState;
}

/**
 * Returns the current state.
 *
 * @param {Function} selectorFn Function with state parameter.
 *
 * @returns {import('../types/index.js').AppState}
 */
function getState(selectorFn) {
  if (selectorFn) return selectorFn(currentState);

  return currentState;
}

/**
 * Invokes the reducer to update the state.
 *
 * @template T
 * @param {import('../types/index.js').AppAction<T>} action Action
 */
function dispatch(action) {
  currentState = masterReducer(getState(), action);
}

/**
 * @type {Object.<string, Function>}
 */
const store = {
  getState,
  dispatch,
};

export default store;
