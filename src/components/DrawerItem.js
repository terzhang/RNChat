import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

const DrawerItem = (title, color = 'red', onPress) => {
  return (
    <View style={{ flex: 1 }}>
      <Button
        title="Log out"
        titleStyle={{ color: 'white' }}
        onPress={() => onPress}
        buttonStyle={{ backgroundColor: color }}
      />
    </View>
  );
};

export default DrawerItem;
