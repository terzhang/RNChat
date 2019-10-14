import createDataContext from '../helper/createDataContext'; // exports {Context, Provider}
import trackerApi, { setAuthToken } from '../api/server';
import { AsyncStorage } from 'react-native';
import { navigate } from '../helper/navigationRef'; // helper function to navigate using ref

/* 
  0. Authentication Data === ?
  1. initialState
  2. reducer
  3. actions
  4. Create Data Context with 1, 2, 3 then export it
*/

// Create a custom context with createDataContext(reducer, actions, initialState)
// Use the custom context provider to provide callbacks for children to dispatch actions
// dispatched actions are handled by the reducer and the reducer manage the global state.

// 0) Authentication Data === { errorMsg: string, token: string || null}

// 1) token signifies the user's login status where null is not logged in, and !null is logged in

const INITIAL_STATE = {
  errorMsg: '',
  email: '',
  token: null,
  userId: ''
};

// 2) authReducer to handle all the authentication data change to global state
const authReducer = (state, action) => {
  switch (action.type) {
  case 'setError':
    return { ...state, errorMsg: action.payload };
  case 'signUp': // 'signing up and logging in does the same action
  case 'logIn':
    return { ...state, errorMsg: '', token: action.payload }; // set token and reset error message
  case 'logOut':
    return { ...state, token: null, email: '', userId: '', errorMsg: '' }; // reset token and reset error message
  case 'storeEmail':
    return { ...state, email: action.payload };
  case 'storeUserId':
    return { ...state, userId: action.payload };
  default:
    return state;
  }
};

// 3) actions

// on the authStackNav, try the stored token login if it exists
const tryTokenLogIn = dispatch => async (
  callbackOnSuccess,
  callbackOnFailure
) => {
  // get token
  /* const token = await AsyncStorage.getItem('token'); */ // ! don't forget the await keyword
  // https://docs.expo.io/versions/latest/react-native/asyncstorage/#multiget
  const resArray = await AsyncStorage.getItem.multiGet([
    'token',
    'email',
    'userId'
  ]);
  const token = resArray[0][1];
  const email = resArray[1][1];
  const userId = resArray[2][0];

  // onNull, go to login screen
  if (!token) {
    callbackOnFailure();
  } else {
    // onExist, try logging in and then navigating to main track tabs
    dispatch({ type: 'logIn', payload: token });
    dispatch({ type: 'storeEmail', payload: email }); // store email in state
    dispatch({ type: 'storeUserId', payload: userId }); // store user id in state
    setAuthToken(token);
    callbackOnSuccess();
  }
};

const signUp = dispatch => async ({ email, password }, callbackOnSuccess) => {
  // try to make api request to '/signup' endpoint given email and password
  try {
    const response = await trackerApi.post('/signup', {
      email: email,
      password: password
    });

    // onSuccess, deconstruct the response data
    // respond data === { token, userId }
    const { token, userId } = response.data;

    // store data in async storage to persist through each instance
    /* await AsyncStorage.setItem('token', token); */
    await AsyncStorage.multiSet([
      ['token', token],
      ['email', email],
      ['userId', userId]
    ]);
    setAuthToken(token); // assign default authorization token for axios calls
    dispatch({ type: 'signUp', payload: token }); // call reducer
    dispatch({ type: 'storeEmail', payload: email }); // store email in state
    dispatch({ type: 'storeUserId', payload: userId }); // store user id in state
    callbackOnSuccess(); // do a callback on success
  } catch (error) {
    // onError
    /* console.error(error.message); */
    dispatch({
      type: 'setError',
      payload: 'Duplicate or Invalid email given. Try a different email.'
    });
  }
};

const logIn = dispatch => async ({ email, password }, callbackOnSuccess) => {
  // attempt login
  try {
    const response = await trackerApi.post('/signin', {
      email: email,
      password: password
    });
    // onSuccess, deconstruct the response data
    // respond data === { token, userId}
    const { token, userId } = response.data;
    // store token in storage
    /* await AsyncStorage.setItem('token', token); */

    await AsyncStorage.multiSet([
      ['token', token],
      ['email', email],
      ['userId', userId]
    ]);
    setAuthToken(token); // assign default authorization token for axios calls
    dispatch({ type: 'logIn', payload: token }); // store token in global state
    dispatch({ type: 'storeEmail', payload: email }); // store email in state
    dispatch({ type: 'storeUserId', payload: userId }); // store _id in state
    callbackOnSuccess(); // do a callback on success
  } catch (error) {
    // onError
    /* console.error(error); */
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
  // take the token out of storage
  /* await AsyncStorage.removeItem('token'); */

  await AsyncStorage.multiRemove(['token', 'email', 'userId']);
  dispatch({ type: 'logOut' }); // dispatch the token removal action
  navigate('Auth'); // navigate using reference to navigation from top level app container
};

const locationActions = { signUp, logIn, logOut, clearErrorMsg, tryTokenLogIn };

// 4) create authentication context and export its Context and Provider as an object
// remember createDataContext generate a custom array of {Context, Provider}
export const { Context, Provider } = createDataContext(
  authReducer,
  locationActions,
  INITIAL_STATE
);
