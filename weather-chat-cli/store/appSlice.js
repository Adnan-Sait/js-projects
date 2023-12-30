/**
 * @type {import("..").AppState}
 */
const initialState = {
  selectedUser: {},
  weatherTransactions: [],
};

/**
 * Updates the current state.
 *
 * @template T
 * @param {import("..").AppState} state Current State
 * @param {import("..").AppAction<T>} action Action triggered.
 *
 * @returns {import("..").AppState}
 */
export default function reducer(state = initialState, action = {}) {
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
