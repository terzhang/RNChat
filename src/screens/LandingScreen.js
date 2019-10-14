import React, { useContext, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';

const LandingScreen = ({ navigation }) => {
  const { tryTokenLogIn } = useContext(AuthContext);

  // attempt to log in using stored token on first mount.
  useEffect(() => {
    tryTokenLogIn(
      () => navigation.navigate('Main'),
      () => navigation.navigate('Auth')
    );
  }, [tryTokenLogIn, navigation]);

  return <ActivityIndicator />;
};

export default LandingScreen;
