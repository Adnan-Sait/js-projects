import appReducer from './appSlice.js';

const slices = {
  app: appReducer,
  label: () => {},
};

// Initializing state when store is imported.
let currentState = loadInitialState();

function loadInitialState() {
  const initialState = {};
  Object.entries(slices).forEach((item) => {
    const [reducerName, reducerFn] = item;
    initialState[reducerName] = reducerFn();
  });

  return initialState;
}

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
 * @returns {import("..").AppState}
 */
function getState(selectorFn) {
  if (selectorFn) return selectorFn(currentState);

  return currentState;
}

/**
 * Invokes the reducer to update the state.
 *
 * @template T
 * @param {import("..").AppAction<T>} action Action
 */
function dispatch(action) {
  currentState = masterReducer(getState(), action);
}

const store = {
  getState,
  dispatch,
};

export default store;
