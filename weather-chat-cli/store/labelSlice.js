const initialState = {};

/**
 * Updates the current state.
 *
 * @template T
 * @param {Object} state Current State
 * @param {import("..").AppAction<T>} action Action triggered.
 *
 * @returns {Object}
 */
export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case 'label/setLabel': {
      return payload;
    }
    default: {
      return state;
    }
  }
}
