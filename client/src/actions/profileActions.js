import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from './types';

// GET current profile
export const getCurrentProfile = () => dispatch => {
  // loading state from profileReducer, will be here true
  dispatch(setProfileLoading());
  // make the request
  // find a profile
  axios.get('/api/profile')
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        // send the actual profile data
        payload: res.data
      })
    )
    .catch(error =>
      dispatch({
        type: GET_PROFILE,
        // return an empty obj if there is not already one profile
        // and send the user to create a profile
        payload: {}
      })
    );
}

// Loading before request
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}