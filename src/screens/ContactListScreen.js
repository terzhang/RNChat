import React from 'react';
import { View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { FlatList, NavigationEvents } from 'react-navigation';
import { Context as ContactContext } from '../context/ContactContext';

const ContactListScreen = ({ navigation }) => {
  const { state, fetchContacts } = React.useContext(ContactContext);

  const renderItem = item => (
    <ListItem
      title={item.name}
      // subtitle={item.subtitle}
      leftAvatar={{ source: { uri: item.avatar } }}
      bottomDivider
      // go to ChatScreen with id as param
      onPress={() => navigation.navigate('Chat', { user: item })}
      chevron
    />
  );

  return (
    <View>
      {/* <NavigationEvents onWillFocus={fetchContacts} /> */}
      <FlatList
        keyExtractor={item => String(item._id)} //index.toString}
        data={state}
        renderItem={({ item }) => renderItem(item)}
      />
    </View>
  );
};

ContactListScreen.navigationOptions = {
  title: 'Contacts'
};

export default ContactListScreen;
