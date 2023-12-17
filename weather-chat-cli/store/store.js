/**
 * @type {import("..").AppState}
 */
const initialState = {
  selectedUser: {},
  weatherTransactions: [],
};

// Initializing state when store is imported.
let currentState = reducer();

/**
 * Updates the current state.
 *
 * @template T
 * @param {import("..").AppState} state Current State
 * @param {import("..").AppAction<T>} action Action triggered.
 *
 * @returns {import("..").AppState}
 */
function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case 'user/select': {
      return { ...state, selectedUser: payload };
    }
    case 'user/updateMetric': {
      const updatedUser = { ...state.selectedUser, defaultDegree: payload };
      return { ...state, selectedUser: updatedUser };
    }
    case 'user/updateCity': {
      const updatedUser = { ...state.selectedUser, ...payload };
      return { ...state, selectedUser: updatedUser };
    }
    case 'weather/add': {
      const updatedWeatherLogs = [...state.weatherTransactions, payload];
      return { ...state, weatherTransactions: updatedWeatherLogs };
    }
    default: {
      return state;
    }
  }
}

/**
 * Returns the current state.
 *
 * @returns {import("..").AppState}
 */
function getState() {
  return currentState;
}

/**
 * Invokes the reducer to update the state.
 *
 * @template T
 * @param {import("..").AppAction<T>} action Action
 */
function dispatch(action) {
  currentState = reducer(getState(), action);
}

const store = {
  getState,
  dispatch,
};

export default store;
