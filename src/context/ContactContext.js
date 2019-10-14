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
    _id: 1234,
    name: 'React Native',
    avatar: 'https://placeimg.com/140/140/any'
  },
  {
    _id: 5678,
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
// make a post request to server with ...
// ... email and contactId to add into user's associated contacts array in database
const addContact = dispatch => (profile, state) => {
  console.log('profile', profile);
  console.log('state', state);
  const { contactId, email, avatar } = profile;
  try {
    const response = serverApi.post('/contacts', {
      email,
      contactId
    });
    const payload = { _id: contactId, email, avatar: avatar ? avatar : null };
    dispatch({ type: 'addContact', payload: payload });
  } catch (error) {
    console.error(error);
  }
};

// get all contacts associated with this user authentication and set the contacts in state
const fetchContacts = dispatch => async () => {
  try {
    const response = await serverApi.get('/contacts');
    const contacts = response.data[0].contacts; // res data is an array containing only one object so get it at index 0
    console.log('got contacts: ', contacts);
    dispatch({ type: 'setContacts', payload: contacts });
  } catch (error) {
    console.error(error);
  }
};

const deleteContact = () => () => {
  console.warn('delete contact: not yet implemented');
};

const contactActions = {
  addContact,
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
