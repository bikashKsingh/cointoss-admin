export const initialState = null;

export const deliveryBoyReducer = (state, action) => {
  if (action.type == "DELIVERY_BOY") {
    return action.payload;
  } else if (action.type == "CLEAR") {
    return initialState;
  } else {
    return state;
  }
};
