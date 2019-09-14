import React from 'react';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { Provider as ContactProvider } from './src/context/ContactContext';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ChatScreen from './src/screens/ChatScreen';
import AuthScreen from './src/screens/AuthScreen';
import ContactListScreen from './src/screens/ContactListScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';

const mainFlow = createStackNavigator({
  ContactList: {
    screen: ContactListScreen
  },
  Chat: {
    screen: ChatScreen
  }
});

const authFlow = createSwitchNavigator({
  Auth: {
    screen: AuthScreen
  },
  Main: {
    screen: mainFlow
  }
});

const AppContainer = createAppContainer(authFlow);

const App = () => {
  return (
    <AuthProvider>
      <ContactProvider>
        <MessageProvider>
          <AppContainer />
        </MessageProvider>
      </ContactProvider>
    </AuthProvider>
  );
};

export default App;
