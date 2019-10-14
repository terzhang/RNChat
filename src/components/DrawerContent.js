import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';

const DrawerContent = (containerStyle = null) => {
  const { logOut } = React.useContext(AuthContext);
  return (
    <View style={[styles.container, containerStyle]}>
      <Button
        title="Log out"
        titleStyle={{ color: 'white' }}
        onPress={() => logOut()}
        buttonStyle={{ backgroundColor: 'red' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default DrawerContent;
