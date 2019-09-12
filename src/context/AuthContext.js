import createDataContext from '../helper/createDataContext'; // exports {Context, Provider}
import trackerApi from '../api/server';
import { AsyncStorage } from 'react-native'; // wants to store token. // helper function to navigate using ref
/* import { navigate } from '../helper/navigationRef'; */ // Create a custom context with createDataContext(reducer, actions, initialState)
// Use the custom context provider to provide callbacks for children to dispatch actions
// dispatched actions are handled by the reducer and the reducer manage the global state.
/* 
  0. Authentication Data === ?
  1. initialState
  2. reducer
  3. actions
  4. Create Data Context with 1, 2, 3 then export it
*/

// 0) Authentication Data === { errorMsg: string, token: string || null}
// 1) token signifies the user's login status where null is not logged in, and !null is logged in
const INITIAL_STATE = { errorMsg: '', email: '', token: null };

// 2) authReducer to handle all the authentication data change to global state
const authReducer = (state, action) => {
  switch (action.type) {
  case 'setError':
    return { ...state, errorMsg: action.payload };
  case 'signUp': // 'signing up and logging in does the same action
  case 'logIn':
    return { ...state, errorMsg: '', token: action.payload }; // set token and reset error message
  case 'logOut':
    return { ...state, token: null, errorMsg: '' }; // reset token and reset error message
  case 'storeEmail':
    return { ...state, email: action.payload };
  default:
    return state;
  }
};

// 3) actions

// on the authStackNav, try the stored token login if it exists
const tryTokenLogIn = dispatch => async () => {
  // get token
  const token = await AsyncStorage.getItem('token'); // ! don't forget the await keyword
  // console.log(token);
  // onNull, go to login screen
  if (!token) {
    /* navigate('LoginScreen'); */
  } else {
    // onExist, try logging in and then navigating to main track tabs
    dispatch({ type: 'logIn', payload: token });
    /* navigate('trackTabNav'); */
  }
};

const signUp = dispatch => async ({ email, password }) => {
  // try to make api request to '/signup' endpoint given email and password
  try {
    const response = await trackerApi.post('/signup', {
      email: email,
      password: password
    });
    // onSuccess, respond back with user being authenticated and store json web token
    const token = response.data.token; // get the token
    await AsyncStorage.setItem('token', token); // put token into storage with a key
    dispatch({ type: 'signUp', payload: token }); // call reducer
    dispatch({ type: 'storeEmail', payload: email }); // store email in state
    /* navigate('trackTabNav'); */ // navigate helper function using the ref set in App
  } catch (error) {
    // onError
    console.error('Failed sign up');
    console.error(error.message);
    dispatch({
      type: 'setError',
      payload: 'Duplicate or Invalid email given. Try a different email.'
    });
  }
};

const logIn = dispatch => async ({ email, password }) => {
  // attempt login
  try {
    const response = await trackerApi.post('/signin', {
      email: email,
      password: password
    });
    // onSuccess
    const token = response.data.token; // get json web token
    await AsyncStorage.setItem('token', token); // store token in storage
    dispatch({ type: 'logIn', payload: token }); // store token in global state
    dispatch({ type: 'storeEmail', payload: email }); // store email in state
    /* navigate('trackTabNav'); */
  } catch (error) {
    // onError
    console.error(error);
    dispatch({
      type: 'setError',
      payload: 'Wrong email or password given.'
    });
  }
};

const clearErrorMsg = dispatch => async () => {
  dispatch({
    type: 'setError',
    payload: ''
  });
};

const logOut = dispatch => async () => {
  // unset the token then navigate back into authStack
  await AsyncStorage.removeItem('token'); // take the token out of storage
  dispatch({ type: 'logOut' }); // dispatch the token removal action
  /* navigate('LoginScreen'); */
};

const locationActions = { signUp, logIn, logOut, clearErrorMsg, tryTokenLogIn };

// 4) create authentication context and export its Context and Provider as an object
// remember createDataContext generate a custom array of {Context, Provider}
export const { Context, Provider } = createDataContext(
  authReducer,
  locationActions,
  INITIAL_STATE
);
