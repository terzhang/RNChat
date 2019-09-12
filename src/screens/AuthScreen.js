import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';

const AuthScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text h2> Skip Authentication for now :)</Text>
      <Button title={'Login'} onPress={() => navigation.navigate('Main')} />
    </View>
  );
};

export default AuthScreen;
