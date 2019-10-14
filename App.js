import React from 'react';
import { View } from 'react-native';
import { Provider as MessageProvider } from './src/context/MessageContext';
import { Provider as ContactProvider } from './src/context/ContactContext';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerNavigatorItems
} from 'react-navigation-drawer';
import ChatScreen from './src/screens/ChatScreen';
import AuthScreen from './src/screens/AuthScreen';
import ContactListScreen from './src/screens/ContactListScreen';
import LandingScreen from './src/screens/LandingScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/helper/navigationRef'; // set a reference to navigation
import DrawerContent from './src/components/DrawerContent';

const chatFlow = createStackNavigator({
  ContactList: {
    screen: ContactListScreen
  },
  Chat: {
    screen: ChatScreen
  }
});

const contentComponent = props => {
  return (
    <View style={{ paddingVertical: 40, flex: 1 }}>
      {/* DrawerNavigationItems are the routes set in the CreateDrawNavigation */}
      <DrawerNavigatorItems {...props} />
      <DrawerContent
        containerStyle={{
          flex: 1,
          justifyContent: 'flex-end'
        }}
      />
    </View>
  );
};

const mainFlow = createDrawerNavigator(
  {
    chatFlow: {
      screen: chatFlow
    }
  },
  {
    // props: https://reactnavigation.org/docs/en/drawer-navigator.html#contentoptions-for-drawernavigatoritems
    // drawer nav items are the routes set in the createDrawerNavigation
    contentComponent: props => contentComponent(props),
    contentOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      activeBackgroundColor: 'lightskyblue',
      inactiveBackgroundColor: 'lightblue',
      itemStyle: {
        alignItems: 'center'
      },
      labelStyle: {
        alignItems: 'center'
      }
    }
  }
);

const authFlow = createSwitchNavigator({
  Landing: {
    screen: LandingScreen
  },
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
          <AppContainer ref={authFlow => setNavigator(authFlow)} />
        </MessageProvider>
      </ContactProvider>
    </AuthProvider>
  );
};

export default App;
