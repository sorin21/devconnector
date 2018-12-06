import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
  profile: null,
  profiles: null,
  loading: false
};


const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        // current state
        ...state,
        loading: true,
      }
    case GET_PROFILE:
      return {
        ...state,
        // profile will be changed from null to res.data from profileActions
        // payload will be empty object if there is not a profile
        profile: action.payload,
        loading: false
      }
    case CLEAR_CURRENT_PROFILE:
      return {
        // current state
        ...state,
        // profile will be changed from null to res.data from profileActions
        // payload will be empty object if there is not a profile
        profile: null
      }
    default:
      return state
  }
};

export default profileReducer;