import createDataContext from '../helper/createDataContext';
import serverApi from '../api/server';

// Contact shape
/* ContactData === [
  Object {
    _id: Number || String,
    name: String,
    avatar: Uri || Path || Null
  }
] */

// initial state
const INITIAL_STATE = [
  {
    _id: 123,
    name: 'React Native',
    avatar: 'https://placeimg.com/140/140/any'
  },
  {
    _id: 1234,
    name: 'React Web',
    avatar: 'https://placeimg.com/140/140/any'
  }
];

// reducer
const contactReducer = (state, action) => {
  switch (action.type) {
  case 'addContact':
    return [...state, action.payload];
  case 'setContacts':
    return action.payload;
  default:
    return state;
  }
};

// actions
const addContact = dispatch => message => {
  dispatch({ type: 'addContact', payload: message });
};

const setContacts = dispatch => contacts => {
  // TODO: validate contacts before setting in state
  dispatch({ type: 'setContacts', payload: contacts });
};

const fetchContacts = dispatch => async id => {
  const response = await serverApi.get(`/users/${id}`);
  const contacts = response.data.contacts;
  dispatch({ type: 'setContacts', payload: contacts });
};

const deleteContact = () => () => {
  console.warn('delete contact: not yet implemented');
};

const contactActions = {
  addContact,
  setContacts,
  fetchContacts,
  deleteContact
};

// create context
const MessageContext = createDataContext(
  contactReducer,
  contactActions,
  INITIAL_STATE
);
export const { Context, Provider } = MessageContext;
