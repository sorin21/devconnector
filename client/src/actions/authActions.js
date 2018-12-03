import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER, TEST_MY_DISPATCH } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  // dispatch something to our reducer we have to return an obj 
  // that must have a type
  // this.setState({ errors: error.response.data })
  axios.post('/api/users/register', userData)
    // if the user registered, redirect to login
    .then(res => history.push('/login'))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
}

// Login - Get User Token
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then((res) => {
      // Save to local storage
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem('jwtToken', token);
      // set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    );
}

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Test
export const registerMyUser = (userData) => {
  return {
    type: TEST_MY_DISPATCH,
    payload: userData
  }
}