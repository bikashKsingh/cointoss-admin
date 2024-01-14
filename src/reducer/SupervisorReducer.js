export const initialState = null;

export const supervisorReducer = (state, action) => {
  if (action.type == "SUPERVISOR") {
    return action.payload;
  } else if (action.type == "CLEAR") {
    return initialState;
  } else {
    return state;
  }
};
