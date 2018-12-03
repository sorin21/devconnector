import { TEST_MY_DISPATCH, SET_CURRENT_USER } from '../actions/types'
import isEmmpty from '../validation/is-empty'

const initialState = {
  isAuthenticated: false,
  user: {},
  hello: 'test'
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // return our modified version of state
    case TEST_MY_DISPATCH:
      return {
        // copy the state
        ...state,
        // fill the user(from the state), with that payload
        hello: action.payload
      }

    case SET_CURRENT_USER:
      return {
        // copy the current state
        ...state,
        // fill the user(from the state), with that payload
        isAuthenticated: !isEmmpty(action.payload),
        user: action.payload
      }

    default:
      return state;
  }
}

export default authReducer;