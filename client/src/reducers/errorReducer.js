import { GET_ERRORS } from '../actions/types'

const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // return our modified version of state
    case GET_ERRORS:
      return action.payload;

    default:
      return state;
  }
}

export default authReducer;