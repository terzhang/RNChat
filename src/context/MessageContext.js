import createDataContext from '../helper/createDataContext';

// data shape
/* MessageData === [
  {
    _id: Number || String,
    text: String,
    createdAt: Date(),
    user: Object {
      _id: Number || String,
      name: String,
      avatar: Uri || Path
    }
] */

// initial state
const INITIAL_STATE = [
  {
    _id: 1,
    text: 'Hello developer',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any'
    }
  }
];

// reducer
const messageReducer = (state, action) => {
  switch (action.type) {
  case 'addMessage':
    return [...state, action.payload];
  default:
    return state;
  }
};

// actions
const addMessage = dispatch => message => {
  dispatch({ type: 'addMessage', payload: message });
};

const messageActions = { addMessage };

// create context
const MessageContext = createDataContext(
  messageReducer,
  messageActions,
  INITIAL_STATE
);
export const { Context, Provider } = MessageContext;
