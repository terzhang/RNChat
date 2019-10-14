import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-elements';

const Profile = ({ profile }) => {
  if (!profile.avatar) {
    profile.avatar = '../../assets/default_avatar.png';
  }

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        source={{
          uri: profile.avatar
        }}
      />
      <View style={styles.body}>
        <Text h3 h3Style={{ fontWeight: 'bold', color: 'white' }}>
          PLACEHOLDER
        </Text>
        <Text h4 h4Style={{ color: 'gray' }}>
          {profile.email}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'darkturquoise',
    borderRadius: 20
  },
  body: {
    flexDirection: 'column'
  }
});

export default Profile;
