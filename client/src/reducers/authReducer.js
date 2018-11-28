const initialState = {
  isAuthenticated: false,
  user: {},
  hello: 'test'
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // case SET_CURRENT_USER:
    // return our modified version of state

    default:
      return state;
  }
}

export default authReducer;