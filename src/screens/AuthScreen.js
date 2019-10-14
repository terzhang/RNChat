import React, { useContext } from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const AuthScreen = ({ navigation }) => {
  // get state and login callback from AuthContext to dispatch and modify global state
  const { state, logIn, signUp, clearErrorMsg } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginBottom: 50 }}>
      <NavigationEvents
        // onWillFocus={() => {}} // called when about to navigate here
        // onDidFocus={() => {}} // called after navigating here
        onWillBlur={clearErrorMsg} // called when about to navigate away from here
        // onDidBlur={() => {}} // called after navigating away from here
      />
      <AuthForm
        submit={'Log in'}
        onSubmit={({ email, password }) => {
          logIn({ email: email, password: password }, () =>
            navigation.navigate('Main')
          );
        }}
        signUp={'Register'}
        onSignUp={({ email, password }) =>
          signUp({ email: email, password: password }, () =>
            navigation.navigate('Main')
          )
        }
        errorMsg={state.errorMsg}
      />
    </View>
  );
};

AuthScreen.navigationOptions = () => {
  return {
    header: null,
    headerTitle: 'Account Login',
    headerTitleStyle: {
      justifyContent: 'center'
    }
  };
};

export default AuthScreen;
